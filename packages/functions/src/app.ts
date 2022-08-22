import express from "express";
import cors from "cors";
import { sign } from "./functions/sign";
import { get } from "./functions/get";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", async function (req, res) {
  res.json("hello world");
});

app.post("/sign", async function (req, res) {
  try {
    const param = req.body;
    const result = await sign(param);
    res.json(result);
  } catch (e: any) {
    console.log(e);
    res.status(500).json(e.toString());
  }
});

app.get("/get", async function (req, res) {
  try {
    const param = req.query;
    const result = await get(param);
    res.json(result);
  } catch (e: any) {
    console.log(e);
    res.status(500).json(e.toString());
  }
});

export { app };
