import { inject, injectable } from "inversify";
import { Logger } from "pino";
import MinioObjectStore from "./minio-object-store";
import { UTILS } from "../server/config/ioc/cms-rest-symbols";
import { models } from "@maany_shr/e-class-core";
import { fileToMinioPFN } from "./utils";
import { TFileExistsInMinioDTO, TGetCliendDataForDownloadDTO, TGetClientDataForUploadDTO } from "./minio-dto";


@injectable()
export default class MinioRepository {
    store: MinioObjectStore;
    private logger: Logger;

    constructor(
        @inject(UTILS.LOGGER_FACTORY) private loggerFactory: (module: string) => Logger,
    ) {
        this.logger = this.loggerFactory("MinioObjectStore");
        this.store = new MinioObjectStore(this.loggerFactory);
    }

    /**
      * 
      * @param file - The file to check
      * 
      * @returns A promise that resolves to a DTO containing the result of the check
      */
    async fileExistsInMinio(file: models.file.TFile): Promise<TFileExistsInMinioDTO> {
        try {
            const pfn = fileToMinioPFN(file);
            const exists = await this.store.objectExists(pfn);

            return {
                success: true,
                data: {
                    exists,
                }
            }

        } catch (error) {
            const err = error as Error;
            this.logger.error(err, "Error checking if file exists in Minio");
            return {
                success: false,
                data: {
                    name: "MinioFileExistsError",
                    code: 500,
                    message: "Error checking if file exists in Minio",
                    context: err,
                }
            }
        }
    }

    /**
     * 
     * @param file - The file to upload
     * 
     * @returns A promise that resolves to a DTO containing the signed URL for uploading the file
     */
    async getClientDataForUpload(file: models.file.TFile): Promise<TGetClientDataForUploadDTO> {
        try {
            const fileExistsDTO = await this.fileExistsInMinio(file);

            if (fileExistsDTO.success) {
                const pfn = fileToMinioPFN(file);

                if (fileExistsDTO.data.exists) {
                    this.logger.warn(`File with ID '${file.id}', lfn '${file.lfn}' already exists in MinIO. This operation will overwrite it.`)
                }

                const url = await this.store.getSignedUrlForFileUpload(pfn)

                return {
                    success: true,
                    data: {
                        credentials: url,
                    }
                }
            } else {
                this.logger.error(fileExistsDTO.data, `Error looking in MinIO for file with ID '${file.id}' and LFN '${file.lfn}'.`)
                return {
                    success: false,
                    data: {
                        name: "MinioFileExistsError",
                        message: `Error looking in MinIO for file with ID '${file.id}' and LFN '${file.lfn}'.`,
                        code: 500,
                        context: fileExistsDTO
                    }
                }
            }

        } catch (error) {
            const err = error as Error;
            this.logger.error(err, "Error generating signed URL for file upload");
            return {
                success: false,
                data: {
                    name: "MinioFileUploadError",
                    code: 500,
                    message: "Error generating signed URL for file upload",
                    context: err,
                }
            }
        }
    }

    /**
     * 
     * @param file - The file to download
     * 
     * @returns A promise that resolves to a DTO containing the signed URL for downloading the file
     */
    async getClientDataForDownload(file: models.file.TFile): Promise<TGetCliendDataForDownloadDTO> {
        try {
            const fileExistsDTO = await this.fileExistsInMinio(file);
            if (fileExistsDTO.success) {
                if (!fileExistsDTO.data.exists) {
                    return {
                        success: false,
                        data: {
                            name: "MinioFileNotFound",
                            message: `File with ID '${file.id}' and LFN '${file.lfn}' doesn't exist in MinIO.`,
                            code: 404,
                            context: fileExistsDTO
                        }
                    }
                }

                const pfn = fileToMinioPFN(file);
                const url = await this.store.getSignedUrlForFileDownload(pfn)

                return {
                    success: true,
                    data: {
                        credentials: url,
                    }
                }

            } else {
                this.logger.error(fileExistsDTO.data, `Error looking in MinIO for file with ID '${file.id}' and LFN '${file.lfn}'.`)
                return {
                    success: false,
                    data: {
                        name: "MinioFileExistsError",
                        message: `Error looking in MinIO for file with ID '${file.id}' and LFN '${file.lfn}'.`,
                        code: 500,
                        context: fileExistsDTO
                    }
                }
            }

        }
        catch (error) {
            const err = error as Error;
            this.logger.error(err, "Error generating signed URL for file download");
            return {
                success: false,
                data: {
                    name: "MinioFileDownloadError",
                    code: 500,
                    message: "Error generating signed URL for file download",
                    context: err,
                }
            }
        }
    }


};