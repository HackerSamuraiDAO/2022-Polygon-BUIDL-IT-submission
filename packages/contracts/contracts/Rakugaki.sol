// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Rakugaki is ERC721, ERC721URIStorage, ERC721Enumerable {
  struct Location {
    uint256 lat;
    uint256 latDecimalLength;
    uint256 lng;
    uint256 lngDecimalLength;
  }

  mapping(uint256 => Location) public location;
  mapping(uint256 => string) public modelURI;

  // solhint-disable-next-line no-empty-blocks
  constructor() ERC721("Rakugaki", "RKGK") {}

  function mint(
    address to,
    Location memory location_,
    string memory modelURI_,
    string memory tokenURI
  ) public {
    uint256 tokenId = totalSupply();
    _mint(to, tokenId);
    location[tokenId] = location_;
    modelURI[tokenId] = modelURI_;
    _setTokenURI(tokenId, tokenURI);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }
}
