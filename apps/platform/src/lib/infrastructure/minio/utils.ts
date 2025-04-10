import { z } from 'zod';
import { models } from '@maany_shr/e-class-core';

export const processBucketName = (raw: string): string => {

    if (raw === '') {
        throw new Error('Bucket name cannot be empty');
    };

    const cleaned = raw.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase().slice(0, 62);

    if (cleaned.length === 0) {
        throw new Error(`Bucket name contains only reserved characters, please provide a valid name. Found: '${raw}'`);
    }

    let final = cleaned;
    if (cleaned.length < 3) {
        final = `${cleaned}${'-bucket'}`;
    }
    return final;
}

export const processObjectName = (raw: string): string => {
    if (raw === '') {
        throw new Error('Object name cannot be empty');
    }
    // Remove maximal filepath reserved characters across all OSs, except for '/' and '.'
    const cleaned = raw.replace(/[\\*?<>|"':]/g, '');

    if (cleaned.length === 0) {
        throw new Error(`Object name contains only reserved characters, please provide a valid name. Found: '${raw}'`);
    }

    if (cleaned.length > 255) {
        throw new Error(`Object name must be less than 255 characters. Found: '${cleaned}', length: ${cleaned.length}`);
    }
    const parts = cleaned.split('/');

    if (parts.length < 2) {
        throw new Error(`Object name must contain, at least, an ID and a file name separated by a '/'. Found: '${raw}'`);
    }

    const fileName = parts[parts.length - 1];
    const fileNameParts = fileName.split('.');

    if (fileNameParts.length !== 2) {
        throw new Error(`Object name must contain a file name and an extension, separated by a single dot. Found '${fileName}' as file name in '${raw}'`);
    }

    return cleaned;

}


export const MinioPFNSchema = z.object({
    bucketName: z.preprocess((v) => processBucketName(String(v)), z.string()),
    objectName: z.preprocess((v) => processObjectName(String(v)), z.string()),
});
export type MinioPFN = z.infer<typeof MinioPFNSchema>;

export const minioPFNToString = (pfn: MinioPFN): string => {
    return `${pfn.bucketName}/${pfn.objectName}`;
};


export const fileToMinioPFN = (file: models.file.TFile): MinioPFN => {

    const fileID = file.id;

    if (!fileID) {
        throw new Error('File ID is required to create a MinioPFN. Please register the file first.');
    }
    if (!file.lfn) {
        throw new Error('File LFN is required to create a MinioPFN. Please register the file first.');
    }

    // assume first part of LFN when splitting by '/' is the bucket name
    const [bucketName, ...objectNameParts] = file.lfn.split('/');

    // craft filename <filename>_<fileID>.<extension>
    const fileName = objectNameParts.pop();

    if (!fileName){throw new Error(`Invalid File lfn. expected a structure like "{bucketName}/../{file.id}/{fileName}.{fileExtension}", but found "${file.lfn}" instead.`)}

    const fileNameParts = fileName.split('.');
    const fileExtension = fileNameParts.pop();
    if (!fileExtension) {throw new Error(`Invalid File name. Expected a structure like "{fileName}.{fileExtension}", but found "${fileNameParts}" instead.`)}

    const fileNameWithoutExtension = fileNameParts.join('.');
    const newFileName = `${fileID}/${fileNameWithoutExtension}.${fileExtension}`;

    objectNameParts.push(newFileName);

    // craft the object name
    const objectName = objectNameParts.join('/');

    // validate the bucket name and object name
    const pfnParse = MinioPFNSchema.safeParse({
        bucketName,
        objectName,
    });

    if (!pfnParse.success) {throw new Error(`Produced an invalid Minio PFN while trying to parse file LFN "${file.lfn}". Details: ${pfnParse.error}`)}

    return pfnParse.data;
};

export const minioPFNToFile = (pfn: MinioPFN): models.file.TFile => {
    const objectNameParts = pfn.objectName.split('/');

    // fileID is in the slash before the file name: .../<fileID>/<filename>.<extension>
    const fileName = objectNameParts.pop();
    const fileID = objectNameParts.pop();

    const result = [];

    result.push(pfn.bucketName);
    result.push(...objectNameParts);
    result.push(fileName);
    const lfn = result.join('/');

    return {
        id: fileID,
        provider: 'minio',
        lfn: lfn,
        externalId: "",
        status: 'AVAILABLE',
    };
}
