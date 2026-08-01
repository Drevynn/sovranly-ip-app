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
    event AssetMinted(uint256 indexed assetId, address indexed to, uint96 royaltyFeeNumerator);

    modifier respectsCooldown(bytes4 actionSelector) {
        uint256 cooldown = actionCooldowns[actionSelector] > 0 ? actionCooldowns[actionSelector] : guardianGlobalCooldown;
        require(block.timestamp >= lastActionTimestamp[actionSelector] + cooldown, "Cooldown still active");
        _;
    }

    constructor(address admin) ERC721("SovranlyIPAsset", "SIPA") {
        address initialAdmin = admin != address(0) ? admin : msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(MINTER_ROLE, initialAdmin);
        _grantRole(GUARDIAN_ROLE, initialAdmin);
        _setDefaultRoyalty(initialAdmin, 1000); 
    }

    function mintAsset(address to, uint96 royaltyFeeNumerator) public onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        require(to != address(0), "Invalid recipient");
        require(royaltyFeeNumerator <= 10000, "Royalty fee exceeds 100%");
        uint256 assetId = nextAssetId;
        nextAssetId++;
        _safeMint(to, assetId);
        _setTokenRoyalty(assetId, to, royaltyFeeNumerator);
        emit AssetMinted(assetId, to, royaltyFeeNumerator);
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
