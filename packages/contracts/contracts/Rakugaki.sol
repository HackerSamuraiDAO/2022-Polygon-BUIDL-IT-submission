// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Rakugaki is ERC721, ERC721URIStorage {
  uint256 public totalSupply;

  // solhint-disable-next-line no-empty-blocks
  constructor() ERC721("Rakugaki", "RKGK") {}

  function mint(
    address to,
    string memory tokenURI
  ) public {
    uint256 tokenId = totalSupply;
    _mint(to, tokenId);
    _setTokenURI(tokenId, tokenURI);
    totalSupply++;
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }
}
