import { fileMetadata } from '@maany_shr/e-class-models';

export const simulateUploadFile = (
    file: File,
): Promise<fileMetadata.TFileMetadata> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: Math.random().toString(36).substring(2, 15),
                name: file.name,
                size: file.size,
                url: 'https://example.com/mock-file-url',
                status: 'available',
                category: 'generic',
            });
        }, 1000);
    });
};
