// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Rakugaki.sol";

contract Aggregator {
  Rakugaki public rakugaki;

  struct Data {
    uint256 tokenId;
    address holder;
    Rakugaki.Location location;
    string imageURI;
    string modelURI;
    string tokenURI;
  }

  constructor(Rakugaki rakugaki_){
    rakugaki = rakugaki_;
  }

  /*
   * @dev this is useful for multicall in lambda
   */
  function get(uint256 tokenId) public view returns (Data memory) {
    address holder = rakugaki.ownerOf(tokenId);
    (uint256 lat, uint256 latDecimalLength, uint256 lng, uint256 lngDecimalLength ) = rakugaki.location(tokenId);
    Rakugaki.Location memory location = Rakugaki.Location(lat, latDecimalLength, lng, lngDecimalLength);
    string memory imageURI = rakugaki.imageURI(tokenId);
    string memory modelURI = rakugaki.modelURI(tokenId);
    string memory tokenURI = rakugaki.tokenURI(tokenId);
    return Data(tokenId, holder, location, imageURI, modelURI, tokenURI);
  }
}
