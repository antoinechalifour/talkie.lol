import dotenv from "dotenv";
import assert from "assert";

dotenv.config();
assert(process.env.PORT, 'Environment variable "PORT" is required');
assert(process.env.SECRET, 'Environment variable "SECRET" is required');
