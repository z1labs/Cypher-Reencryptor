import express from "express";
import { body } from "express-validator";
import { createEIP, reencrypt } from "./service"
import { validateEnvVariables } from "./middleware";

const router = express.Router();

router.post(
  "/create-eip",
  validateEnvVariables,
  body("contractAddress").isEthereumAddress().withMessage("Invalid contract address"),
  createEIP
);

router.post(
  "/reencrypt",
  validateEnvVariables,
  [
    body("publicKey").isString().withMessage("Invalid public key"),
    body("privateKey").isString().withMessage("Invalid private key"),
    body("signature").isString().withMessage("Invalid signature"),
    body("contractAddress").isEthereumAddress().withMessage("Invalid contract address"),
    body("signerAddress").isEthereumAddress().withMessage("Invalid signer address"),
    body("data").isNumeric().withMessage("Data should be a numeric value"),
  ],
  reencrypt
);

export default router;
