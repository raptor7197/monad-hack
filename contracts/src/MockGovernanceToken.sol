// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title MockGovernanceToken
/// @notice HACKATHON DEMO TOKEN. Owner can mint freely; this is not a production token.
/// @dev Timestamp-based checkpoints. Holders are auto-delegated to themselves on first receipt.
///      `lastAcquiredAt` records the latest inbound transfer/mint. It says nothing about where the
///      tokens came from (loan vs. purchase); it only enables a minimum-holding-period rule.
contract MockGovernanceToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    mapping(address => uint48) public lastAcquiredAt;

    constructor(address owner_)
        ERC20("Atlas Governance (Demo)", "ATLAS")
        ERC20Permit("Atlas Governance (Demo)")
        Ownable(owner_)
    {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    // solhint-disable-next-line func-name-mixedcase
    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=timestamp";
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
        if (to != address(0) && value > 0) {
            lastAcquiredAt[to] = uint48(block.timestamp);
            if (delegates(to) == address(0)) _delegate(to, to);
        }
    }

    function nonces(address owner_) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner_);
    }
}
