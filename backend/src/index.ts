import dotenv from "dotenv";
import connectDB from "./config/db";
import { app } from "./app";
import { env } from "./config/env";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(env.PORT || 5000, () => {
      console.log(`Server is running at port : ${env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
