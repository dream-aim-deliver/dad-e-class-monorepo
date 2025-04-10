import {
    healthPingGet, client, createApiV1RepositoryPlatformPost, listApiV1RepositoryPlatformGet, createApiV1RepositoryLanguagePost, listApiV1RepositoryLanguageGet,
    createApiV1RepositoryPlatformLanguagePost, listApiV1RepositoryPlatformLanguageGet,
    createApiV1RepositoryFilePost,
    listApiV1RepositoryFileGet,
    createApiV1RepositoryHomePagePost,
    listApiV1RepositoryHomePageGet,
} from "@maany_shr/e-class-cms-fastapi-sdk";
import { minioRepository } from "../minio/demo-minio";
import path from 'path';
import axios from "axios";
import * as fs from "fs";
import { execSync } from "child_process";

const CMS_FASTAPI_HOST = "http://localhost:8000"
const X_AUTH_TOKEN = "test123"

export const pingCMSFastAPI = async () => {
    try {
        const result = await healthPingGet();
        if (result.error) {
            console.error("Error pinging CMS FastAPI:", result);
            return false;
        }
        console.log("CMS FastAPI is running");
        return true;
    } catch (error) {
        console.error("Error pinging CMS FastAPI:", error);
        return false;
    }
};


export const initializeCMSFastAPIClient = async () => {
    client.setConfig({
        baseURL: CMS_FASTAPI_HOST,
    })
};

export const createPlatforms = async () => {
    const pingResult = await pingCMSFastAPI();
    if (!pingResult) {
        console.error("CMS FastAPI is not running");
        return;
    }

    const platforms = ["Bewerbeagentur", "Just Do Ad", "Job Brand"];

    for (const name of platforms) {
        const existing = await listApiV1RepositoryPlatformGet({
            headers: {
                "x-auth-token": X_AUTH_TOKEN,
            },
            query: { name },
        });

        const exists = existing.data?.success && existing.data?.data?.length > 0;

        if (!exists) {
            await createApiV1RepositoryPlatformPost({
                headers: {
                    "x-auth-token": X_AUTH_TOKEN,
                },
                body: { name },
            });
        }
    }
};

export const createLanguages = async () => {
    const languages = [
        { code: "en-UK", language: "English (UK)" },
        { code: "de-CH", language: "German (Switzerland)" },
    ];

    for (const { code, language } of languages) {
        // Fetch all existing languages
        const existingLanguages = await listApiV1RepositoryLanguageGet({
            headers: {
                "x-auth-token": X_AUTH_TOKEN,
            },
        });

        // Check if the language already exists by matching the code
        const exists = existingLanguages.data?.success && existingLanguages.data?.data?.some((lang: any) => lang.code === code);

        if (!exists) {
            // Create the language if it doesn't exist
            await createApiV1RepositoryLanguagePost({
                headers: {
                    "x-auth-token": X_AUTH_TOKEN,
                },
                body: {
                    code,
                    language,
                },
            });
        }
    }
};


export const createPlatformLanguages = async () => {
    const platformIds = [1, 2, 3];
    const languageCodes = ["en-UK", "de-CH"];

    for (const platform_id of platformIds) {
        // Fetch all existing languages for the current platform using platform_id query
        const existingLanguages = await listApiV1RepositoryPlatformLanguageGet({
            headers: {
                "x-auth-token": X_AUTH_TOKEN,
            },
            query: { platform_id },
        });

        // Check if the response contains valid data
        if (existingLanguages.data?.success && existingLanguages.data?.data) {
            const existingLanguageCodes = existingLanguages.data.data.map((lang: any) => lang.language_code);

            // Now, create the languages that aren't already present for the current platform
            for (const language_code of languageCodes) {
                if (!existingLanguageCodes.includes(language_code)) {
                    await createApiV1RepositoryPlatformLanguagePost({
                        headers: {
                            "x-auth-token": X_AUTH_TOKEN,
                        },
                        body: {
                            platform_id,
                            language_code,
                        },
                    });
                }
            }
        } else {
            console.error(`Error fetching languages for platform ${platform_id}:`, existingLanguages);
        }
    }
};


