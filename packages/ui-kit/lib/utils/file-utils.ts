import SparkMD5 from 'spark-md5';

export async function calculateMd5(file: File, onProgress?: (percentage: number) => void): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunkSize = 2 * 1024 * 1024; // 2MB chunks
        const spark = new SparkMD5.ArrayBuffer();
        const reader = new FileReader();
        let currentChunk = 0;
        const chunks = Math.ceil(file.size / chunkSize);

        reader.onload = function (event) {
            if (!event.target || !event.target.result) {
                reject(new Error('Failed to read file'));
                return;
            }
            
            spark.append(event.target.result as ArrayBuffer);
            currentChunk++;

            // Report progress
            if (onProgress) {
                const percentage = Math.round((currentChunk / chunks) * 100);
                onProgress(percentage);
            }

            if (currentChunk < chunks) {
                loadNext();
            } else {
                // Get the computed hash
                const rawHash = spark.end();
                // Convert hex string to base64 to match the original output format
                const hexArray = rawHash.match(/\w{2}/g)!;
                const byteArray = hexArray.map(hex => parseInt(hex, 16));
                const base64Hash = Buffer.from(byteArray).toString('base64');
                resolve(base64Hash);
            }
        };

        reader.onerror = function (error) {
            reject(error);
        };

        function loadNext() {
            const start = currentChunk * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            reader.readAsArrayBuffer(file.slice(start, end));
        }

        loadNext();
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
    onProgress?: (percentage: number) => void;
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
    onProgress,
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

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Track upload progress
        if (onProgress) {
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentage = Math.round((event.loaded / event.total) * 100);
                    onProgress(percentage);
                }
            });
        }

        // Handle completion
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
            } else {
                reject(new Error(`Failed to upload file to storage. Status: ${xhr.status}, Response: ${xhr.responseText}`));
            }
        });

        // Handle errors
        xhr.addEventListener('error', () => {
            reject(new Error('Network error during upload'));
        });

        // Handle abort
        if (abortSignal) {
            abortSignal.addEventListener('abort', () => {
                xhr.abort();
                reject(new AbortError());
            });
        }

        // Send the request
        xhr.open('POST', storageUrl);
        xhr.send(formData);
    });
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
