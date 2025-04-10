import * as fs from "fs";
import { execSync } from "child_process";
import { Logger } from "pino";
import * as path from "path";
import * as dotenv from "dotenv";
import MinioRepository from "./minio-repository";


const MINIO_PORT = "9001";

if (!MINIO_PORT) {
    throw new Error("MINIO_PORT environment variable not found");
}
let retries = 0;
const maxRetries = 10;
while (retries < maxRetries) {
    try {
        execSync(`curl -f http://localhost:${MINIO_PORT}/minio/health/live`);
        break;
    } catch {
        await new Promise(res => setTimeout(res, 1000));
        retries++;
    }
}

if (retries === maxRetries) {
    throw new Error("MinIO container failed to become healthy");
}

const loggerFactory = (module: string): Logger => {
    return {
        info: (msg: string) => console.log(`[INFO] [${module}] ${msg}`),
        error: (msg: string) => console.error(`[ERROR] [${module}] ${msg}`),
        warn: (msg: string) => console.warn(`[WARN] [${module}] ${msg}`),
        debug: (msg: string) => console.debug(`[DEBUG] [${module}] ${msg}`),
        trace: (msg: string) => console.trace(`[TRACE] [${module}] ${msg}`),
        fatal: (msg: string) => console.error(`[FATAL] [${module}] ${msg}`),
    } as Logger;
};


export const minioRepository = new MinioRepository(loggerFactory);
