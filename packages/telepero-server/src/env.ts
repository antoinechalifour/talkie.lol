import dotenv from "dotenv";
import assert from "assert";

dotenv.config();
assert(process.env.PORT, 'Environment variable "PORT" is required');
assert(process.env.SECRET, 'Environment variable "SECRET" is required');
assert(process.env.REDIS_HOST, 'Environment variable "REDIS_HOST" is required')
assert(process.env.REDIS_PORT, 'Environment variable "REDIS_PORT" is required')
