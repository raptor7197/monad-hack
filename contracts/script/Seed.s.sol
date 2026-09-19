// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {MockGovernanceToken} from "../src/MockGovernanceToken.sol";
import {FlipGuardGovernance} from "../src/FlipGuardGovernance.sol";

/// Demo reset: funds the "recently funded" wallet, then opens the three demo proposals.
/// Re-run any time for a fresh set of proposals (IDs keep incrementing).
contract Seed is Script {
    function run() external {
        FlipGuardGovernance gov = FlipGuardGovernance(vm.envAddress("NEXT_PUBLIC_FLIPGUARD_CONTRACT_ADDRESS"));
        MockGovernanceToken token = gov.token();
        address recent = vm.envOr("DEMO_RECENT_WALLET", address(uint160(uint256(keccak256("flipguard.recent")))));
        uint48 duration = uint48(vm.envOr("PROPOSAL_DURATION", uint256(3 days)));

        vm.startBroadcast();
        token.mint(recent, 5_000e18);
        uint256 first = gov.createProposal("Treasury Diversification", duration);
        gov.createProposal("Validator Incentive Adjustment", duration);
        gov.createProposal("Emergency Security Council Renewal", duration);
        vm.stopBroadcast();

        console.log("NEXT_PUBLIC_FIRST_PROPOSAL_ID=%s", first);
        console.log("Recently funded demo wallet: %s", recent);
    }
}
