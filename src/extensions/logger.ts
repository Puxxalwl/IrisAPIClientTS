import { createLogger, format, transports, Logger } from "winston";

export interface IrisLogger {
	debug(message: string, meta?: Record<string, unknown>): void;
	info(message: string, meta?: Record<string, unknown>): void;
	warn(message: string, meta?: Record<string, unknown>): void;
	error(message: string, meta?: Record<string, unknown>): void;
}

export interface IrisLoggerOptions {
	/** Уровень логирования, default: info */
	level?: "error" | "warn" | "info" | "debug";
	/** Имя сервиса в метке лога */
	service?: string;
	/** Включить JSON-формат, default: false */
	json?: boolean;
}

/**
 * Создать winston-логгер с единым форматом для Iris клиента.
 */
export function createIrisLogger(options: IrisLoggerOptions = {}): Logger {
	const level = options.level ?? "info";
	const service = options.service ?? "IrisApiClient";
	const json = options.json ?? false;

	return createLogger({
		level,
		defaultMeta: { service },
		format: json
			? format.combine(format.timestamp(), format.errors({ stack: true }), format.json())
			: format.combine(
				format.colorize(),
				format.timestamp(),
				format.printf(({ timestamp, level: lvl, message, ...meta }) => {
					const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
					return `${timestamp} [${service}] ${lvl}: ${message}${rest}`;
				})
			),
		transports: [new transports.Console()]
	});
}

/** Логгер-заглушка, если логирование не нужно. */
export const noopLogger: IrisLogger = {
	debug: () => undefined,
	info: () => undefined,
	warn: () => undefined,
	error: () => undefined
};
