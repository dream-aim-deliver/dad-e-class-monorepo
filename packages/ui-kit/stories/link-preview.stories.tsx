import type { Meta, StoryObj } from "@storybook/react-vite";
import { LinkPreview } from "../lib/components/links";

const meta: Meta<typeof LinkPreview> = {
    title: "Components/LinkPreview",
    component: LinkPreview,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        title: { control: "text" },
        url: { control: "text" },
        customIcon: { control: false },
        preview: { control: "boolean" },
    },
};

export default meta;
type Story = StoryObj<typeof LinkPreview>;

const mockFile = {
    id: "1",
    name: "custom-icon.png",
    mimeType: "image/png",
    size: 1024,
    checksum: "abc123",
    status: 'available' as const,
    category: 'image' as const,
    url: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
    thumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg"
};

export const Default: Story = {
    args: {
        title: "Example Link",
        url: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
        preview: false,
    },
};

export const WithCustomIcon: Story = {
    args: {
        title: "Link with Custom Icon",
        url: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
        customIcon: mockFile,
        preview: false,
    },
};

export const PreviewMode: Story = {
    args: {
        title: "Preview Mode Link",
        url: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
        customIcon: mockFile,
        preview: true,
        onEdit: () => { alert('Edit clicked!'); },
        onDelete: () => { alert('Delete clicked!'); },
    },
};

export const BrokenFavicon: Story = {
    args: {
        title: "Broken Favicon Link",
        url: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
        preview: false,
    },
};

export const ProcessingIcon: Story = {
    args: {
        title: "Processing Upload",
        url: "https://example.com",
        customIcon: {
            id: "processing-1",
            name: "uploading-image.png",
            mimeType: "image/png",
            size: 2048,
            checksum: "processing123",
            status: 'processing' as const,
            category: 'image' as const,
            url: "https://via.placeholder.com/48",
            thumbnailUrl: "https://via.placeholder.com/48",
        },
        preview: false,
    },
};