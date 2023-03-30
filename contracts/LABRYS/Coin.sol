// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LabrysCoin is ERC20, Ownable {
  constructor() ERC20("LABRYS Token", "LRT") {}

  function mint(address vendor, uint256 amount) public onlyOwner {
    _mint(vendor, amount);
  }

  function decimals() public view virtual override returns (uint8) {
    return 6;
  }
}
