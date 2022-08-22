import { expect } from "chai";
import { ethers } from "hardhat";

const countDecimals = function (value: number) {
  if (Math.floor(value) === value) return 0;
  return value.toString().split(".")[1].length || 0;
};

describe.only("Rakugaki", function () {
  it("mint", async function () {
    const [signer] = await ethers.getSigners();
    const Rakugaki = await ethers.getContractFactory("Rakugaki");
    const rakugaki = await Rakugaki.deploy();

    const Aggregator = await ethers.getContractFactory("Aggregator");
    const aggregator = await Aggregator.deploy(rakugaki.address);

    const to = signer.address;
    const latRaw = 35.65925011569792;
    const latDecimalLength = countDecimals(latRaw);
    const latNum = latRaw * 10 ** latDecimalLength;
    const lat = latNum.toString();
    const lngRaw = 139.70066309372865;
    const lngDecimalLength = countDecimals(lngRaw);
    const lngNum = lngRaw * 10 ** lngDecimalLength;
    const lng = lngNum.toString();
    const location = {
      lat,
      latDecimalLength,
      lng,
      lngDecimalLength,
    };
    const modelURI = "modelURI";
    const tokenURI = "tokenURI";

    await rakugaki.mint(to, location, modelURI, tokenURI);
    const expectedTokenId = 0;

    const data = await aggregator.get(expectedTokenId);
    await expect(data.tokenId).to.equal(expectedTokenId);
    await expect(data.holder).to.equal(to);
    await expect(data.location.lat).to.equal(lat);
    await expect(data.location.latDecimalLength).to.equal(latDecimalLength);
    await expect(data.location.lng).to.equal(lng);
    await expect(data.location.lngDecimalLength).to.equal(lngDecimalLength);
    await expect(data.modelURI).to.equal(modelURI);
    await expect(data.tokenURI).to.equal(tokenURI);
    // await expect(await rakugaki.tokenURI(expectedTokenId)).to.equal(tokenURI);
  });
});
