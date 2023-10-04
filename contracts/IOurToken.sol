// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

interface IOurToken is IERC20 {
    function burn(address ownerAddress, uint256 amount) external;

    function mint(address ownerAddress, uint256 amount) external;

    function getSymbol() external view returns (string memory);
}
