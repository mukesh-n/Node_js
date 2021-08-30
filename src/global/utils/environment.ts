import * as _ from "lodash";
export class Environment {
  BASE_URL: string;
  PORT: number;
  /* image uploader */
  IMAGE_FIELD: string;
  IMAGE_STORAGE: string;
  /* app mode */
  NODE_ENV: string;
  /* modules */
  
  PROJECT: boolean;
  /* sql server credentials */
  SQL_SERVER_USER: string;
  SQL_SERVER_PASSWORD: string;
  SQL_SERVER: string;
  SQL_SERVER_INSTANCE: string;
  SQL_SERVER_DATABASE: string;
  SQL_SERVER_PORT: number;
  constructor() {
    var env = process.env;
    this.BASE_URL = _.get(env, "BASE_URL", "");
    this.PORT = parseInt(_.get(env, "PORT", "3000").trim());
    this.IMAGE_FIELD = _.get(env, "IMAGE_FIELD", "");
    this.IMAGE_STORAGE = _.get(env, "IMAGE_STORAGE", "");
    this.NODE_ENV = _.get(process, "env.NODE_ENV", "development").trim();
    this.PROJECT = _.get(process, "env.PROJECT", "").trim() == "true";
    this.SQL_SERVER_USER = _.get(process, "env.SQL_SERVER_USER", "").trim();
    this.SQL_SERVER_PASSWORD = _.get(
      process,
      "env.SQL_SERVER_PASSWORD",
      ""
    ).trim();
    this.SQL_SERVER = _.get(process, "env.SQL_SERVER", "").trim();
    this.SQL_SERVER_INSTANCE = _.get(
      process,
      "env.SQL_SERVER_INSTANCE",
      ""
    ).trim();
    this.SQL_SERVER_DATABASE = _.get(
      process,
      "env.SQL_SERVER_DATABASE",
      ""
    ).trim();
    this.SQL_SERVER_PORT = parseInt(
      _.get(process, "env.SQL_SERVER_PORT", "0").trim()
    );
  }
  static getInstance() {
    return new Environment();
  }
}
