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
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { cn } from "../utils/style-utils";
import { fileMetadata } from "@maany_shr/e-class-models";
import Banner from "./banner";
import { TLink } from "packages/models/src/shared";
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

        // Use Google's favicon service with a larger size parameter for better quality
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch (error) {
        // Return a default favicon or placeholder instead of empty string
        console.warn(`Failed to generate favicon URL for: ${url}`, error);
    }
};

interface LinkEditProps extends isLocalAware {
    title: string;
    url: string;
    customIconMetadata?: fileMetadata.TFileMetadata | null;
    onChange: (data: { title: string; url: string; file?: File }) => void;
    onSave: () => void;
    onDiscard: () => void;
}
/**
 * LinkEdit component allows users to edit a link's title, URL, and custom icon. 
 * It validates the input fields and provides save and discard functionality.
 * 
 * @param title - Current title value
 * @param url - Current URL value  
 * @param customIconMetadata - File metadata for custom icon (contains status: 'available' | 'processing' | 'unavailable')
 * @param onChange - Callback when title, url, or file changes. Receives { title, url, file? }
 * @param onSave - Callback when save button is clicked
 * @param onDiscard - Callback when discard button is clicked
 * @param locale - Locale for translations
 * 
 * @example
 * ```tsx
 * const [linkData, setLinkData] = useState({
 *   title: "My Link",
 *   url: "https://example.com"
 * });
 * const [customIconMetadata, setCustomIconMetadata] = useState(null);
 * 
 * <LinkEdit
 *     title={linkData.title}
 *     url={linkData.url}
 *     customIconMetadata={customIconMetadata}
 *     onChange={(data) => {
 *       setLinkData(prev => ({ ...prev, ...data }));
 *       // Handle file upload if file is provided
 *       if (data.file) {
 *         handleFileUpload(data.file);
 *       }
 *     }}
 *     onSave={() => console.log("Saved")}
 *     onDiscard={() => console.log("Discarded")}
 *     locale="en"
 * />
 * ```
 */

const LinkEdit: React.FC<LinkEditProps> = ({
    title,
    url,
    customIconMetadata = null,
    onChange,
    onSave,
    onDiscard,
    locale,
}) => {
    const [favicon, setFavicon] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [faviconError, setFaviconError] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<{ title?: string; url?: string }>({});
    const [showErrors, setShowErrors] = useState<boolean>(false);
    const dictionary = getDictionary(locale);

    const validateFields = () => {
        const newErrors: { title?: string; url?: string } = {};

        if (!title.trim()) {
            newErrors.title = dictionary.components.coachNotes.validateTitle;
        }
        if (!url.trim()) {
            newErrors.url = dictionary.components.coachNotes.validateLink;
        }

        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearFieldError = (fieldName: 'title' | 'url') => {
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    };

    const handleSave = () => {
        setShowErrors(true);
        if (validateFields()) {
            onSave();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            onChange({ title, url, file: selectedFile });
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        if (!customIconMetadata && url) {
            setFavicon(getFaviconUrl(url));
            setFaviconError(false); // Reset error state when URL changes
        }
    }, [title, url, customIconMetadata]);

    return (
        <div className="p-4 flex flex-col border-1 rounded-md border-card-stroke w-full bg-card-fill gap-4 text-text-primary">
            <main className="flex flex-col gap-2">
                <h6 className="capitalize">{dictionary.components.courseBuilder.titleText}</h6>
                <InputField
                    value={title}
                    setValue={(newTitle) => {
                        onChange({ title: newTitle, url });
                        clearFieldError('title'); // Clear only title error when user starts typing
                    }}
                    inputText="my new video assignment"
                />
                {showErrors && validationErrors.title && (
                    <Banner style="error" description={validationErrors.title} className="mt-1" />
                )}
            </main>
            <div className="flex flex-col gap-2">
                <h6 className="capitalize">{dictionary.components.courseBuilder.urlText}</h6>
                <InputField
                    value={url}
                    setValue={(newUrl) => {
                        onChange({ title, url: newUrl });
                        clearFieldError('url'); // Clear only URL error when user starts typing
                    }}
                    type="url"
                    hasRightContent
                    rightContent={<IconPaste />}
                    inputText="https://example.com"
                />
                {showErrors && validationErrors.url && (
                    <Banner style="error" description={validationErrors.url} className="mt-1" />
                )}

                <div className="flex flex-col gap-2">
                    <h6 className="capitalize">{dictionary.components.courseBuilder.iconLinkText}</h6>
                    {/* Show custom icon if available and status is available */}
                    {(customIconMetadata && customIconMetadata.status === 'available' && customIconMetadata.category === 'image') ? (
                        <div className="inline-flex items-center gap-2 mt-1">
                            <img
                                src={customIconMetadata.url}
                                alt="Custom icon"
                                className="w-12 h-12 object-cover rounded"
                            />
                        </div>
                    ) : /* Show loading state if processing */
                        (customIconMetadata && customIconMetadata.status === 'processing') ? (
                            <div className="inline-flex items-center gap-2 mt-1">
                                <div className="w-12 h-12 bg-gray-200 rounded animate-pulse flex items-center justify-center">
                                    <span className="text-xs">...</span>
                                </div>
                            </div>
                        ) : /* Show favicon if no custom icon and URL is valid */
                            (favicon && /^https?:\/\//.test(url) && !faviconError) ? (
                                <div className="inline-flex items-center gap-2 mt-1">
                                    <img
                                        src={favicon}
                                        alt="Site favicon"
                                        className="w-12 h-12 object-cover rounded"
                                        onError={() => setFaviconError(true)}
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
                        text={dictionary.components.coachNotes.customIcon}
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

interface LinkPreviewProps extends TLink {
    title: string;
    url: string;
    customIconUrl?: string;  // Direct URL for custom icon
    onEdit?: () => void;
    onDelete?: () => void;
    preview?: boolean;
    className?: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ title, url, customIconUrl, onDelete, onEdit, preview = false, className }) => {
    const [favicon, setFavicon] = useState<string>("");

    useEffect(() => {
        if (url) {
            setFavicon(getFaviconUrl(url));
        } else {
            setFavicon("");
        }
    }, [title, url]);

    const renderIcon = () => {
        if (customIconUrl) {
            return (
                <img
                    src={customIconUrl}
                    alt={title}
                    className="w-12 h-12 object-cover rounded"
                />
            );
        }
        if (favicon) {
            return (
                <img
                    src={favicon}
                    alt={title}
                    className="w-12 h-12 object-cover rounded"
                />
            );
        }
        return (
            <IconButton
                icon={<IconLink />}
                size="medium"
                className="bg-base-neutral-700 rounded-md text-text-primary hove:bg-transparent"
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
                        <a target="blank" href={url} className="md:text-xl flex gap-1 items-center truncate underline ">
                            <span className="truncate hover:text-button-primary-fill">{title}</span>
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
