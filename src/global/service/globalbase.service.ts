import httpContext from "express-http-context";
import * as utils from "../utils";
import { DB, Environment } from "../utils";
/* types */
import { Logger } from "log4js";
class GlobalBaseService {
  /* user context */
  // user_context: Auth;
  /* Database */
  db: DB = new DB();

  /* utils */
  utils = utils;

  /* environment */
  environment: Environment;

  constructor() {
    this.environment = new Environment();
    // this.user_context = new Auth(httpContext.get("user_context"));
  }

  /**
   * log
   */

  public logGlobal(
    logger: Logger,
    level: GlobalBaseService.LogLevels,
    data: any
  ) {
    var TAG = "[SERVICE]\t";
    data = utils.json_custom_stringifier.stringify(data);
    switch (level) {
      case GlobalBaseService.LogLevels.error:
        logger.error(TAG, data);
        break;
      case GlobalBaseService.LogLevels.info:
        logger.info(TAG, data);
        break;
      default:
        break;
    }
  }

  public async asyncForEach(array: Array<any>, callback: any) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
}
module GlobalBaseService {
  export enum LogLevels {
    error,
    info,
  }
}
export { GlobalBaseService };
