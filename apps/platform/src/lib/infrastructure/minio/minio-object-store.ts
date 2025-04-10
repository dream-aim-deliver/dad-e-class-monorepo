import { inject } from "inversify";
import * as Minio from 'minio';
import { Logger } from "pino";
import { UTILS } from "../server/config/ioc/cms-rest-symbols";
import { MinioPFN, processBucketName } from "./utils";


export default class MinioObjectStore {
  client: Minio.Client;
  private signedUrlExpiry: number;
  private logger: Logger;

  constructor(
    @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger,
  ) {

    const host = process.env.MINIO_HOST || 'localhost';
    const port = parseInt(process.env.MINIO_PORT || '9000', 10);
    const accessKey = process.env.MINIO_ACCESS_KEY || '';
    const secretKey = process.env.MINIO_SECRET_KEY || '';
    const useSSL = process.env.MINIO_USE_SSL === 'true';
    const signedUrlExpiry = parseInt(process.env.MINIO_SIGNED_URL_EXPIRY || '3600', 10);

    this.logger = this.loggerFactory("MinioObjectStore");

    this.client = new Minio.Client({
      endPoint: host,
      port: port,
      accessKey: accessKey,
      secretKey: secretKey,
      useSSL: useSSL,
    } as unknown as any);  // 'endPoint' property is required, but not in the type definition
    this.signedUrlExpiry = signedUrlExpiry;
  }

  /**
   * Pings the Minio server to check if the connection is successful.
   * 
   * @returns true if the connection to Minio is successful, false otherwise
   */
  async ping(): Promise<boolean> {
    try {
      await this.client.listBuckets();
      this.logger.info(`pong`);
      return true;

    } catch (err) {
      const errorMessage = (err as Error).message || 'Unknown error';
      this.logger.error(err, `Error connecting to Minio: ${errorMessage}`);
      return false;
    }
  }

  /**
   * Checks if a bucket exists in Minio.
   * 
   * @param bucketNameRaw - The raw bucket name to check
   * @returns true if the bucket exists, false otherwise
   */
  async bucketExists(bucketNameRaw: string): Promise<boolean> {
    const bucketName = processBucketName(bucketNameRaw);
    const exists = await this.client.bucketExists(bucketName);
    this.logger.debug(`Bucket '${bucketName}' exists? ${exists}`);
    return exists;
  }

  /**
   * Creates a new bucket in Minio.
   * 
   * @param bucketNameRaw - The raw bucket name to create
   * @returns void
   */
  async createBucket(bucketNameRaw: string): Promise<void> {
    const bucketName = processBucketName(bucketNameRaw);
    await this.client.makeBucket(bucketName);
    this.logger.info(`Bucket ${bucketName} created successfully.`);
  }

  /**
   * Creates a new bucket in Minio if it does not already exist.
   * 
   * @param bucketNameRaw - The raw bucket name to create
   * @returns void
   */
  async createBucketIfNotExists(bucketNameRaw: string): Promise<void> {
    const bucketName = processBucketName(bucketNameRaw);
    const exists = await this.bucketExists(bucketName);
    if (!exists) {
      await this.createBucket(bucketName);
    } else {
      this.logger.info(`Bucket ${bucketName} already exists.`);
    }
  }

  /**
   * Initialize the Minio S3 Object Store with a bucket.
   * 
   * @param bucketNameRaw - The raw bucket name to initialize
   * @returns void
   */
  async initializeStore(bucketNameRaw: string): Promise<void> {
    const bucketName = processBucketName(bucketNameRaw);
    await this.createBucketIfNotExists(bucketName);
    this.logger.info(`Minio S3 Object Store initialized with bucket '${bucketName}'.`);
  }

  /**
   * Lists all objects in a bucket.
   * 
   * @param bucketNameRaw - The raw bucket name to list objects from
   * @returns An array of objects in the bucket
   */
  async listObjects(bucketNameRaw: string): Promise<MinioPFN[]> {
    const bucketName = processBucketName(bucketNameRaw);
    const objects: MinioPFN[] = [];

    const stream = this.client.listObjects(bucketName, '', true);
    for await (const obj of stream) {
      objects.push(obj);
    }

    this.logger.info(`Listed ${objects.length} objects from bucket '${bucketName}'.`);
    return objects;
  }

  /**
   * Checks if an object exists in a bucket.
   * 
   * @param minioObject - The MinioPFN object to check
   * @returns true if the object exists, false otherwise
   */
  async objectExists(minioObject: MinioPFN): Promise<boolean> {
    const bucketName = minioObject.bucketName;
    const objectName = minioObject.objectName;

    const exists = await this.client.statObject(bucketName, objectName).then(() => true).catch(() => false);
    this.logger.debug(`Object '${objectName}' exists in bucket '${bucketName}'? ${exists}`);
    return exists;
  }

  /**
   * Gets a signed URL for uploading a file to Minio.
   * 
   * @param minioObject - The MinioPFN object to get the signed URL for
   * @returns The signed URL for uploading the file
   */
  async getSignedUrlForFileUpload(minioObject: MinioPFN): Promise<string> {
    const url = await this.client.presignedPutObject(minioObject.bucketName, minioObject.objectName, this.signedUrlExpiry);
    this.logger.info(`Generated signed URL for file upload for object '${minioObject.objectName}' in bucket '${minioObject.bucketName}': [[ ${url} ]]`);
    return url;
  }

  /**
   * Gets a signed URL for downloading a file from Minio.
   * 
   * @param minioObject - The MinioPFN object to get the signed URL for
   * @returns The signed URL for downloading the file
   */
  async getSignedUrlForFileDownload(minioObject: MinioPFN): Promise<string> {
    const url = await this.client.presignedGetObject(minioObject.bucketName, minioObject.objectName, this.signedUrlExpiry);
    this.logger.info(`Generated signed URL for file download for object '${minioObject.objectName}' in bucket '${minioObject.bucketName}': [[ ${url} ]]`);
    return url;
  }




}