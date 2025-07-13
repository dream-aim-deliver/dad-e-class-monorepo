import { useEffect, useRef, useState } from "react";
import { Button } from "./button"
import { IconPaste } from "./icons/icon-paste";
import { IconExternalLink } from "./icons/icon-external-link";
import { InputField } from "./input-field"
import { IconButton } from "./icon-button";
import { IconCloudDownload } from "./icons/icon-cloud-download";
import { IconLink } from "./icons/icon-link"
import { IconTrashAlt } from "./icons/icon-trash-alt";
import { IconEdit } from "./icons/icon-edit";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { fileMetadata } from "@maany_shr/e-class-models";
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
    if (!url) return "";
    
    try {
        // Ensure URL has a protocol
        let processedUrl = url;
        if (!/^https?:\/\//i.test(url)) {
            processedUrl = `https://${url}`;
        }
        
        // Parse the URL
        const urlObject = new URL(processedUrl);
        const hostname = urlObject.hostname;
        
        if (!hostname) return "";
        
        // Use Google's favicon service with cache buster to prevent stale icons
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64&v=${Date.now()}`;
    } catch (error) {
        console.warn(`Failed to generate favicon URL for: ${url}`, error);
        return "";
    }
};

interface LinkEditProps extends isLocalAware {
    initialTitle?: string;
    initialUrl?: string;
    initialCustomIcon?: fileMetadata.TFileMetadata;
    onImageChange: (image: fileMetadata.TFileMetadata) => void;
    onSave: (title: string, url: string, customIcon?: fileMetadata.TFileMetadata) => void;
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
 *     onSave={() => console.log("Saved")}
 *     onDiscard={() => console.log("Discarded")}
 * />
 * @returns 
 */
const LinkEdit: React.FC<LinkEditProps> = ({
    initialTitle = "",
    initialUrl = "",
    initialCustomIcon,
    onSave,
    onDiscard,
    onImageChange,
    locale,
}) => {
    const [title, setTitle] = useState<string>(initialTitle);
    const [url, setUrl] = useState<string>(initialUrl);
    const [favicon, setFavicon] = useState<string>("");
    const [errors, setErrors] = useState<{ title?: string; url?: string }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [customIcon, setCustomIcon] = useState<fileMetadata.TFileMetadata | null>(initialCustomIcon);
    const dictionary = getDictionary(locale);

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
            onSave(title, url, customIcon);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = e.target.files?.[0];
        if (newFile) {
            const metadata: fileMetadata.TFileMetadata = {
                id: new Date().toISOString(),
                name: newFile.name,
                mimeType: newFile.type,
                size: newFile.size,
                category: 'image',
                status: 'available',
                url: URL.createObjectURL(newFile),
                thumbnailUrl: URL.createObjectURL(newFile),
                checksum: "",
            };
            setCustomIcon(metadata);
            onImageChange(metadata);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };


    useEffect(() => {
        if (url) {
            setFavicon(getFaviconUrl(url));
        } else {
            setFavicon("");
        }
    }, [url]);

    const getIconUrl = () => {
        if (customIcon) {
            if (customIcon.category === 'image') {
                return customIcon.thumbnailUrl;
            }
            return customIcon.url;
        }
        return favicon;
    };
  console.log(customIcon)
    return (
        <div className="p-4 flex flex-col border-1 rounded-md border-card-stroke w-full bg-card-fill gap-4 text-text-primary">
            <div className="flex gap-2">

                <div className="flex-1 flex flex-col gap-2 w-full">
                    <div>
                        <h6 className="text-sm md:text-md text-text-primary ">{dictionary.components.link.titleLabel}</h6>
                        <InputField
                            value={title}
                            setValue={setTitle}
                            state={errors.title ? 'error' : 'filled'}
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>
                    <div>
                        <h6 className="text-sm md:text-md text-text-primary ">{dictionary.components.link.urlLabel}</h6>
                        <InputField
                            value={url}
                            setValue={setUrl}
                            type='text'
                            state={errors.url ? 'error' : 'filled'}
                        />
                        {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h6 className="text-sm md:text-md text-text-primary">{dictionary.components.link.LinkIcon}</h6>
                <>
                {(customIcon || (favicon && /^https?:\/\//.test(url))) ? (
                        <div className="inline-flex items-center gap-2 mt-1">
                            <img
                                src={customIcon?.url || favicon}
                                alt={customIcon?.url ? "Custom icon" : "Site favicon"}
                                className="w-12 h-12 object-cover rounded"
                            />
                        </div>
                    ):
                    <IconButton
                        icon={<IconLink />}
                        size="medium"
                        className="bg-base-neutral-700 rounded-md text-text-primary"
                    />
                    }</>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleButtonClick}
                        text={dictionary.components.link.customIcon}
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
                <Button onClick={handleSave} variant="secondary" className="w-full capitalize" text={dictionary.components.link.saveText} />
                <Button onClick={onDiscard} variant="primary" className="w-full capitalize" text={dictionary.components.link.discardText} />
            </div>
        </div>
    )
}

interface LinkPreviewProps {
    title: string;
    url: string;
    customIcon?: fileMetadata.TFileMetadata;
    onEdit?: () => void;
    onDelete?: () => void;
    preview?: boolean;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ title, url, customIcon, onDelete, onEdit,preview=false }) => {
    const [favicon, setFavicon] = useState<string>("");

    useEffect(() => {
        if (url) {
            setFavicon(getFaviconUrl(url));
        } else {
            setFavicon("");
        }
    }, [url]);

    const renderIcon = () => {
        // Handle custom icon case
        if (customIcon?.url) {
            const iconUrl = customIcon.category === 'image' && customIcon.thumbnailUrl 
                ? customIcon.thumbnailUrl 
                : customIcon.url;
            return <img 
                src={iconUrl} 
                alt={title} 
                className="w-12 h-12 object-cover rounded" 
                onError={(e) => {
                    // Fallback to default icon if image fails to load
                    e.currentTarget.style.display = 'none';
                }}
            />;
        }
        
        // Handle favicon case
        if (favicon) {
            return <img 
                src={favicon} 
                alt={title} 
                className="w-12 h-12 object-cover rounded"
                onError={(e) => {
                    // Fallback to default icon if favicon fails to load
                    e.currentTarget.style.display = 'none';
                }}
            />;
        }
        
        // Default icon
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
                        <a target="_blank" rel="noopener noreferrer" href={url} className="md:text-xl flex gap-1 items-center truncate underline hover:text-button-primary-fill">
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