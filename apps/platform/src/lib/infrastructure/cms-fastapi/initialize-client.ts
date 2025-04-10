import {
    healthPingGet, client, createApiV1RepositoryPlatformPost, listApiV1RepositoryPlatformGet, createApiV1RepositoryLanguagePost, listApiV1RepositoryLanguageGet,
    createApiV1RepositoryPlatformLanguagePost, listApiV1RepositoryPlatformLanguageGet,
    createApiV1RepositoryFilePost,
    listApiV1RepositoryFileGet,
    createApiV1RepositoryHomePagePost,
    listApiV1RepositoryHomePageGet,
} from "@maany_shr/e-class-cms-fastapi-sdk";


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








export const initializeHomePageMongoDB = async () => {



};
