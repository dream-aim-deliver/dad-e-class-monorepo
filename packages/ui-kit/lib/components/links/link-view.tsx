import { FC } from "react";
import { LinksView } from "../course-builder-lesson-component/types";
import { LinkPreview } from "../links";

/**
 * Renders a read-only display of resource links for student-facing course content.
 * Provides a clean, formatted view of course links without editing capabilities.
 * Used in the student view of course lessons to display instructor-provided resource links.
 *
 * This is a presentational component that displays links in a consistent format with:
 * - Link titles and URLs
 * - Custom icons (if provided)
 * - Clickable external links that open in new tabs
 * - Responsive card layout with consistent spacing
 *
 * @param links Array of link objects containing title, url, and optional customIconMetadata for display.
 *
 * @example
 * <LinkView
 *   links={[
 *     { title: 'Course Documentation', url: 'https://docs.example.com', customIconMetadata: undefined },
 *     { title: 'Additional Resources', url: 'https://resources.example.com', customIconMetadata: iconFile }
 *   ]}
 * />
 */

export const LinkView: FC<LinksView> = ({
    links
}) => {
    return (
        <div
            className="flex flex-col gap-4 w-full items-start justify-center p-4 bg-card-fill border border-card-stroke rounded-medium"
        >
            {links.map((link, index) => (
                <LinkPreview
                    key={index}
                    preview={false}
                    title={link.title}
                    url={link.url}
                    customIcon={link.customIconMetadata}
                />
            ))}
        </div>
    );
};