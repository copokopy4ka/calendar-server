import cors from "cors";
import { Express, json, urlencoded } from "express";

export const appConfig = (app: Express) => {
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(
    cors({
      origin: ["http://localhost:3000", "https://calendar-client-nu.vercel.app"],
      optionsSuccessStatus: 200,
    })
  );
};
