import { isNetwork } from "../../types/network";

const getEnv = () => {
  const network = process.env.NETWORK || "";
  if (!isNetwork(network)) {
    throw new Error("env network invalid");
  }
  return { network };
};

const { network } = getEnv();
export { network };