export const registerFiles = async () => {
    const existingFiles = await listApiV1RepositoryFileGet({
        headers: {
            "x-auth-token": X_AUTH_TOKEN,
        },
    });

    // Check if the response is successful and contains data
    if (!existingFiles.data?.success || !existingFiles.data?.data) {
        console.error("Error fetching existing files:", existingFiles);
        return; // Exit if there's an issue with fetching files
    }

    // Check if there are at least 11 files
    if (existingFiles.data.data.length >= 11) {
        console.log("Files already exist.");
        return; // Exit if the files are already present
    }

    // Define the files to create
    const filesToCreate = [
        // Minio files (10 files)
        { provider: "minio", lfn: "demo/demo/card-1.png", external_id: "" },
        { provider: "minio", lfn: "demo/demo/card-2.png", external_id: "" },
        { provider: "minio", lfn: "demo/demo/card-3.png", external_id: "" },
        { provider: "minio", lfn: "demo/demo/cod-desktop.png", external_id: "" },
        { provider: "minio", lfn: "demo/demo/cod-mobile.png", external_id: "" },
        { provider: "minio", lfn: "demo/demo/cod-tablet.png", external_id: "" },
        { provider: "minio", lfn: "demo/demo/hb-thumb.png", external_id: "" },
        { provider: "minio", lfn: "demo/demo/logo-bw.png", external_id: "" },
        { provider: "minio", lfn: "demo/demo/logo-jbm.png", external_id: "" },
        { provider: "minio", lfn: "demo/demo/logo-jda.png", external_id: "" },

        // Mux file (1 file)
        { provider: "mux", lfn: "mux/homeBannerVideo.mp4", external_id: "ZnIB01PmIYRSeyOYvHHVJBwxg5eVV2MmY02wc01sYnFTLk" },
    ];

    // Create files if they don't already exist
    for (const file of filesToCreate) {
        const fileExists = existingFiles.data.data.some((existingFile: any) => existingFile.lfn === file.lfn);

        if (!fileExists) {
            await createApiV1RepositoryFilePost({
                headers: {
                    "x-auth-token": X_AUTH_TOKEN,
                },
                body: {
                    provider: file.provider,
                    lfn: file.lfn,
                    external_id: file.external_id,
                },
            });
            console.log(`Created file: ${file.lfn}`);
        } else {
            console.log(`File already exists: ${file.lfn}`);
        }
    }
};


export const uploadFilesToMinio = async () => {

    minioRepository.store.createBucketIfNotExists("demo");

    // Get the list of existing files from the repository
    const existingFiles = await listApiV1RepositoryFileGet({
        headers: {
            "x-auth-token": X_AUTH_TOKEN,
        },
    });

    // Check if the response is successful and contains data
    if (!existingFiles.data?.success || !existingFiles.data?.data) {
        console.error("Error fetching existing files:", existingFiles);
        return; // Exit if there's an issue with fetching files
    }

    // Filter the files that are from the "minio" provider
    const minioFiles = existingFiles.data.data.filter(file => file.provider === "minio");

    // Files to upload (base names)
    const filesToUpload = [
        "card-1.png", "card-2.png", "card-3.png",
        "cod-desktop.png", "cod-mobile.png", "cod-tablet.png",
        "hb-thumb.png", "logo-bw.png", "logo-jbm.png", "logo-jda.png"
    ];

    for (const fileName of filesToUpload) {
        // Construct the full file path based on the current directory and LFN
        const filePath = path.resolve(process.cwd(), 'src/lib/infrastructure/cms-fastapi/assets', fileName);

        // Create the file object for the current file
        const fileObj = minioFiles.find(file => file.lfn.endsWith(fileName));

        if (!fileObj) {
            console.error(`File object not found for: ${fileName}`);
            continue;
        }

        const fileModel = {
            id: `${fileObj.id}`,
            lfn: fileObj.lfn,
            external_id: fileObj.external_id,
            provider: fileObj.provider,
        }

        // Check if the file already exists in Minio
        const fileExistsDto = await minioRepository.fileExistsInMinio(fileModel);

        if (!fileExistsDto.success) {
            throw new Error(`Error checking if file exists in Minio: ${fileExistsDto.data.message}. Details: ${fileExistsDto.data.context}`);
        }

        if (fileExistsDto?.data?.exists) {
            console.log(`File already exists in Minio: ${fileName}`);
            continue; // Skip the upload if the file exists
        }

        // Get the signed URL for upload
        const clientDataDto = await minioRepository.getClientDataForUpload(fileModel);

        if (clientDataDto?.success && clientDataDto?.data?.credentials) {
            const signedUrl = clientDataDto.data.credentials;

            // Perform the PUT request to upload the file to Minio using curl
            try {
                console.log(`Uploading file: ${fileName}`);
                execSync(`curl -X PUT -T ${filePath} "${signedUrl}"`);

                console.log(`File uploaded successfully: ${fileName}`);
            } catch (error) {
                console.error(`Failed to upload file: ${fileName}`, error);
            }
        } else {
            console.error(`Failed to get client data for upload: ${fileName}`);
        }
    }

};





export const initializeHomePageMongoDB = async () => {



};
