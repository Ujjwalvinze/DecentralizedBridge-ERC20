// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

error Token_NotOwner(address);

contract OurToken is ERC20 {
    address private s_owner;

    modifier onlyOwner() {
        if (msg.sender != s_owner) revert Token_NotOwner(msg.sender);
        _;
    }

    constructor() ERC20("OurToken", "OT") {
        s_owner = msg.sender;
    }

    function burn(address ownerAddress, uint256 amount) external onlyOwner {
        _burn(ownerAddress, amount);
    }

    function mint(address ownerAddress, uint256 amount) external onlyOwner {
        _mint(ownerAddress, amount);
    }

    function updateOwner(address newOwner) external onlyOwner {
        s_owner = newOwner;
    }

    function getSymbol() external view returns (string memory) {
        return symbol();
    }

    function getOwner() public view returns (address) {
        return s_owner;
    }
}
