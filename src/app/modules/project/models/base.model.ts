import * as _ from "lodash";
import { GlobalBase } from "../../../../global/model/globalbase.model";
class Base extends GlobalBase {
	constructor(init?: Base) {
		super(init);
		if (init) {
		}
	}
}
export { Base };
