import { using, Environment } from "../utils";
import { BaseService } from "./base.service";
import * as _ from "lodash";
import { Settings } from "../model/settings.model";
export class SettingsService extends BaseService {
  get() {
    var result = new Settings();
    try {
      result.auth = this.environment.PROJECT;
    } catch (error) {
      throw error;
    }
    return result;
  }
}
