import "dotenv/config";
import { get } from "env-var";

export const envs = {
  PORT: get("PORT").required().asPortNumber(),
  DB_HOST: get("DB_HOST").required().asString(),
  DB_PORT: get("DB_PORT").required().asPortNumber(),
  DB_DATABASE: get("DB_DATABASE").required().asString(),
  DB_USER: get("DB_USER").required().asString(),
  DB_PASSWORD: get("DB_PASSWORD").required().asString(),
  JWT_SECRET: get("JWT_SECRET").required().asString(),

  MAILER_SERVICE: get("MAILER_SERVICE").required().asString(),
  MAILER_EMAIL: get("MAILER_EMAIL").required().asString(),
  MAILER_SECRET_KEY: get("MAILER_SECRET_KEY").required().asString(),

  WEBSERVICE_URL: get("WEBSERVICE_URL").required().asString(),
  BASE_URL: get("BASE_URL").required().asString(),
};
