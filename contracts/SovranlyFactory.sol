// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SovranlyIPAsset.sol";

contract SovranlyFactory {
    event AssetDeployed(address indexed assetAddress, address indexed owner);

    function deployAsset(address owner) public returns (address) {
        require(owner != address(0), "Invalid owner address");
        SovranlyIPAsset newAsset = new SovranlyIPAsset(owner);
        emit AssetDeployed(address(newAsset), owner);
        return address(newAsset);
    }

    function deployAsset() public returns (address) {
        return deployAsset(msg.sender);
    }
}
