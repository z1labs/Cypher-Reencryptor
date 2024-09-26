import fhevmjs from "fhevmjs";

export const getInstance = async () => {
  return await fhevmjs.createInstance({
    networkUrl: process.env.NODE_URL,
    gatewayUrl: process.env.GATEWAY_URL,
  });
};