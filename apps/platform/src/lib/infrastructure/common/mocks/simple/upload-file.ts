import { fileMetadata } from '@maany_shr/e-class-models';

export const simulateUploadFile = (
    file: File,
): Promise<fileMetadata.TFileMetadata> => {
    const blobUrl = URL.createObjectURL(file);
    return Promise.resolve({
        id: Math.random().toString(36).substring(2, 15),
        name: file.name,
        size: file.size,
        url: blobUrl,
        status: 'available',
        category: 'generic',
    });
};
