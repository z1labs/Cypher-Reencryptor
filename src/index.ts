import express, { Request, Response } from "express";
import fhevmjs from "fhevmjs";
import cors from "cors";

import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

async function getInstance() {
  return await fhevmjs.createInstance({
    networkUrl: process.env.NODE_URL,
    gatewayUrl: process.env.GATEWAY_URL,
  });
}

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Reencrypt API");
});

app.post("/create-eip", async (req: Request, res: Response) => {
  try {
    const { contractAddress } = req.body;
    const fhevmInstance = await getInstance();
    const result = fhevmInstance.generateKeypair();
    const eip712 = fhevmInstance.createEIP712(
      result.publicKey,
      contractAddress
    );
    res.send({
      publicKey: result.publicKey,
      privateKey: result.privateKey,
      eip712,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.post("/reencrypt", async (req: Request, res: Response) => {
  try {
    const {
      publicKey,
      privateKey,
      signature,
      contractAddress,
      signerAddress,
      data,
    } = req.body;

    if (
      !publicKey ||
      !privateKey ||
      !signature ||
      !contractAddress ||
      !signerAddress ||
      !data
    ) {
      return res.status(400).send("Missing required parameters.");
    }

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
    console.error("Error during re-encryption:", error);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
