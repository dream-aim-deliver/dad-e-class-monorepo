import { fileMetadata } from '@maany_shr/e-class-models';
import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';

import {
	AbortError,
	calculateMd5,
	uploadToS3,
	downloadFile,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../../../trpc/cms-client';


export function useProfilePictureUpload({
	initialImage = null,
	onProgressUpdate,
}: {initialImage: fileMetadata.TFileMetadataImage | null,
    onProgressUpdate?: (progress: number) => void,}) {
	const t = useTranslations('components.useCourseImageUpload');

	// Use uploadProfilePicture as a temporary workaround until dedicated profile upload procedure exists
	const uploadMutation = trpc.requestFileUpload.useMutation();
	const verifyMutation = trpc.getDownloadUrl.useMutation();

	const [profilePicture, setProfilePicture] =
		useState<fileMetadata.TFileMetadataImage | null>(initialImage);
	const [uploadError, setUploadError] = useState<string | undefined>(
		undefined,
	);

	// Sync state when initialImage changes - use ID as stable dependency
	useEffect(() => {
		// Only update if the IDs are different (avoids infinite loops from object recreation)
		if (initialImage?.id !== profilePicture?.id) {
			setProfilePicture(initialImage);
		}
	}, [initialImage?.id]); // Only depend on ID, not the whole object

	const uploadImage = async (
		uploadRequest: fileMetadata.TFileUploadRequest,
		abortSignal?: AbortSignal,
	): Promise<fileMetadata.TFileMetadataImage> => {
		if (abortSignal?.aborted) {
			throw new AbortError();
		}

		// Track MD5 calculation progress (0-30% of total)
		const checksum = await calculateMd5(uploadRequest.file, (md5Progress) => {
			onProgressUpdate?.(Math.round(md5Progress * 0.3));
		});

		// Request upload credentials from backend
		const uploadResult = await uploadMutation.mutateAsync({
			upload:{
				name: uploadRequest.name,
				checksum,
				mimeType: uploadRequest.file.type,
				size: uploadRequest.file.size,
			    uploadType: 'upload_avatar_image',
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
			thumbnailUrl: (verifyResult.data as any).downloadUrl,
			size: (uploadResult.data as any).file.size,
			category: 'image' as const,
			status: 'available',
		} as fileMetadata.TFileMetadataImage;
	};

	const handleFileChange = async (
		uploadRequest: fileMetadata.TFileUploadRequest,
		abortSignal?: AbortSignal,
	): Promise<fileMetadata.TFileMetadata> => {
		setUploadError(undefined);
		try {
			return await uploadImage(uploadRequest, abortSignal);
		} catch (error) {
			if (error instanceof AbortError) {
				console.warn(t('uploadAbortError'));
			} else {
				console.error('Profile picture upload failed:', error);
				setUploadError(t('uploadFailedError'));
			}
			throw error;
		}
	};

	const handleUploadComplete = useCallback((file: fileMetadata.TFileMetadata) => {
		// Since profile pictures are always images, we can safely cast
		setProfilePicture(file as fileMetadata.TFileMetadataImage);
	}, []);

	const handleDelete = (id: string) => {
		if (profilePicture?.id === id) {
			setProfilePicture(null);
		}
	};

	const handleDownload = async (id: string) => {
		if (profilePicture?.id !== id) return;
		downloadFile(profilePicture.url, profilePicture.name);
	};

	return {
		profilePicture,
		uploadError,
		handleFileChange,
		handleUploadComplete,
		handleDelete,
		handleDownload,
	};
}
