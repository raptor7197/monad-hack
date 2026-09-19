// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {MockGovernanceToken} from "../src/MockGovernanceToken.sol";
import {MockRiskRegistry} from "../src/MockRiskRegistry.sol";
import {FlipGuardGovernance} from "../src/FlipGuardGovernance.sol";

/// Deploys the three contracts and gives demo wallets their starting state.
/// Run Seed.s.sol afterwards (once MIN_HOLDING_PERIOD has passed) to open proposals.
contract Deploy is Script {
    function run() external {
        uint48 minHold = uint48(vm.envOr("MIN_HOLDING_PERIOD", uint256(60)));
        address flagged = vm.envOr("DEMO_FLAGGED_WALLET", address(uint160(uint256(keccak256("flipguard.flagged")))));

        vm.startBroadcast();
        address deployer = msg.sender;
        MockGovernanceToken token = new MockGovernanceToken(deployer);
        MockRiskRegistry registry = new MockRiskRegistry(deployer);
        FlipGuardGovernance gov = new FlipGuardGovernance(token, registry, minHold, deployer);

        token.mint(deployer, 1_000e18); // Long-Term Holder (clean)
        token.mint(flagged, 250e18);
        registry.setRisk(flagged, MockRiskRegistry.Risk.BORROWING_RISK);
        vm.stopBroadcast();

        console.log("NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS=%s", address(token));
        console.log("NEXT_PUBLIC_RISK_REGISTRY_ADDRESS=%s", address(registry));
        console.log("NEXT_PUBLIC_FLIPGUARD_CONTRACT_ADDRESS=%s", address(gov));
        console.log("Deployer (clean holder): %s", deployer);
        console.log("Flagged demo wallet: %s", flagged);
    }
}
