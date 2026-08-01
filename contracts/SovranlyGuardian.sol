// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

interface IPausableAsset {
    function emergencyPause() external;
    function emergencyUnpause() external;
    function paused() external view returns (bool);
}

contract SovranlyGuardian is AccessControl {
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");

    event AssetPaused(address indexed asset, address indexed guardian);
    event AssetUnpaused(address indexed asset, address indexed guardian);

    constructor(address admin) {
        address initialAdmin = admin != address(0) ? admin : msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(GUARDIAN_ROLE, initialAdmin);
    }
    
    function emergencyPauseAsset(address asset) external onlyRole(GUARDIAN_ROLE) {
        IPausableAsset(asset).emergencyPause();
        emit AssetPaused(asset, msg.sender);
    }

    function emergencyUnpauseAsset(address asset) external onlyRole(GUARDIAN_ROLE) {
        IPausableAsset(asset).emergencyUnpause();
        emit AssetUnpaused(asset, msg.sender);
    }
}
