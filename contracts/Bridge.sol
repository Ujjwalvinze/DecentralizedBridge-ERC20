// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IOurToken.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

enum State {
    Inititated,
    Pending,
    Complete
}

error InvalidSignature(address);

contract Bridge is ReentrancyGuard {
    IOurToken private s_token;

    event TransferInitiated(
        address senderAddress,
        address recieverAddress,
        uint256 amount,
        uint256 nonce,
        bytes signature
    );

    event TransferComplete(State st, address from, address to, uint256 amount, uint256 nonce);

    constructor(address _token) {
        s_token = IOurToken(_token);
    }

    function initiateTransfer(
        address to,
        uint256 amount,
        uint256 nonce,
        bytes calldata signature
    ) public nonReentrant {
        s_token.burn(msg.sender, amount);
        emit TransferInitiated(msg.sender, to, amount, nonce, signature); // add add amount symbol
    }

    function mintTransferredAmount(
        address from,
        address to,
        uint256 amount,
        uint256 nonce,
        bytes calldata signature
    ) public nonReentrant {
        bytes32 messageHash = keccak256(abi.encodePacked(from, to, amount, nonce));
        bytes32 signedMessagehash = prefixed(messageHash);
        address toVerify = recoverSigner(signedMessagehash, signature);

        if (toVerify != from) revert InvalidSignature(toVerify);

        s_token.mint(to, amount);

        emit TransferComplete(State.Complete, from, to, amount, nonce);
    }

    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    function recoverSigner(bytes32 message, bytes memory sig) internal pure returns (address) {
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v, r, s) = splitSignature(sig);

        return ecrecover(message, v, r, s);
    }

    function splitSignature(bytes memory sig) internal pure returns (uint8, bytes32, bytes32) {
        require(sig.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }
}
