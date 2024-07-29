import dotenv from "dotenv";
import { Command, Option } from "commander";

//config commander
const programa = new Command();
programa.addOption(
  new Option("-m --mode <MODE>", "Modo de ejcucuión del programa")
    .choices(["dev", "prod"])
    .default("dev")
);

// configuración dotenv.
dotenv.config({
  path: "./src/.env",
  override: true,
});

const config = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL,
  DB_NAME: process.env.DB_NAME,
  SECRET: process.env.SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
  ADMIN_ID:process.env.ADMIN_ID
};

export default config;
