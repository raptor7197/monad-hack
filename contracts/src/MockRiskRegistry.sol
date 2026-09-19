// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title MockRiskRegistry
/// @notice Risk flags written by an authorized monitor. In the hackathon demo the monitor is simulated;
///         the registry only stores and exposes flags, it does not detect anything itself.
contract MockRiskRegistry is Ownable {
    enum Risk {
        NONE,
        RECENT_ACQUISITION,
        BORROWING_RISK,
        WALLET_FLIP,
        MANUAL_REVIEW
    }

    mapping(address => bool) public isMonitor;
    mapping(address => Risk) public riskOf;

    event MonitorUpdated(address indexed monitor, bool allowed);
    event RiskFlagUpdated(address indexed wallet, Risk risk, address indexed monitor);

    error NotMonitor();

    constructor(address owner_) Ownable(owner_) {
        isMonitor[owner_] = true;
        emit MonitorUpdated(owner_, true);
    }

    function setMonitor(address monitor, bool allowed) external onlyOwner {
        isMonitor[monitor] = allowed;
        emit MonitorUpdated(monitor, allowed);
    }

    /// @notice Set (or clear, with Risk.NONE) a wallet's flag.
    function setRisk(address wallet, Risk risk) external {
        if (!isMonitor[msg.sender]) revert NotMonitor();
        riskOf[wallet] = risk;
        emit RiskFlagUpdated(wallet, risk, msg.sender);
    }
}
