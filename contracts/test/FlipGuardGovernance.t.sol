// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {MockGovernanceToken} from "../src/MockGovernanceToken.sol";
import {MockRiskRegistry} from "../src/MockRiskRegistry.sol";
import {FlipGuardGovernance} from "../src/FlipGuardGovernance.sol";

contract FlipGuardGovernanceTest is Test {
    MockGovernanceToken token;
    MockRiskRegistry registry;
    FlipGuardGovernance gov;

    address owner = makeAddr("owner");
    address clean = makeAddr("clean");
    address flagged = makeAddr("flagged");
    address recent = makeAddr("recent");
    address nobody = makeAddr("nobody");

    uint48 constant HOLD = 1 hours;
    uint48 constant DURATION = 1 days;

    function setUp() public {
        vm.warp(1_000_000);
        token = new MockGovernanceToken(owner);
        registry = new MockRiskRegistry(owner);
        gov = new FlipGuardGovernance(token, registry, HOLD, owner);

        vm.startPrank(owner);
        token.mint(clean, 100e18);
        token.mint(flagged, 50e18);
        registry.setRisk(flagged, MockRiskRegistry.Risk.BORROWING_RISK);
        vm.stopPrank();
    }

    function _proposal() internal returns (uint256 id) {
        vm.warp(block.timestamp + HOLD + 1);
        vm.prank(owner);
        token.mint(recent, 500e18); // acquired right before the snapshot
        id = gov.createProposal("Treasury Diversification", DURATION);
        vm.warp(block.timestamp + 1);
    }

    function _reason(uint256 id, address who) internal view returns (FlipGuardGovernance.Reason r) {
        (,, r,) = gov.assessVoter(id, who);
    }

    function _blocked(FlipGuardGovernance.Reason r) internal pure returns (bytes memory) {
        return abi.encodeWithSelector(FlipGuardGovernance.VoteBlocked.selector, r);
    }

    function test_CleanHolderVotesOnce() public {
        uint256 id = _proposal();
        (bool ok, uint256 w, FlipGuardGovernance.Reason r,) = gov.assessVoter(id, clean);
        assertTrue(ok);
        assertEq(w, 100e18);
        assertEq(uint8(r), uint8(FlipGuardGovernance.Reason.ELIGIBLE));

        vm.expectEmit(true, true, false, true);
        emit FlipGuardGovernance.VoteCast(id, clean, true, 100e18);
        vm.prank(clean);
        gov.castVote(id, true);
        assertEq(gov.getProposal(id).forVotes, 100e18);

        vm.prank(clean);
        vm.expectRevert(_blocked(FlipGuardGovernance.Reason.ALREADY_VOTED));
        gov.castVote(id, false);
    }

    function test_AgainstVoteCounts() public {
        uint256 id = _proposal();
        vm.prank(clean);
        gov.castVote(id, false);
        assertEq(gov.getProposal(id).againstVotes, 100e18);
        assertEq(gov.getProposal(id).forVotes, 0);
    }

    function test_FlaggedHolderBlocked() public {
        uint256 id = _proposal();
        assertEq(uint8(_reason(id, flagged)), uint8(FlipGuardGovernance.Reason.RISK_FLAGGED));
        vm.prank(flagged);
        vm.expectRevert(_blocked(FlipGuardGovernance.Reason.RISK_FLAGGED));
        gov.castVote(id, true);
    }

    function test_ClearingFlagRestoresEligibility() public {
        uint256 id = _proposal();
        vm.prank(owner);
        registry.setRisk(flagged, MockRiskRegistry.Risk.NONE);
        assertEq(uint8(_reason(id, flagged)), uint8(FlipGuardGovernance.Reason.ELIGIBLE));
        vm.prank(flagged);
        gov.castVote(id, true);
        assertEq(gov.getProposal(id).forVotes, 50e18);
    }

    function test_RecentAcquisitionBlocked() public {
        uint256 id = _proposal();
        assertEq(uint8(_reason(id, recent)), uint8(FlipGuardGovernance.Reason.RECENT_ACQUISITION));
        vm.prank(recent);
        vm.expectRevert(_blocked(FlipGuardGovernance.Reason.RECENT_ACQUISITION));
        gov.castVote(id, true);
    }

    function test_TransferAfterSnapshotDoesNotAddWeight() public {
        uint256 id = _proposal();
        vm.prank(owner);
        token.mint(nobody, 1_000e18);
        assertEq(uint8(_reason(id, nobody)), uint8(FlipGuardGovernance.Reason.NO_VOTING_POWER));

        vm.prank(clean);
        token.transfer(nobody, 100e18); // clean moves everything after snapshot
        (bool ok, uint256 w,,) = gov.assessVoter(id, clean);
        assertTrue(ok);
        assertEq(w, 100e18);
        vm.prank(clean);
        gov.castVote(id, true);
        assertEq(gov.getProposal(id).forVotes, 100e18);
    }

    function test_ZeroPowerBlocked() public {
        uint256 id = _proposal();
        vm.prank(nobody);
        vm.expectRevert(_blocked(FlipGuardGovernance.Reason.NO_VOTING_POWER));
        gov.castVote(id, true);
    }

    function test_VotingWindowBoundaries() public {
        vm.warp(block.timestamp + HOLD + 1);
        uint256 id = gov.createProposal("Window", DURATION);
        FlipGuardGovernance.Proposal memory p = gov.getProposal(id);

        assertEq(uint8(_reason(id, clean)), uint8(FlipGuardGovernance.Reason.NOT_ACTIVE)); // at snapshot
        vm.warp(p.start);
        assertEq(uint8(_reason(id, clean)), uint8(FlipGuardGovernance.Reason.ELIGIBLE));
        vm.warp(p.end);
        assertEq(uint8(_reason(id, clean)), uint8(FlipGuardGovernance.Reason.ELIGIBLE));
        vm.warp(p.end + 1);
        vm.prank(clean);
        vm.expectRevert(_blocked(FlipGuardGovernance.Reason.NOT_ACTIVE));
        gov.castVote(id, true);
    }

    function test_ProposalCreatedEvent() public {
        uint48 t = uint48(block.timestamp);
        vm.expectEmit(true, true, false, true);
        emit FlipGuardGovernance.ProposalCreated(1, address(this), "Hi", t, t + 1, t + 1 + DURATION);
        gov.createProposal("Hi", DURATION);
    }

    function test_ZeroDurationReverts() public {
        vm.expectRevert(FlipGuardGovernance.InvalidDuration.selector);
        gov.createProposal("x", 0);
    }

    function test_OnlyMonitorSetsRisk() public {
        vm.prank(nobody);
        vm.expectRevert(MockRiskRegistry.NotMonitor.selector);
        registry.setRisk(clean, MockRiskRegistry.Risk.WALLET_FLIP);

        vm.prank(nobody);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, nobody));
        registry.setMonitor(nobody, true);

        vm.prank(owner);
        registry.setMonitor(nobody, true);
        vm.expectEmit(true, true, false, true);
        emit MockRiskRegistry.RiskFlagUpdated(clean, MockRiskRegistry.Risk.WALLET_FLIP, nobody);
        vm.prank(nobody);
        registry.setRisk(clean, MockRiskRegistry.Risk.WALLET_FLIP);
    }

    function test_OnlyOwnerAdmin() public {
        vm.startPrank(nobody);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, nobody));
        token.mint(nobody, 1);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, nobody));
        gov.setMinHoldingPeriod(0);
        vm.stopPrank();
    }

    function testFuzz_UnknownProposal(uint256 id) public view {
        vm.assume(id > gov.proposalCount());
        assertEq(uint8(_reason(id, clean)), uint8(FlipGuardGovernance.Reason.NO_PROPOSAL));
    }

    function testFuzz_WindowBoundary(uint32 dt) public {
        vm.warp(block.timestamp + HOLD + 1);
        uint256 id = gov.createProposal("Fuzz", DURATION);
        vm.warp(block.timestamp + dt);
        bool inWindow = dt >= 1 && dt <= 1 + DURATION;
        (bool ok,,,) = gov.assessVoter(id, clean);
        assertEq(ok, inWindow);
    }
}
