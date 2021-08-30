import * as _ from "lodash";
import {
  logger,
  Environment,
  json_custom_stringifier,
} from "./global/utils";
import { PROJECTPreset } from "./app/modules/project/presetp";
import { GlobalPreset } from "./app/modules/project/preset";
export class Preset {
  environment: Environment;
  project_preset: PROJECTPreset;
  global_preset: GlobalPreset;
  constructor() {
    this.environment = new Environment();
    this.project_preset = new PROJECTPreset();
    this.global_preset = new GlobalPreset();
  }
  public async asynchronous() {
    try {
      var logger_instance = logger.getLogger("[PRESET ASYNCHRONOUS]");
      logger_instance.info("STARTED");

      await this.global_preset.asynchronous();
      if (this.environment.PROJECT) {
        await this.project_preset.asynchronous();
      }

      logger_instance.info("DONE");
    } catch (error) {
      throw error;
    }
  }
  synchronous() {
    var logger_instance = logger.getLogger("[PRESET SYNCHRONOUS]");
    try {
      logger_instance.info("STARTED");

      this.global_preset.synchronous();


      if (this.environment.PROJECT) {
        this.project_preset.synchronous();
      }

      logger_instance.info("DONE");
    } catch (error) {
      logger_instance.error("FAILED", json_custom_stringifier.stringify(error));
    }
  }
}
