import { fileMetadata } from '@maany_shr/e-class-models';
import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { trpc } from '../../../../trpc/cms-client';
import {
	AbortError,
	calculateMd5,
	uploadToS3,
	downloadFile,
} from '@maany_shr/e-class-ui-kit';

// Type for document file metadata (inferred from discriminated union)
type TFileMetadataDocument = Extract<fileMetadata.TFileMetadata, { category: 'document' }>;

export function useCurriculumVitaeUpload({
	initialDocument = null,
	onProgressUpdate,
}: {
	initialDocument: TFileMetadataDocument | null;
	onProgressUpdate?: (progress: number) => void;
}) {
	const t = useTranslations('components.useCourseImageUpload');

	// Use uploadCourseImage as a temporary workaround until dedicated profile upload procedure exists
	const uploadMutation = trpc.requestFileUpload.useMutation();
	const verifyMutation = trpc.getDownloadUrl.useMutation();

	const [curriculumVitae, setCurriculumVitae] =
		useState<TFileMetadataDocument | null>(initialDocument);
	const [uploadError, setUploadError] = useState<string | undefined>(
		undefined,
	);
  
	useEffect(()=>{
		setCurriculumVitae(initialDocument);
	}, [initialDocument]);
	const uploadDocument = async (
		uploadRequest: fileMetadata.TFileUploadRequest,
		abortSignal?: AbortSignal,
	): Promise<TFileMetadataDocument> => {
		if (abortSignal?.aborted) {
			throw new AbortError();
		}

		// Track MD5 calculation progress (0-30% of total)
		const checksum = await calculateMd5(uploadRequest.file, (md5Progress) => {
			onProgressUpdate?.(Math.round(md5Progress * 0.3));
		});

		// Request upload credentials from backend
		const uploadResult = await uploadMutation.mutateAsync({
		upload:{name: uploadRequest.name,
			uploadType: 'upload_cv_file',
			checksum,
			mimeType: uploadRequest.file.type,
			size: uploadRequest.file.size,
		}});

		if (!uploadResult.success) {
			throw new Error(t('uploadCredentialsError'));
		}

		if (abortSignal?.aborted) {
			throw new AbortError();
		}

		// Upload to S3 with progress tracking (30-100% of total)
		await uploadToS3({
			file: uploadRequest.file,
			checksum,
			storageUrl: (uploadResult.data as any).storageUrl,
			objectName: (uploadResult.data as any).file.objectName,
			formFields: (uploadResult.data as any).formFields,
			abortSignal,
			onProgress: (uploadProgress) => {
				onProgressUpdate?.(30 + Math.round(uploadProgress * 0.7));
			},
		});

		// Verify upload and get download URL
		const verifyResult = await verifyMutation.mutateAsync({
			fileId: (uploadResult.data as any).file.id,
		});

		if (!verifyResult.success) {
			throw new Error(t('verifyImageError'));
		}

		return {
			id: (uploadResult.data as any).file.id,
			name: (uploadResult.data as any).file.name,
			url: (verifyResult.data as any).downloadUrl,
			size: (uploadResult.data as any).file.size,
			category: 'document' as const,
			status: 'available',
		} as TFileMetadataDocument;
	};

	const handleFileChange = async (
		uploadRequest: fileMetadata.TFileUploadRequest,
		abortSignal?: AbortSignal,
	): Promise<fileMetadata.TFileMetadata> => {
		setUploadError(undefined);
		try {
			return await uploadDocument(uploadRequest, abortSignal);
		} catch (error) {
			if (error instanceof AbortError) {
				console.warn(t('uploadAbortError'));
			} else {
				console.error('Curriculum vitae upload failed:', error);
				setUploadError(t('uploadFailedError'));
			}
			throw error;
		}
	};

	const handleUploadComplete = useCallback((file: TFileMetadataDocument) => {

		setCurriculumVitae(file);
	}, []);

	const handleDelete = (id: string) => {
		if (curriculumVitae?.id === id) {
			setCurriculumVitae(null);
		}
	};

	const handleDownload = async (id: string) => {
		if (curriculumVitae?.id !== id) return;
		downloadFile(curriculumVitae.url, curriculumVitae.name);
	};

	return {
		curriculumVitae,
		uploadError,
		handleFileChange,
		handleUploadComplete,
		handleDelete,
		handleDownload,
	};
}
