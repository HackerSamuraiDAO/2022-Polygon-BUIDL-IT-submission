import { ethers } from "ethers";

export interface SignInput {
  tokenURI: string;
  chainId: number;
  rakugaki: string;
  rpc: string;
}

export interface SignOutput {
  signature: string;
}

/*
 * @dev params: chainId & address & rpc should be managed in funcsions side
 *      but we have these as input param to make hackthon code DRY
 */
export const sign = async (input: SignInput): Promise<SignOutput> => {
  console.log("sign start", input);
  const { tokenURI, chainId, rakugaki, rpc } = input;
  let signature = "";

  const encoded = ethers.utils.solidityPack(["uint256", "address", "string"], [chainId, rakugaki, tokenURI]);
  const message = ethers.utils.arrayify(encoded);

  if (process.env.IS_AWS_KMS_ENABLED === "true") {
  } else {
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const wallet = new ethers.Wallet(process.env.LOCAL_SIGNER_PRIVATE_KEY || "", provider);
    signature = await wallet.signMessage(message);
  }
  const output = {
    signature,
  };
  console.log("sign end", output);
  return output;
};
