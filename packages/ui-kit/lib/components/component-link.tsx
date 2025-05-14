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
        const protocol = urlObject.protocol;

        // Try multiple common favicon locations in order of preference
        // 1. Google's favicon service (reliable for many sites)
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
    } catch (error) {
        // Return a default favicon or placeholder instead of empty string
        console.warn(`Failed to generate favicon URL for: ${url}`, error);
        return "default-favicon.ico"; // Path to your default favicon
    }
};

interface LinkEditProps {
    initialTitle?: string;
    initialUrl?: string;
    initialFile?: File | null;
    onChange: (title: string, url: string, customIcon?: File) => void;
    onSave: () => void;
    onDiscard: () => void;
}
/**
 * 
 * @param param0 
 * @description LinkEdit component allows users to edit a link's title, URL, and custom icon. It validates the input fields and provides save and discard functionality.
 * @example
 * ```tsx
 * <LinkEdit
 *     initialTitle="My Link"
 *     initialUrl="https://example.com"
 *     initialFile={null}
 *     onChange={(title, url, customIcon) => console.log(title, url, customIcon)}
 *     onSave={() => console.log("Saved")}
 *     onDiscard={() => console.log("Discarded")}
 * />
 * @returns 
 */

const LinkEdit: React.FC<LinkEditProps> = ({
    initialTitle = "",
    initialUrl = "",
    initialFile = null,
    onChange,
    onSave,
    onDiscard
}) => {
    const [title, setTitle] = useState<string>(initialTitle);
    const [url, setUrl] = useState<string>(initialUrl);
    const [favicon, setFavicon] = useState<string>("");
    const [file, setFile] = useState<UploadedFileType | null>(initialFile ? { file: initialFile, isUploading: false } : null);
    const [errors, setErrors] = useState<{ title?: string; url?: string }>({});
    const fileInputRef = useRef(null);
    const [customIconUrl, setCustomIconUrl] = useState<string>("");

    const validateFields = () => {
        const newErrors: { title?: string; url?: string } = {};
        if (!title.trim()) {
            newErrors.title = "Title is required";
        }
        if (!url.trim()) {
            newErrors.url = "URL is required";
        }
        setErrors(newErrors);
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
            // Create an UploadedFileType object
            const uploadedFile: UploadedFileType = {
                file: newFile,
                isUploading: true
            };
            setFile(uploadedFile);

            // Create and set the preview URL
            const previewUrl = URL.createObjectURL(newFile);
            setCustomIconUrl(previewUrl);

            // Simulate upload process
            try {
                const response: ImageUploadResponse = await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            imageId: `image-${Math.random().toString(36).substr(2, 9)}`,
                            imageThumbnailUrl: previewUrl,
                            fileSize: newFile.size
                        });
                    }, 2000);
                });

                // Update file state with response
                setFile({
                    ...uploadedFile,
                    isUploading: false,
                    responseData: response
                });

                // Call onChange with the new data
                onChange(title, url, newFile);
            } catch (error) {
                setFile({
                    ...uploadedFile,
                    isUploading: false,
                    error: 'Upload failed'
                });
                // Clean up the preview URL on error
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
        }

        // Cleanup function to revoke object URLs when component unmounts
        return () => {
            if (customIconUrl) {
                URL.revokeObjectURL(customIconUrl);
            }
        };
    }, [title, url, customIconUrl]);

    return (
        <div className="p-4 flex flex-col border-1 rounded-md border-card-stroke w-full bg-card-fill gap-4 text-text-primary">
            <main className="flex flex-col gap-2">
                <h6>Title</h6>
                <InputField
                    value={title}
                    setValue={setTitle}
                    inputText="my new video assignment"
                />
            </main>
            <div className="flex flex-col gap-2">
                <h6>Url</h6>
                <InputField
                    value={url}
                    setValue={setUrl}
                    type="url"
                    hasRightContent
                    rightContent={<IconPaste />}
                    inputText="my new video assignment"
                />

                <div className="flex flex-col gap-2">
                    <h6>Icon Link</h6>
                    {(customIconUrl || (favicon && url)) && (
                        <div className="inline-flex items-center gap-2 mt-1">
                            <img
                                src={customIconUrl || favicon}
                                alt={customIconUrl ? "Custom icon" : "Site favicon"}
                                className="w-12 h-12 object-cover rounded"
                            />
                        </div>
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
                <Button onClick={handleSave} variant="secondary" className="w-full capitalize" text="Save" />
                <Button onClick={onDiscard} variant="primary" className="w-full capitalize" text="discard" />
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
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ title, url, customIcon, onDelete, onEdit,preview=false }) => {
    const [favicon, setFavicon] = useState<string>("");
    const [customIconUrl, setCustomIconUrl] = useState<string>("");

    useEffect(() => {
        if (url) {
            setFavicon(getFaviconUrl(url));
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
        }
    }, [title, url, customIcon]);

    const renderIcon = () => {
        if (customIconUrl) {
            return <img src={customIconUrl} alt={title} className="w-12 h-12 object-cover rounded" />;
        }
        if (favicon) {
            return <img src={favicon} alt={title} className="w-12 h-12 object-cover rounded" />;
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
        <div className="flex gap-2 h-auto text-text-primary w-full items-center justify-between ">
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
