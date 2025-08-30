import CryptoJS from 'crypto-js';

export async function calculateMd5(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            if (!event.target || !event.target.result) {
                reject(new Error('Failed to read file'));
                return;
            }
            const arrayBuffer = event.target.result as ArrayBuffer;
            const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
            const hash = CryptoJS.MD5(wordArray);
            resolve(CryptoJS.enc.Base64.stringify(hash));
        };

        reader.onerror = function (error) {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
}

export class AbortError extends Error {
    constructor(message = 'The operation was aborted') {
        super(message);
        this.name = 'AbortError';
    }
}

interface UploadToS3Params {
    file: File;
    checksum: string;
    objectName: string;
    storageUrl: string;
    formFields: Record<string, string>;
    abortSignal?: AbortSignal;
}

/**
 * Maps form field keys from camelCase to the expected S3 form field names.
 * NOTE: This is a small workaround until the backend sends the keys formatted properly.
 */
export const formFieldsKeyMap: Record<string, string> = {
    xAmzAlgorithm: "x-amz-algorithm",
    xAmzCredential: "x-amz-credential",
    xAmzDate: "x-amz-date",
    xAmzSignature: "x-amz-signature"
};

export async function uploadToS3({
    file,
    storageUrl,
    objectName,
    checksum,
    formFields,
    abortSignal,
}: UploadToS3Params): Promise<void> {
    const formData = new FormData();
    Object.entries(formFields).forEach(([key, value]) => {
        const mappedKey = formFieldsKeyMap[key] || key; // remap if known, otherwise keep original
        formData.append(mappedKey, value as string);
    });
    formData.append('key', objectName);
    formData.append('Content-Type', file.type);
    formData.append('Content-MD5', checksum);

    formData.append('file', file);

    const response = await fetch(storageUrl, {
        method: 'POST',
        body: formData,
        signal: abortSignal,
    });

    if (!response.ok) {
        throw new Error(`Failed to upload file to storage. Response dump: ${await response.text()}`);
    }
}

export async function downloadFile(url: string, name: string) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();

        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = name;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Download failed:', error);
    }
}
