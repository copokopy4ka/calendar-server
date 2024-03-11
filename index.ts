import express from "express";
import "dotenv/config";
import { router } from "./router/router.js";
import { appConfig, connectMongo } from "./config/index.js";

const PORT = process.env.PORT || 3000;

connectMongo();

const app = express();
appConfig(app);
router(app);

app.listen(PORT, () => {
  console.log("Server OK", PORT);
});
