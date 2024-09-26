import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { getInstance } from "./helper";

export const createEIP = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { contractAddress } = req.body;
    const fhevmInstance = await getInstance();
    const result = fhevmInstance.generateKeypair();
    const eip712 = fhevmInstance.createEIP712(result.publicKey, contractAddress);

    res.send({
      publicKey: result.publicKey,
      privateKey: result.privateKey,
      eip712,
    });
  } catch (error) {
    res.status(500).send("Failed to create EIP.");
  }
};

export const reencrypt = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { publicKey, privateKey, signature, contractAddress, signerAddress, data } = req.body;
    const fhevmInstance = await getInstance();
    const result = await fhevmInstance.reencrypt(
      BigInt(data),
      privateKey,
      publicKey,
      signature,
      contractAddress,
      signerAddress
    );

    res.send(String(result));
  } catch (error) {
    res.status(500).send("Re-encryption failed.");
  }
};
