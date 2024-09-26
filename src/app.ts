import express from "express";
import cors from "cors";
import controller from "./controller"
import { apiLimiter } from "./middleware";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(apiLimiter);

app.use("/", controller);

export default app;
