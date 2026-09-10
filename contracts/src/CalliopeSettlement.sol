// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title CalliopeSettlement
/// @notice Minimal Base receipt: records that an obligation was ruled pass/fail.
///         Not escrow. Not a token. Evidence for the hackathon Base stack.
contract CalliopeSettlement {
    error InvalidResult();

    event Settled(
        bytes32 indexed obligationId,
        address indexed settler,
        uint8 result, // 0 = FAIL, 1 = PASS
        uint256 spendCents
    );

    function settle(bytes32 obligationId, uint8 result, uint256 spendCents) external {
        if (result > 1) revert InvalidResult();
        emit Settled(obligationId, msg.sender, result, spendCents);
    }
}
