import log4js from "log4js";

log4js.configure({
	appenders: {
		out: { type: "stdout" },
		file: {
			type: "file",
			filename: "logs/global.log",
			maxLogSize: 10000000,
			layout: {
				type: "basic",
			},
		},
		auth_log: {
			type: "file",
			filename: "logs/auth.log",
			maxLogSize: 10000000,
			layout: {
				type: "basic",
			},
		},
		PROJECT_log: {
			type: "file",
			filename: "logs/project.log",
			maxLogSize: 10000000,
			layout: {
				type: "basic",
			},
		},
	},
	categories: {
		default: { appenders: ["file", "out"], level: "debug" },
		"[AUTH]": {
			appenders: ["auth_log", "out"],
			level: "debug",
		},
		"[PROJECT]": {
			appenders: ["PROJECT_log", "out"],
			level: "debug",
		},
	},
});
export { log4js as logger };
