import {
    healthPingGet, client, createApiV1RepositoryPlatformPost, listApiV1RepositoryPlatformGet, createApiV1RepositoryLanguagePost, listApiV1RepositoryLanguageGet,
    createApiV1RepositoryPlatformLanguagePost, listApiV1RepositoryPlatformLanguageGet,
    createApiV1RepositoryFilePost,
    listApiV1RepositoryFileGet,
    createApiV1RepositoryHomePagePost,
    listApiV1RepositoryHomePageGet,
    listApiV1RepositoryTopicGet,
    createApiV1RepositoryTopicPost,
} from "@maany_shr/e-class-cms-fastapi-sdk";
import { minioRepository } from "../minio/demo-minio";
import path from 'path';
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


export const initializeHomePages = async () => {

    // Check if HomePage entries already exist (if 6 or more, skip)
    const homePagesResponse = await listApiV1RepositoryHomePageGet({
        headers: { "x-auth-token": X_AUTH_TOKEN },
    });
    if (homePagesResponse.data?.success && homePagesResponse.data.data.length >= 6) {
        console.log("Home pages already exist.");
        return;
    }

    // Load platforms, languages, and files
    const [platformsRes, languagesRes, filesRes] = await Promise.all([
        listApiV1RepositoryPlatformGet({ headers: { "x-auth-token": X_AUTH_TOKEN } }),
        listApiV1RepositoryLanguageGet({ headers: { "x-auth-token": X_AUTH_TOKEN } }),
        listApiV1RepositoryFileGet({ headers: { "x-auth-token": X_AUTH_TOKEN } }),
    ]);
    if (!platformsRes.data?.success || !languagesRes.data?.success || !filesRes.data?.success) {
        console.error("Error loading initial data");
        return;
    }
    const platforms = platformsRes.data.data;
    const languages = languagesRes.data.data;
    const files = filesRes.data.data;

    // Identify English and German language objects by .code
    const englishLang = languages.find((lang: any) => lang.code === "en-UK");
    const germanLang = languages.find((lang: any) => lang.code === "de-CH");
    if (!englishLang || !germanLang) {
        console.error("Missing one or both languages (en-UK, de-CH)");
        return;
    }

    // Gather platformLanguage entries for each platform by querying with platform_id
    const platformLanguages: any[] = [];
    for (const platform of platforms) {
        const plResponse = await listApiV1RepositoryPlatformLanguageGet({
            headers: { "x-auth-token": X_AUTH_TOKEN },
            query: { platform_id: platform.id },
        });
        if (plResponse.data?.success && Array.isArray(plResponse.data?.data)) {
            platformLanguages.push(...plResponse.data.data);
        }
    }

    // Get the necessary file entries for use in the homepage content.
    // For our homepage, we need files from mux (video), thumbnail (hb-thumb.png), card images, and cod images.
    const videoFile = files.find((file: any) => file.provider === "mux");
    const thumbnailFile = files.find((file: any) => file.lfn.endsWith("hb-thumb.png"));
    const card1 = files.find((file: any) => file.lfn.endsWith("card-1.png"));
    const card2 = files.find((file: any) => file.lfn.endsWith("card-2.png"));
    const card3 = files.find((file: any) => file.lfn.endsWith("card-3.png"));
    const codDesktop = files.find((file: any) => file.lfn.endsWith("cod-desktop.png"));
    const codTablet = files.find((file: any) => file.lfn.endsWith("cod-tablet.png"));
    const codMobile = files.find((file: any) => file.lfn.endsWith("cod-mobile.png"));

    // Helper functions to build content for various sections

    // Build the Accordion list items with appropriate language text.
    const buildAccordionList = (lang: "en" | "de") => {
        // This description is shared across both items; note it may be modified as required.
        const baseDesc = JSON.stringify([
            {
                type: "paragraph",
                children: [
                    {
                        text:
                            lang === "en"
                                ? "Learn about the core technologies that power the modern web including HTML5, CSS3, and JavaScript."
                                : "Lernen Sie die Kerntechnologien kennen, die das moderne Web antreiben, einschließlich HTML5, CSS3 und JavaScript.",
                        highlight: true,
                    },
                ],
            },
            {
                type: "paragraph",
                children: [
                    {
                        text:
                            lang === "en"
                                ? "This course covers responsive design principles, semantic markup, and cross-browser compatibility."
                                : "Dieser Kurs behandelt responsive Design-Prinzipien, semantische Auszeichnungen und browserübergreifende Kompatibilität.",
                    },
                ],
            },
        ]);
        return [
            {
                title: lang === "en" ? "Matching" : "Abstimmung",
                description: baseDesc,
                position: 1,
                icon_img_file_id: card1?.id ?? 0,
            },
            {
                title: lang === "en" ? "Guided to success" : "Geführt zum Ziel",
                description: baseDesc,
                position: 2,
                icon_img_file_id: card2?.id ?? 0,
            },
        ];
    };

    // Build Hero section with language-specific text.
    const heroCommon = (lang: "en" | "de") => ({
        title:
            lang === "en"
                ? "Platform's Title, short and powerful"
                : "Plattform-Titel, kurz und kraftvoll",
        description:
            lang === "en"
                ? "Platform introduction. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna..."
                : "Plattform-Einführung. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna...",
        video_file_id: videoFile?.id ?? 0,
        thumbnail_file_id: thumbnailFile?.id ?? 0,
    });

    // Carousel items are the same across languages
    const carouselItems = [
        {
            title: "Visualisierung",
            description:
                "Du hast ein Konzept und konkrete Vorstellungen davon, was du umsetzen möchtest. Entwickle mit uns dein Branding, dein CI/CD, deine Website oder dein Werbefilm für Social Media. Wähle nur die Massnahmen, die du wirklich brauchst.",
            image_file_id: card1?.id ?? 0,
            badge: "Package",
            button_text: "from CHF 3140",
            button_link: "/",
        },
        {
            title: "Enterprise",
            description:
                "Ideal für Firmen oder Stellen, die einen freien und individuellen Zugang zu unserer Plattform brauchen und diese für einen längere Zeit nutzten wollen.",
            image_file_id: card2?.id ?? 0,
            badge: "",
            button_text: "Inquiries",
            button_link: "/",
        },
        {
            title: "Coaching on Demand",
            description:
                "Our professionals provide support where they are needed. With workshops, tips and 'learning by doing' we can reach our goals together more quickly.",
            image_file_id: card3?.id ?? 0,
            badge: "",
            button_text: "Find a coach (ab CHF 90)",
            button_link: "/",
        },
    ];

    // Coaching on demand section common to all, with translated title and description.
    const coachingCommon = (lang: "en" | "de") => ({
        title: lang === "en" ? "Coaching on demand" : "Coaching auf Abruf",
        description:
            lang === "en"
                ? "Are you looking for someone to exchange ideas with on equal footing, or do you want to learn new skills? Do you need support in choosing the right tools or advice for your project? Our industry experts are ready to help you succeed."
                : "Suchen Sie jemanden, mit dem Sie sich auf Augenhöhe austauschen können, oder möchten Sie neue Fähigkeiten erlernen? Brauchen Sie Unterstützung bei der Auswahl der richtigen Werkzeuge oder Beratung für Ihr Projekt? Unsere Experten stehen bereit, um Ihnen zum Erfolg zu verhelfen.",
        desktop_img_file_id: codDesktop?.id ?? 0,
        tablet_img_file_id: codTablet?.id ?? 0,
        mobile_img_file_id: codMobile?.id ?? 0,
    });

    // Accordion section common to all, with translated title.
    const accordionCommon = (lang: "en" | "de") => ({
        title: lang === "en" ? "How it works" : "So funktioniert's",
        show_numbers: true,
        list: buildAccordionList(lang),
    });

    // Helper: Create HomePage entries for a specific language.
    const createForLang = async (langCode: "en-UK" | "de-CH") => {
        // Filter the platformLanguages for entries matching the language id.
        const matchingPLs = platformLanguages.filter((pl: any) => pl.language_code === langCode);
        const langShort = langCode === "en-UK" ? "en" : "de";
        for (const pl of matchingPLs) {
            const homepage = {
                platform_language_id: pl.id,
                hero: heroCommon(langShort),
                carousel: carouselItems,
                coaching_on_demand: coachingCommon(langShort),
                accordion: accordionCommon(langShort),
            };
            const res = await createApiV1RepositoryHomePagePost({
                headers: { "x-auth-token": X_AUTH_TOKEN },
                body: homepage,
            });
            if (res.data?.success) {
                console.log(`Homepage created for platform_language_id: ${pl.id}`);
            } else {
                console.error(`Failed to create homepage for platform_language_id: ${pl.id}`, res.data);
            }
        }
    };

    // Create HomePage entries for English and German
    await createForLang("en-UK");
    await createForLang("de-CH");
    console.log("Home pages creation completed.");

};



