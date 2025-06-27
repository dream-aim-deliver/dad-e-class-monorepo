import { useEffect, useRef, useState } from "react";
import { Button } from "./button"
import { IconPaste } from "./icons/icon-paste"
import { InputField } from "./input-field"
import { IconButton } from "./icon-button";
import { IconCloudDownload } from "./icons/icon-cloud-download";
import { IconExternalLink } from "./icons/icon-external-link";
import { IconLink } from "./icons/icon-link";
import { IconTrashAlt } from "./icons/icon-trash-alt";
import { IconEdit } from "./icons/icon-edit";
import { ImageUploadResponse, UploadedFileType } from "./drag-and-drop/uploader";
import { fileMetadata } from "@maany_shr/e-class-models";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { cn } from "../utils/style-utils";
/**
 * 
 * @param url The URL of the website to fetch the favicon from.
 * @description This function generates a favicon URL based on the provided website URL. It tries to fetch the favicon from common locations and falls back to a default favicon if it fails.
 * @example
 * ```tsx
 * const faviconUrl = getFaviconUrl("https://example.com");
 * ```
 * @example
 * ```tsx
 * const faviconUrl = getFaviconUrl("https://example.com");
 * @returns 
 */

const getFaviconUrl = (url: string): string => {
    try {
        // Parse the URL
        const urlObject = new URL(url);
        const hostname = urlObject.hostname;

        // Try multiple common favicon locations in order of preference
        // 1. Google's favicon service (reliable for many sites)
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
    } catch (error) {
        // Return a default favicon or placeholder instead of empty string
        console.warn(`Failed to generate favicon URL for: ${url}`, error);
        return "default-favicon.ico"; // Path to your default favicon
    }
};

interface LinkEditProps extends isLocalAware {
    initialTitle?: string;
    initialUrl?: string;
    initialFile?: string | null;
    onChange: (title: string, url: string, customIcon?: File) => void;
    onFileUpload?: (file: File) => Promise<fileMetadata.TFileMetadata>;
    onSave: () => void;
    onDiscard: () => void;
}
/**
 * LinkEdit component allows users to edit a link's title, URL, and custom icon. 
 * It validates the input fields and provides save and discard functionality.
 * 
 * @param initialTitle - Initial title value
 * @param initialUrl - Initial URL value  
 * @param initialFile - Initial file (if any)
 * @param onChange - Callback when title, url, or file changes
 * @param onFileUpload - Optional callback to handle file upload. Should return Promise<TFileMetadata>
 *                      The upload state will be determined by the status field in TFileMetadata:
 *                      - 'processing': Shows loading state
 *                      - 'available': File is ready and available
 *                      - 'unavailable': Shows error state
 * @param onSave - Callback when save button is clicked
 * @param onDiscard - Callback when discard button is clicked
 * @param locale - Locale for translations
 * 
 * @example
 * ```tsx
 * <LinkEdit
 *     initialTitle="My Link"
 *     initialUrl="https://example.com"
 *     initialFile={null}
 *     onChange={(title, url, customIcon) => console.log(title, url, customIcon)}
 *     onFileUpload={async (file) => {
 *         // Your file upload logic here
 *         const uploadRequest = {
 *             name: file.name,
 *             buffer: new Uint8Array(await file.arrayBuffer())
 *         };
 *         const response = await uploadAPI(uploadRequest);
 *         // Response should contain status: 'available' | 'processing' | 'unavailable'
 *         return response;
 *     }}
 *     onSave={() => console.log("Saved")}
 *     onDiscard={() => console.log("Discarded")}
 *     locale="en"
 * />
 * ```
 */

