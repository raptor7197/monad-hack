// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {MockGovernanceToken} from "./MockGovernanceToken.sol";
import {MockRiskRegistry} from "./MockRiskRegistry.sol";

/// @title FlipGuardGovernance
/// @notice Minimal proposal + vote contract that enforces snapshot voting power, a minimum holding
///         period and risk-registry flags before a vote is accepted.
/// @dev Blocked votes revert with `VoteBlocked(reason)`. A reverted tx keeps no events, so blocked
///      attempts are surfaced through the `assessVoter` preflight, not a persistent log.
contract FlipGuardGovernance is Ownable {
    enum Reason {
        ELIGIBLE,
        NO_PROPOSAL,
        NOT_ACTIVE,
        ALREADY_VOTED,
        NO_VOTING_POWER,
        RISK_FLAGGED,
        RECENT_ACQUISITION
    }

    struct Proposal {
        string title;
        address proposer;
        uint48 snapshot;
        uint48 start;
        uint48 end;
        uint256 forVotes;
        uint256 againstVotes;
    }

    MockGovernanceToken public immutable token;
    MockRiskRegistry public immutable registry;
    uint48 public minHoldingPeriod;
    uint256 public proposalCount;

    mapping(uint256 => Proposal) internal _proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(
        uint256 indexed id, address indexed proposer, string title, uint48 snapshot, uint48 start, uint48 end
    );
    event VoteCast(uint256 indexed id, address indexed voter, bool support, uint256 weight);
    event MinHoldingPeriodUpdated(uint48 period);

    error InvalidDuration();
    error VoteBlocked(Reason reason);

    constructor(MockGovernanceToken token_, MockRiskRegistry registry_, uint48 minHoldingPeriod_, address owner_)
        Ownable(owner_)
    {
        token = token_;
        registry = registry_;
        minHoldingPeriod = minHoldingPeriod_;
    }

    function setMinHoldingPeriod(uint48 period) external onlyOwner {
        minHoldingPeriod = period;
        emit MinHoldingPeriodUpdated(period);
    }

    /// @notice Snapshot is taken at creation; voting opens one second later and lasts `duration` seconds.
    function createProposal(string calldata title, uint48 duration) external returns (uint256 id) {
        if (duration == 0) revert InvalidDuration();
        uint48 snapshot = uint48(block.timestamp);
        id = ++proposalCount;
        _proposals[id] = Proposal(title, msg.sender, snapshot, snapshot + 1, snapshot + 1 + duration, 0, 0);
        emit ProposalCreated(id, msg.sender, title, snapshot, snapshot + 1, snapshot + 1 + duration);
    }

    function getProposal(uint256 id) external view returns (Proposal memory) {
        return _proposals[id];
    }

    /// @notice Same checks `castVote` enforces, for frontend preflight.
    function assessVoter(uint256 id, address voter)
        public
        view
        returns (bool eligible, uint256 weight, Reason reason, MockRiskRegistry.Risk risk)
    {
        risk = registry.riskOf(voter);
        Proposal storage p = _proposals[id];
        if (p.snapshot == 0) return (false, 0, Reason.NO_PROPOSAL, risk);
        // Window check first: getPastVotes reverts while block.timestamp == snapshot.
        if (block.timestamp < p.start || block.timestamp > p.end) return (false, 0, Reason.NOT_ACTIVE, risk);
        weight = token.getPastVotes(voter, p.snapshot);
        if (hasVoted[id][voter]) return (false, weight, Reason.ALREADY_VOTED, risk);
        if (weight == 0) return (false, 0, Reason.NO_VOTING_POWER, risk);
        if (risk != MockRiskRegistry.Risk.NONE) return (false, weight, Reason.RISK_FLAGGED, risk);
        if (token.lastAcquiredAt(voter) + minHoldingPeriod > p.snapshot) {
            return (false, weight, Reason.RECENT_ACQUISITION, risk);
        }
        return (true, weight, Reason.ELIGIBLE, risk);
    }

    function castVote(uint256 id, bool support) external {
        (bool eligible, uint256 weight, Reason reason,) = assessVoter(id, msg.sender);
        if (!eligible) revert VoteBlocked(reason);
        hasVoted[id][msg.sender] = true;
        if (support) _proposals[id].forVotes += weight;
        else _proposals[id].againstVotes += weight;
        emit VoteCast(id, msg.sender, support, weight);
    }
}
