// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SovranlyIPAsset.sol";

contract SovranlyFactory {
    event AssetDeployed(address assetAddress);

    function deployAsset() public returns (address) {
        SovranlyIPAsset newAsset = new SovranlyIPAsset();
        emit AssetDeployed(address(newAsset));
        return address(newAsset);
    }
}