const LinkEdit: React.FC<LinkEditProps> = ({
    initialTitle = "",
    initialUrl = "",
    initialFile = null,
    onChange,
    onFileUpload,
    onSave,
    onDiscard,
    locale,
}) => {
    const [title, setTitle] = useState<string>(initialTitle);
    const [url, setUrl] = useState<string>(initialUrl);
    const [favicon, setFavicon] = useState<string>("");
    const [file, setFile] = useState<UploadedFileType | null>(
        initialFile && typeof initialFile !== 'string'
            ? { file: initialFile, isUploading: false }
            : null
    );
    const fileInputRef = useRef(null);
    const [customIconUrl, setCustomIconUrl] = useState<string>("");
    const [customIconError, setCustomIconError] = useState<boolean>(false);
    const [faviconError, setFaviconError] = useState<boolean>(false);
    const dictionary = getDictionary(locale);
    const validateFields = () => {
        const newErrors: { title?: string; url?: string } = {};
        if (!title.trim()) {
            newErrors.title = "Title is required";
        }
        if (!url.trim()) {
            newErrors.url = "URL is required";
        }
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateFields()) {
            onSave();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = e.target.files?.[0];
        if (newFile) {
            // Step 1: Create UI state for loading feedback (temporary until we get response)
            const uploadedFile:= {
                file: newFile,

            };
            setFile(uploadedFile);

            // Step 2: Create preview URL for immediate feedback
            const previewUrl = URL.createObjectURL(newFile);
            setCustomIconUrl(previewUrl);

            try {
                // Step 3: Use external upload handler if provided
                if (onFileUpload) {
                    const response = await onFileUpload(newFile);

                    // Step 4: Update UI state based on response status
                    setFile({
                        ...uploadedFile,
                        isUploading: response.status === 'processing', // Use status from response
                        responseData: {
                            imageId: response.lfn, // Use logical file name as ID
                            imageThumbnailUrl: response.category === 'image' ? response.url : previewUrl
                        } as ImageUploadResponse
                    });

                    // Step 5: Handle different status cases
                    if (response.status === 'unavailable') {
                        setFile(prev => prev ? { ...prev, error: 'File upload failed or is unavailable' } : null);
                        URL.revokeObjectURL(previewUrl);
                        setCustomIconUrl("");
                        return;
                    }
                } else {
                    // Step 4: Fallback - just mark as uploaded without server processing
                    setFile({
                        ...uploadedFile,
                        isUploading: false,
                        responseData: {
                            imageId: `local-${Date.now()}`,
                            imageThumbnailUrl: previewUrl
                        } as ImageUploadResponse
                    });
                }

                // Step 5: Notify parent component
                onChange(title, url, newFile);

            } catch (uploadError) {
                console.error('Upload error:', uploadError);
                setFile({
                    ...uploadedFile,
                    isUploading: false,
                    error: uploadError instanceof Error ? uploadError.message : 'Upload failed'
                });
                // Clean up preview URL on error
                URL.revokeObjectURL(previewUrl);
                setCustomIconUrl("");
            }
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        onChange(title, url, file?.file);
        if (!customIconUrl && url) {
            setFavicon(getFaviconUrl(url));
            setFaviconError(false); // Reset error state when URL changes
        }

        // Cleanup function to revoke object URLs when component unmounts
        return () => {
            if (customIconUrl) {
                URL.revokeObjectURL(customIconUrl);
            }
        };
    }, [title, url, customIconUrl, file]);

    return (
        <div className="p-4 flex flex-col border-1 rounded-md border-card-stroke w-full bg-card-fill gap-4 text-text-primary">
            <main className="flex flex-col gap-2">
                <h6 className="capitalize">{dictionary.components.courseBuilder.titleText}</h6>
                <InputField
                    value={title}
                    setValue={setTitle}
                    inputText="my new video assignment"
                />
            </main>
            <div className="flex flex-col gap-2">
                <h6 className="capitalize">{dictionary.components.courseBuilder.urlText}</h6>
                <InputField
                    value={url}
                    setValue={setUrl}
                    type="url"
                    hasRightContent
                    rightContent={<IconPaste />}
                    inputText="https://example.com"
                />

                <div className="flex flex-col gap-2">
                    <h6 className="capitalize">{dictionary.components.courseBuilder.iconLinkText}</h6>
                    {(customIconUrl && !customIconError) || (favicon && /^https?:\/\//.test(url) && !faviconError) ? (
                        <div className="inline-flex items-center gap-2 mt-1">
                            <img
                                src={customIconUrl || favicon}
                                alt={customIconUrl ? "Custom icon" : "Site favicon"}
                                className="w-12 h-12 object-cover rounded"
                                onError={() => {
                                    if (customIconUrl) {
                                        setCustomIconError(true);
                                    } else {
                                        setFaviconError(true);
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <IconButton
                            icon={<IconLink />}
                            size="medium"
                            className="bg-base-neutral-700 rounded-md text-text-primary"
                        />
                    )}
                    <Button
                        text="custom icon"
                        onClick={handleButtonClick}
                        hasIconLeft
                        iconLeft={<IconCloudDownload />}
                        variant="secondary"
                        className="w-fit"
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        aria-label="File upload"
                    />
                </div>
            </div>

            <div className="flex gap-2">
                <Button onClick={handleSave} variant="secondary" className="w-full capitalize" text={dictionary.components.courseBuilder.saveText} />
                <Button onClick={onDiscard} variant="primary" className="w-full capitalize" text={dictionary.components.courseBuilder.discardText} />
            </div>
        </div>
    )
}

interface LinkPreviewProps {
    title: string;
    url: string;
    customIcon?: File | string;  // Can be either a File object or image URL string
    onEdit?: () => void;
    onDelete?: () => void;
    preview?: boolean;
    className?: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ title, url, customIcon, onDelete, onEdit, preview = false, className }) => {
    const [favicon, setFavicon] = useState<string>("");
    const [customIconUrl, setCustomIconUrl] = useState<string>("");
    const [customIconError, setCustomIconError] = useState<boolean>(false);
    const [faviconError, setFaviconError] = useState<boolean>(false);

    useEffect(() => {
        if (url) {
            setFavicon(getFaviconUrl(url));
            setFaviconError(false); // Reset error state when URL changes
        } else {
            setFavicon("");
        }

        // Handle custom icon
        if (customIcon) {
            if (customIcon instanceof File) {
                setCustomIconUrl(URL.createObjectURL(customIcon));
            } else {
                setCustomIconUrl(customIcon);
            }
            setCustomIconError(false); // Reset error state when custom icon changes
        }
    }, [title, url, customIcon]);

    const renderIcon = () => {
        if (customIconUrl && !customIconError) {
            return (
                <img
                    src={customIconUrl}
                    alt={title}
                    className="w-12 h-12 object-cover rounded"
                    onError={() => setCustomIconError(true)}
                />
            );
        }
        if (favicon && !faviconError) {
            return (
                <img
                    src={favicon}
                    alt={title}
                    className="w-12 h-12 object-cover rounded"
                    onError={() => setFaviconError(true)}
                />
            );
        }
        return (
            <IconButton
                icon={<IconLink />}
                size="medium"
                className="bg-base-neutral-700 rounded-md text-text-primary"
            />
        );
    };

    return (
        <div className={cn("flex gap-2 h-auto text-text-primary w-full items-center justify-between", className)}>
            <main className="flex flex-grow min-w-0"> {/* Added min-w-0 to enable truncation */}
                <div className="w-full flex gap-2 items-center rounded-md">
                    <div className="flex-shrink-0"> {/* Prevent icon from shrinking */}
                        {renderIcon()}
                    </div>
                    <div className="flex flex-col flex-grow min-w-0"> {/* Added min-w-0 to enable truncation */}
                        <a target="blank" href={url} className="md:text-xl flex gap-1 items-center truncate underline hover:text-button-primary-fill">
                            <span className="truncate">{title}</span>
                            <IconExternalLink classNames="w-4 h-4 flex-shrink-0 hover:text-button-primary-fill" /> {/* Prevent icon from shrinking */}
                        </a>
                        <p className="text-sm text-text-secondary truncate">
                            {url}
                        </p>
                    </div>
                </div>
            </main>
            {preview && <div className="flex items-center gap-1 flex-shrink-0"> {/* Added flex-shrink-0 to prevent shrinking */}
                <IconButton
                    styles="text"
                    icon={<IconEdit />}
                    size="medium"
                    onClick={onEdit}
                />
                <IconButton
                    styles="text"
                    icon={<IconTrashAlt />}
                    size="medium"
                    onClick={onDelete}
                />
            </div>}
        </div>
    );
}

export { LinkEdit, LinkPreview };