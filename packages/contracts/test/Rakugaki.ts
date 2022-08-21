import { expect } from "chai";
import { ethers } from "hardhat";

describe.only("Rakugaki", function () {
  it("mint", async function () {
    const [signer] = await ethers.getSigners();
    const Rakugaki = await ethers.getContractFactory("Rakugaki");
    const rakugaki = await Rakugaki.deploy();
    const tokenURI = "tokenURI";
    await rakugaki.mint(signer.address, tokenURI);
    const expectedTokenId = 0;
    await expect(await rakugaki.ownerOf(expectedTokenId)).to.equal(signer.address);
    await expect(await rakugaki.tokenURI(expectedTokenId)).to.equal(tokenURI);
  });
});
