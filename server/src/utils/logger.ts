import winston from "winston";

// define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// tell winston that you want to link the colors
winston.addColors(colors);

// define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

// define format for logs
const format = winston.format.combine(
  // add timestamp
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  // add colors
  winston.format.colorize({ all: true }),
  // define format of the message showing the timestamp, the level and the message
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// define transports
const transports = [
  // console transport
  new winston.transports.Console(),
  // file transport for errors
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  // file transport for all logs
  new winston.transports.File({ filename: "logs/all.log" }),
];

// create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default logger;
