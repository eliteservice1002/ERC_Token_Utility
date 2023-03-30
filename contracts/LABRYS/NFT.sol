// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LabrysToken is ERC721, PullPayment, Ownable {
  using Counters for Counters.Counter;

  // constants
  uint256 public constant TOTAL_SUPPLY = 10_000;
  uint256 public constant MINT_PRICE = 0.001 ether;

  Counters.Counter private currentTokenId;

  // @dev Base toke URI used as a prefix by tokenURI()
  string public baseTokenURI;

  constructor() ERC721("NFTTutorial", "NFT") {
    baseTokenURI = "";
  }

  function mintTo(address recipient) public payable returns (uint256) {
    uint256 tokenId = currentTokenId.current();

    // check total supply
    require(tokenId < TOTAL_SUPPLY, "Max supply reached");

    // check mint cost
    require(
      msg.value == MINT_PRICE,
      "Transaction value is not equal to mint cost."
    );

    currentTokenId.increment();
    uint256 newItemId = currentTokenId.current();
    _safeMint(recipient, newItemId);
    return newItemId;
  }

  // @dev Returns an URI for a given token ID
  function _baseURI() internal view virtual override returns (string memory) {
    return baseTokenURI;
  }

  // @dev Sets the base token URI prefix
  function setBaseTokenURI(string memory _baseTokenURI) public onlyOwner {
    baseTokenURI = _baseTokenURI;
  }

  // @dev Overriden in order to make it onlyOwner function
  function withdrawPayments(address payable payee)
    public
    virtual
    override
    onlyOwner
  {
    super.withdrawPayments(payee);
  }
}