export const initializeTopics = async () => {
    // Load platforms and languages
    const [platformsRes, languagesRes] = await Promise.all([
        listApiV1RepositoryPlatformGet({ headers: { "x-auth-token": X_AUTH_TOKEN } }),
        listApiV1RepositoryLanguageGet({ headers: { "x-auth-token": X_AUTH_TOKEN } }),
    ]);

    if (!platformsRes.data?.success || !languagesRes.data?.success) {
        console.error("Error fetching platforms or languages");
        return;
    }
    const platforms = platformsRes.data.data;
    const languages = languagesRes.data.data;

    // Identify English and German languages by code
    const englishLang = languages.find((lang: any) => lang.code === "en-UK");
    const germanLang = languages.find((lang: any) => lang.code === "de-CH");
    if (!englishLang || !germanLang) {
        console.error("Missing one or both required languages (en-UK, de-CH)");
        return;
    }

    // Gather platform_language entries for each platform
    const platformLanguages: any[] = [];
    for (const platform of platforms) {
        const plResponse = await listApiV1RepositoryPlatformLanguageGet({
            headers: { "x-auth-token": X_AUTH_TOKEN },
            query: { platform_id: platform.id },
        });
        if (plResponse.data?.success && Array.isArray(plResponse.data.data)) {
            platformLanguages.push(...plResponse.data.data);
        }
    }

    // Define the topics arrays
    const englishTopics: string[] = [
        "Branding and Identity",
        "Graphic and Visual Design",
        "Motion Design and Animation",
        "Sound Design and Editing",
        "Digital Content and Social Media Strategy",
        "Web Design and Development",
        "UI/UX Design",
        "Visual Storytelling",
        "Advertising Campaigns",
        "Key Visual Creation",
        "Holistic Concept Development",
        "Photography and Editing",
        "Prompting and AI Tools",
        "Idea Generation and Brainstorming",
        "Copywriting and Content Creation",
        "Strategy and Concept Development",
        "Creative and Art Direction",
        "Business Planning and Financing",
        "Pitching and Presentation Skills",
        "Typography, Layout, and Composition",
        "Cross-Channel Marketing",
        "Campaign Development",
        "Infographics and Data Visualization",
        "Packaging and Print Design",
        "Film and Cinematography",
    ];

    const germanTopics: string[] = [
        "Markenbildung und Identität",
        "Grafik- und Visualdesign",
        "Motion Design und Animation",
        "Sounddesign und -bearbeitung",
        "Digitale Inhalte und Social-Media-Strategie",
        "Webdesign und -entwicklung",
        "UI/UX-Design",
        "Visuelles Erzählen (Visual Storytelling)",
        "Werbekampagnen",
        "Schlüsselbild-Erstellung (Key Visual Creation)",
        "Ganzheitliche Konzeptentwicklung",
        "Fotografie und Bearbeitung",
        "Prompting und KI-Tools",
        "Ideenfindung und Brainstorming",
        "Texterstellung und Content Creation",
        "Strategie- und Konzeptentwicklung",
        "Kreativ- und Artdirection",
        "Geschäftsplanung und Finanzierung",
        "Präsentations- und Pitching-Fähigkeiten",
        "Typografie, Layout und Komposition",
        "Kanalübergreifendes Marketing",
        "Kampagnenentwicklung",
        "Infografiken und Datenvisualisierung",
        "Verpackungs- und Druckdesign",
        "Film und Kinematografie",
    ];

    // Process each platform_language entry
    for (const pl of platformLanguages) {
        // Check if topics already exist for the current platform_language
        const topicsRes = await listApiV1RepositoryTopicGet({
            headers: { "x-auth-token": X_AUTH_TOKEN },
            query: { platform_language_id: pl.id },
        });

        if (topicsRes.data?.success && Array.isArray(topicsRes.data.data) && topicsRes.data.data.length > 0) {
            console.log(`Topics already exist for platform_language_id: ${pl.id}`);
            continue;
        }

        // Find the language object using string conversion for IDs
        const language = languages.find((l: any) => String(l.id) === String(pl.language_id));
        if (!language) {
            console.warn(`No matching language found for platform_language_id: ${pl.id}`);
            continue;
        }
        // Debug output: log language code for the current platform_language
        console.log(`Platform_language_id ${pl.id} has language code: ${language.code}`);

        // Determine the topics set based on language code
        let topicsToCreate: string[] = [];
        if (language.code === "en-UK") {
            topicsToCreate = englishTopics;
        } else if (language.code === "de-CH") {
            topicsToCreate = germanTopics;
        } else {
            console.warn(`Unknown language code for platform_language_id: ${pl.id} (code: ${language.code})`);
            continue;
        }

        // Create topics one by one for the current platform_language
        for (const topicName of topicsToCreate) {
            const createRes = await createApiV1RepositoryTopicPost({
                headers: { "x-auth-token": X_AUTH_TOKEN },
                body: {
                    name: topicName,
                    platform_language_id: pl.id,
                },
            });
            if (createRes.data?.success) {
            } else {
                console.error(`Failed to create topic "${topicName}" for platform_language_id: ${pl.id}`, createRes.data);
            }
        }
    }

    console.log("Topics initialization completed.");
};