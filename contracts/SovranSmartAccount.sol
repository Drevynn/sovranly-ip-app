// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title SovranSmartAccount
 * @dev ERC-4337 compliant Smart Contract Account (Account Abstraction) for Sovranly IP Creators.
 * Features:
 * - Gasless transaction sponsorship via Paymasters.
 * - Automated 85% Creator / 15% Platform Royalty Routing.
 * - Multi-Guardian Zero Trust Social Recovery.
 * - Granular Session Keys for 1-click IP stamping.
 */

interface IAccount {
    struct UserOperation {
        address sender;
        uint256 nonce;
        bytes initCode;
        bytes callData;
        uint256 callGasLimit;
        uint256 verificationGasLimit;
        uint256 preVerificationGas;
        uint256 maxFeePerGas;
        uint256 maxPriorityFeePerGas;
        bytes paymasterAndData;
        bytes signature;
    }

    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 missingAccountFunds
    ) external returns (uint256 validationData);
}

contract SovranSmartAccount is IAccount, Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    address public immutable entryPoint;
    address public platformReserve;
    uint96 public creatorRoyaltyShareBasisPoints = 8500; // 85.00% default

    // Session keys authorization: sessionKey => validUntil timestamp
    mapping(address => uint256) public sessionKeys;

    // Social Recovery Guardians: guardian => isGuardian
    mapping(address => bool) public guardians;
    uint256 public guardianCount;
    uint256 public constant GUARDIAN_THRESHOLD = 2;

    // Recovery proposal tracking
    struct RecoveryProposal {
        address newOwner;
        uint256 approvals;
        uint256 timestamp;
        bool executed;
    }
    mapping(bytes32 => RecoveryProposal) public recoveryProposals;
    mapping(bytes32 => mapping(address => bool)) public guardianVoted;

    event Executed(address indexed target, uint256 value, bytes data);
    event RoyaltyDistributed(address indexed creator, address indexed platform, uint256 creatorAmount, uint256 platformAmount);
    event SessionKeyUpdated(address indexed sessionKey, uint256 validUntil);
    event GuardianUpdated(address indexed guardian, bool active);
    event RecoveryProposed(bytes32 indexed proposalId, address indexed newOwner);
    event RecoveryExecuted(bytes32 indexed proposalId, address indexed newOwner);

    modifier onlyEntryPointOrOwner() {
        require(msg.sender == entryPoint || msg.sender == owner(), "SovranSmartAccount: Unauthorized sender");
        _;
    }

    constructor(address _entryPoint, address _initialOwner, address _platformReserve) Ownable(_initialOwner) {
        require(_entryPoint != address(0), "Invalid entrypoint");
        require(_initialOwner != address(0), "Invalid owner");
        entryPoint = _entryPoint;
        platformReserve = _platformReserve == address(0) ? _initialOwner : _platformReserve;
    }

    /**
     * @notice ERC-4337 UserOperation validation function.
     */
    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 missingAccountFunds
    ) external override returns (uint256 validationData) {
        require(msg.sender == entryPoint, "Only EntryPoint can validate UserOp");

        bytes32 hash = userOpHash.toEthSignedMessageHash();
        address recoveredSigner = hash.recover(userOp.signature);

        // Accept primary owner or valid active session key
        bool isValidSigner = (recoveredSigner == owner()) || 
                             (sessionKeys[recoveredSigner] > block.timestamp);

        if (!isValidSigner) {
            return 1; // SIG_VALIDATION_FAILED
        }

        // Pay missing funds to EntryPoint if required (when paymaster is not sponsoring)
        if (missingAccountFunds > 0) {
            (bool success, ) = payable(entryPoint).call{value: missingAccountFunds}("");
            require(success, "Failed to pay entry point funds");
        }

        return 0; // SUCCESS
    }

    /**
     * @notice Execute standard transaction on behalf of the smart contract account.
     */
    function execute(address target, uint256 value, bytes calldata data) external onlyEntryPointOrOwner returns (bytes memory) {
        (bool success, bytes memory result) = target.call{value: value}(data);
        require(success, "Execution failed");
        emit Executed(target, value, data);
        return result;
    }

    /**
     * @notice Automated Royalty Splitter: Automatically sends 85% to Creator and 15% to Platform/Co-creators.
     */
    function distributeRoyalties() public payable {
        uint256 total = msg.value;
        require(total > 0, "No funds to distribute");

        uint256 creatorShare = (total * creatorRoyaltyShareBasisPoints) / 10000;
        uint256 platformShare = total - creatorShare;

        (bool cSuccess, ) = payable(owner()).call{value: creatorShare}("");
        require(cSuccess, "Creator transfer failed");

        (bool pSuccess, ) = payable(platformReserve).call{value: platformShare}("");
        require(pSuccess, "Platform transfer failed");

        emit RoyaltyDistributed(owner(), platformReserve, creatorShare, platformShare);
    }

    /**
     * @notice Set session key with expiration timestamp for gasless 1-click IP signing.
     */
    function setSessionKey(address _sessionKey, uint256 _validUntil) external onlyEntryPointOrOwner {
        require(_sessionKey != address(0), "Invalid session key");
        sessionKeys[_sessionKey] = _validUntil;
        emit SessionKeyUpdated(_sessionKey, _validUntil);
    }

    /**
     * @notice Add or remove social recovery guardians.
     */
    function setGuardian(address _guardian, bool _active) external onlyEntryPointOrOwner {
        require(_guardian != address(0) && _guardian != owner(), "Invalid guardian");
        if (_active && !guardians[_guardian]) {
            guardians[_guardian] = true;
            guardianCount++;
        } else if (!_active && guardians[_guardian]) {
            guardians[_guardian] = false;
            guardianCount--;
        }
        emit GuardianUpdated(_guardian, _active);
    }

    /**
     * @notice Guardian multi-sig social account recovery.
     */
    function proposeRecovery(address _newOwner) external returns (bytes32) {
        require(guardians[msg.sender], "Only guardian can propose recovery");
        require(_newOwner != address(0), "Invalid new owner");

        bytes32 proposalId = keccak256(abi.encodePacked(_newOwner, block.timestamp / 1 days));
        RecoveryProposal storage proposal = recoveryProposals[proposalId];

        if (proposal.newOwner == address(0)) {
            proposal.newOwner = _newOwner;
            proposal.timestamp = block.timestamp;
        }

        if (!guardianVoted[proposalId][msg.sender]) {
            guardianVoted[proposalId][msg.sender] = true;
            proposal.approvals++;
            emit RecoveryProposed(proposalId, _newOwner);
        }

        if (proposal.approvals >= GUARDIAN_THRESHOLD && !proposal.executed) {
            proposal.executed = true;
            _transferOwnership(_newOwner);
            emit RecoveryExecuted(proposalId, _newOwner);
        }

        return proposalId;
    }

    receive() external payable {
        if (msg.value > 0) {
            distributeRoyalties();
        }
    }
}
