// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract SovranlyIPAsset is ERC721, ERC2981, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");

    uint256 public nextAssetId;

    // Cooldown Configuration
    uint256 public guardianGlobalCooldown = 24 hours;
    mapping(bytes4 => uint256) public actionCooldowns; 
    mapping(bytes4 => uint256) public lastActionTimestamp;

    event GuardianActionExecuted(bytes4 indexed actionSelector, address guardian, uint256 cooldownApplied);

    modifier respectsCooldown(bytes4 actionSelector) {
        uint256 cooldown = actionCooldowns[actionSelector] > 0 ? actionCooldowns[actionSelector] : guardianGlobalCooldown;
        require(block.timestamp >= lastActionTimestamp[actionSelector] + cooldown, "Cooldown still active");
        _;
    }

    constructor() ERC721("SovranlyIPAsset", "SIPA") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(GUARDIAN_ROLE, msg.sender);
        _setDefaultRoyalty(msg.sender, 1000); 
    }

    function mintAsset(address to, uint96 royaltyFeeNumerator) public onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 assetId = nextAssetId;
        nextAssetId++;
        _safeMint(to, assetId);
        _setTokenRoyalty(assetId, msg.sender, royaltyFeeNumerator);
        return assetId;
    }

    // ====================== EMERGENCY FUNCTIONS ======================

    function emergencyPause() external onlyRole(GUARDIAN_ROLE) respectsCooldown(this.emergencyPause.selector) {
        _pause();
        lastActionTimestamp[this.emergencyPause.selector] = block.timestamp;
        emit GuardianActionExecuted(this.emergencyPause.selector, msg.sender, guardianGlobalCooldown);
    }

    function emergencyUnpause() external onlyRole(GUARDIAN_ROLE) respectsCooldown(this.emergencyUnpause.selector) {
        _unpause();
        lastActionTimestamp[this.emergencyUnpause.selector] = block.timestamp;
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC2981, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
