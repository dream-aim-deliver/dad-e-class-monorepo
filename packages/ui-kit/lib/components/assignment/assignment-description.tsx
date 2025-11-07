import { isLocalAware } from "@maany_shr/e-class-translations";
import { LinkPreview } from "../links";
import { FilePreview } from "../drag-and-drop-uploader/file-preview";

/**
 * Props for the AssignmentDescription component.
 */
export interface AssignmentDescriptionProps extends isLocalAware {
    description: string;
    links: {
        title: string;
        url: string;
        iconFile?: {
            name: string;
            id: string;
            size: number;
            category: "image";
            downloadUrl: string;
        } | null | undefined;
    }[];
    files: {
        name: string;
        thumbnailUrl: string | null;
        id: string;
        size: number;
        category: "video" | "image" | "generic" | "document";
        downloadUrl: string;
    }[];
    onFileDownload: (url: string, name: string) => void;
};

/**
 * Renders the description content of an assignment with attached files and resource links.
 * 
 * This component displays the core content of an assignment in a structured format:
 *   - Text description with appropriate typography and spacing
 *   - List of attached files with read-only preview cards
 *   - List of resource links with custom icon support
 * 
 * Features:
 *   - Read-only file previews (no deletion or upload functionality)
 *   - File download capability via callback
 *   - Link previews with optional custom icons
 *   - Consistent spacing and layout for all content types
 *   - Responsive design that works across different screen sizes
 * 
 * This is a presentational component typically used within assignment overview cards
 * when displaying the original assignment content (before any student replies).
 * All files are displayed as "generic" category with "available" status for consistency.
 * 
 * This component has no internal state and relies on callbacks for interactions.
 * 
 * @param description The text description/instructions for the assignment
 * @param files Array of file attachments with metadata (name, size, category, download URL, thumbnail)
 * @param links Array of resource links with optional custom icons
 * @param onFileDownload Callback to handle file downloads, receives the file's download URL
 * @param locale Locale string for i18n/localization (passed to child components)
 * 
 * @example
 * <AssignmentDescription
 *   description="Complete the following exercises and submit your solutions by Friday."
 *   files={[
 *     {
 *       id: "file-1",
 *       name: "worksheet.pdf",
 *       size: 2048576,
 *       category: "document",
 *       downloadUrl: "https://example.com/files/worksheet.pdf",
 *       thumbnailUrl: null
 *     },
 *     {
 *       id: "file-2",
 *       name: "reference.mp4",
 *       size: 10485760,
 *       category: "video",
 *       downloadUrl: "https://example.com/files/reference.mp4",
 *       thumbnailUrl: "https://example.com/thumbs/reference.jpg"
 *     }
 *   ]}
 *   links={[
 *     {
 *       title: "Khan Academy - Algebra Basics",
 *       url: "https://www.khanacademy.org/math/algebra",
 *       iconFile: null
 *     },
 *     {
 *       title: "Course Textbook",
 *       url: "https://example.com/textbook",
 *       iconFile: {
 *         id: "icon-1",
 *         name: "book-icon.png",
 *         size: 8192,
 *         category: "image",
 *         downloadUrl: "https://example.com/icons/book.png"
 *       }
 *     }
 *   ]}
 *   onFileDownload={(url) => window.open(url, '_blank')}
 *   locale="en"
 * />
 */

export const AssignmentDescription: React.FC<AssignmentDescriptionProps> = (props) => {
    return (
        <div className="flex flex-col gap-4 items-start w-full">
            <p className="text-md text-text-primary leading-[150%]">
                {props.description}
            </p>
            <div className="flex flex-col gap-2 w-full">
                {props.files.map((file, index) => (
                    <FilePreview
                        key={index}
                        uploadResponse={{
                            ...file,
                            category: 'generic' as const,
                            status: 'available' as const,
                            url: file.downloadUrl,
                        }}
                        deletion={{
                            isAllowed: false,
                        }}
                        onDownload={() => props.onFileDownload(file.downloadUrl, file.name)}
                        locale={props.locale}
                        readOnly={true}
                    />
                ))}
                {props.links.map((link, index) => (
                    <div className="flex flex-col w-full" key={`link-${index}`}>
                        <LinkPreview
                            key={link.iconFile?.id}
                            title={link.title as string}
                            url={link.url as string}
                            customIcon={link.iconFile
                                ? {
                                    ...link.iconFile,
                                    status: 'available' as const,
                                    url: link.iconFile.downloadUrl,
                                    thumbnailUrl: link.iconFile.downloadUrl,
                                }
                                : undefined
                            }
                            preview={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};