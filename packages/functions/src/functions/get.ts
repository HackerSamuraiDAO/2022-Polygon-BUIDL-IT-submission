import { ethers } from "ethers";
import { Contract, Provider } from "ethers-multicall";

import { AGGREGATOR_ABI } from "../lib/contracts/aggregator-abi";
import { RAKUGAKI_ABI } from "../lib/contracts/rakugaki-abi";
import { network } from "../lib/env";
import networks from "../networks.json";

export interface GetInput {
  tokenId?: string;
}

export interface GetOutput {
  tokenId: string;
  holder: string;
  location: {
    lat: number;
    lng: number;
  };
  modelURI: string;
  tokenURI: string;
}

export const get = async (input: GetInput): Promise<GetOutput[]> => {
  const { tokenId } = input;
  const provider = new ethers.providers.JsonRpcProvider(networks[network].rpc);
  const rakugakiContract = new ethers.Contract(networks[network].contracts.rakugaki, RAKUGAKI_ABI, provider);
  const multicallProvider = new Provider(provider);
  await multicallProvider.init();
  const rakugakiMulcicallContract = new Contract(networks[network].contracts.rakugaki, RAKUGAKI_ABI);
  const aggregatorMulcicallContract = new Contract(networks[network].contracts.aggregator, AGGREGATOR_ABI);
  let tokenIds = [];
  if (tokenId) {
    tokenIds.push(tokenId);
  } else {
    const totalSupply = await rakugakiContract.totalSupply();
    const tokenByIndexMulcicalls: any[] = [];
    for (let i = 0; i < totalSupply; i++) {
      tokenByIndexMulcicalls.push(rakugakiMulcicallContract.tokenByIndex(i));
    }
    const tokenByIndexResult = await multicallProvider.all(tokenByIndexMulcicalls);
    tokenIds = tokenByIndexResult;
  }
  const getMulcicalls = tokenIds.map((tokenId) => {
    return aggregatorMulcicallContract.get(tokenId);
  });
  const output = await multicallProvider.all(getMulcicalls);

  return output.map((v) => {
    const lat = v.location.lat / 10 ** v.location.latDecimalLength;
    const lng = v.location.lng / 10 ** v.location.lngDecimalLength;

    return {
      tokenId: v.tokenId,
      holder: v.holder,
      location: {
        lat,
        lng,
      },
      modelURI: v.modelURI,
      tokenURI: v.tokenURI,
    };
  });
};
