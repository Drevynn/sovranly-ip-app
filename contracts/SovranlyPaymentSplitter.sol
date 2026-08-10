// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SovranlyPaymentSplitter
 * @notice Implements immediate calculation and execution of transfers (transfer() or transferFrom()) 
 *         to all registered stakeholder wallets in a single atomic transaction upon license fee payment.
 */
contract SovranlyPaymentSplitter is Ownable, ReentrancyGuard {
    
    struct Stakeholder {
        address wallet;
        uint256 shareBps; // Basis points (e.g. 5000 = 50%)
        string role;      // e.g. "Primary Creator", "Master", "Publishing", "Collaborator"
    }

    Stakeholder[] public stakeholders;
    uint256 public constant TOTAL_BPS = 10000;

    event StakeholderRegistered(address indexed wallet, uint256 shareBps, string role);
    event LicenseFeePaid(address indexed payer, uint256 totalAmount, address token);
    event StakeholderPaid(address indexed stakeholder, uint256 amount, address token);

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Register or update stakeholders and their percentage share basis points.
     */
    external onlyOwner {
        // Clear existing or manage
    }

    function setStakeholders(
        address[] calldata wallets, 
        uint256[] calldata sharesBps, 
        string[] calldata roles
    ) external onlyOwner {
        require(wallets.length == sharesBps.length && wallets.length == roles.length, "Array length mismatch");
        
        uint256 totalSum = 0;
        for (uint256 i = 0; i < sharesBps.length; i++) {
            totalSum += sharesBps[i];
        }
        require(totalSum == TOTAL_BPS, "Total shares must equal 10000 BPS (100%)");

        delete stakeholders;
        for (uint256 i = 0; i < wallets.length; i++) {
            require(wallets[i] != address(0), "Invalid stakeholder address");
            stakeholders.push(Stakeholder({
                wallet: wallets[i],
                shareBps: sharesBps[i],
                role: roles[i]
            }));
            emit StakeholderRegistered(wallets[i], sharesBps[i], roles[i]);
        }
    }

    /**
     * @notice Pay license fee in native ETH. Immediately calculates and executes transfer() 
     *         to all registered stakeholder wallets in a single atomic transaction.
     */
    function payLicenseFeeETH() external payable nonReentrant {
        uint256 totalAmount = msg.value;
        require(totalAmount > 0, "License fee must be greater than zero");
        require(stakeholders.length > 0, "No stakeholders registered");

        emit LicenseFeePaid(msg.sender, totalAmount, address(0));

        uint256 distributedSum = 0;
        for (uint256 i = 0; i < stakeholders.length; i++) {
            uint256 amount = (totalAmount * stakeholders[i].shareBps) / TOTAL_BPS;
            if (amount > 0) {
                distributedSum += amount;
                (bool success, ) = payable(stakeholders[i].wallet).call{value: amount}("");
                require(success, "ETH transfer failed");
                emit StakeholderPaid(stakeholders[i].wallet, amount, address(0));
            }
        }

        // Refund any dust remaining due to integer division rounding
        uint256 dust = totalAmount - distributedSum;
        if (dust > 0) {
            (bool refundSuccess, ) = payable(owner()).call{value: dust}("");
            require(refundSuccess, "Dust refund failed");
        }
    }

    /**
     * @notice Pay license fee in ERC-20 stablecoin/token (e.g. USDC, DAI). 
     *         Executes transferFrom() from payer and immediately executes transfer() 
     *         to all registered stakeholder wallets in a single atomic transaction.
     */
    function payLicenseFeeToken(address token, uint256 totalAmount) external nonReentrant {
        require(totalAmount > 0, "License fee must be greater than zero");
        require(stakeholders.length > 0, "No stakeholders registered");

        // Execute transferFrom to pull funds into the contract temporarily for distribution
        bool pulled = IERC20(token).transferFrom(msg.sender, address(this), totalAmount);
        require(pulled, "ERC-20 transferFrom failed");

        emit LicenseFeePaid(msg.sender, totalAmount, token);

        uint256 distributedSum = 0;
        for (uint256 i = 0; i < stakeholders.length; i++) {
            uint256 amount = (totalAmount * stakeholders[i].shareBps) / TOTAL_BPS;
            if (amount > 0) {
                distributedSum += amount;
                bool sent = IERC20(token).transfer(stakeholders[i].wallet, amount);
                require(sent, "ERC-20 transfer failed");
                emit StakeholderPaid(stakeholders[i].wallet, amount, token);
            }
        }

        // Handle any dust remainder
        uint256 dust = totalAmount - distributedSum;
        if (dust > 0) {
            IERC20(token).transfer(owner(), dust);
        }
    }

    function getStakeholderCount() external view returns (uint256) {
        return stakeholders.length;
    }
}
