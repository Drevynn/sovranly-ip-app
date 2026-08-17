// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SovranSmartAccount.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

/**
 * @title SovranSmartAccountFactory
 * @dev Factory contract for deterministic deployment of SovranSmartAccounts (ERC-4337).
 */
contract SovranSmartAccountFactory {
    address public immutable entryPoint;
    address public immutable defaultPlatformReserve;

    event AccountCreated(address indexed account, address indexed owner, uint256 salt);

    constructor(address _entryPoint, address _defaultPlatformReserve) {
        entryPoint = _entryPoint;
        defaultPlatformReserve = _defaultPlatformReserve;
    }

    /**
     * @notice Deploy a new SovranSmartAccount using CREATE2.
     */
    function createAccount(address owner, uint256 salt) external returns (SovranSmartAccount) {
        address addr = getAddress(owner, salt);
        uint256 codeSize = addr.code.length;
        if (codeSize > 0) {
            return SovranSmartAccount(payable(addr));
        }

        bytes memory bytecode = abi.encodePacked(
            type(SovranSmartAccount).creationCode,
            abi.encode(entryPoint, owner, defaultPlatformReserve)
        );

        address deployed = Create2.deploy(0, bytes32(salt), bytecode);
        emit AccountCreated(deployed, owner, salt);
        return SovranSmartAccount(payable(deployed));
    }

    /**
     * @notice Calculate counterfactual address before deployment on-chain.
     */
    function getAddress(address owner, uint256 salt) public view returns (address) {
        bytes memory bytecode = abi.encodePacked(
            type(SovranSmartAccount).creationCode,
            abi.encode(entryPoint, owner, defaultPlatformReserve)
        );
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                bytes32(salt),
                keccak256(bytecode)
            )
        );
        return address(uint160(uint256(hash)));
    }
}
