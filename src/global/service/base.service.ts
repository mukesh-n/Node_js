import { global_logger } from "../utils";
import { GlobalBaseService } from "./globalbase.service";
class BaseService extends GlobalBaseService {
	constructor() {
		super();
	}

	/* module level log function */
	public log(level: GlobalBaseService.LogLevels, data: any) {
		this.logGlobal(global_logger, level, data);
	}
}
module BaseService {}
export { BaseService };
