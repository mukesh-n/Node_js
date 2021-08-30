import { Base } from "./base.model";
import * as _ from "lodash";
class ErrorResponse<T> extends Base {
  success: boolean = false;
  message: string = "";
  item?: any;
  code: ErrorResponse.ErrorCodes = ErrorResponse.ErrorCodes.BAD_REQUEST;
  source: any = null;
  constructor(init?: Partial<ErrorResponse<T>>) {
    super(init);
    if (init) {
      this.success = _.get(init, "success", false);
      this.message = _.get(init, "message", "");
      if (init.code != null) this.code = init.code;
      if (_.get(init, "item", null) != null) {
        this.item = init.item;
      }
      if (init.source != null) {
        this.source = init.source;
      }
    }
  }
}
module ErrorResponse {
  export enum ErrorCodes {
    BAD_REQUEST = 1000,
    ETIMEDOUT = "ETIMEDOUT",
    UNIQUE_KEY_VIOLATION = 1012,
    UNAUTHORIZED = 1014,
    FORBIDDEN = 1015,
    INVALID_JSON_STRUCTURE=1016
  }
}

export { ErrorResponse };
