import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LinkEdit } from "../lib/components/links";
import { fileMetadata } from "@maany_shr/e-class-models";


const meta: Meta<typeof LinkEdit> = {
  title: "Components/LinkEdit",
  component: LinkEdit,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    initialTitle: { control: "text" },
    initialUrl: { control: "text" },
    locale: { control: "select", options: ["en", "de"] },
  },
};

export default meta;
type Story = StoryObj<typeof LinkEdit>;

// Mock file metadata for custom icon
const mockFile = {
  id: "1",
  name: "custom-icon.png",
  mimeType: "image/png",
  size: 1024,
  checksum: "abc123",
  status: 'available' as const,
  category: 'image' as const,
  url: "https://via.placeholder.com/48",
  thumbnailUrl: "https://via.placeholder.com/48"
};

// Wrapper component to manage state
type LinkEditProps = Omit<React.ComponentProps<typeof LinkEdit>, 'onSave' | 'onDiscard' | 'onImageChange'>;

const LinkEditWithState = (props: LinkEditProps) => {
  const [title, setTitle] = useState(props.initialTitle || '');
  const [url, setUrl] = useState(props.initialUrl || '');
  const [customIcon, setCustomIcon] = useState<fileMetadata.TFileMetadata | undefined>(
    props.initialCustomIcon
  );
  const [isEditing, setIsEditing] = useState(true);

  const handleSave = (newTitle: string, newUrl: string, newCustomIcon?: fileMetadata.TFileMetadata) => {
    console.log('onSave', { title: newTitle, url: newUrl, customIcon: newCustomIcon });
    setTitle(newTitle);
    setUrl(newUrl);
    setCustomIcon(newCustomIcon);
    setIsEditing(false);
  };

  const handleDiscard = () => {
    console.log('onDiscard');
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleImageChange = (file: fileMetadata.TFileMetadata) => {
    setCustomIcon(file);
  };

  return isEditing ? (
    <LinkEdit
      {...props}
      initialTitle={title}
      initialUrl={url}
      initialCustomIcon={customIcon}
      onSave={handleSave}
      onDiscard={handleDiscard}
      onImageChange={handleImageChange}
    />
  ) : (
    <div className="p-4 border rounded">
      <h3 className="font-bold">Preview Mode</h3>
      <p>Title: {title}</p>
      <p>URL: {url}</p>
      {customIcon && (
        <div className="mt-2">
          <p>Custom Icon:</p>
          <img 
            src={customIcon.url} 
            alt={customIcon.name} 
            className="w-12 h-12 object-cover mt-1"
          />
        </div>
      )}
      <button 
        onClick={handleEdit}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Edit
      </button>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <LinkEditWithState {...args} />,
  args: {
    initialTitle: "Example Link",
    initialUrl: "https://example.com",
    locale: "en",
  },
};

export const WithCustomIcon: Story = {
  render: (args) => <LinkEditWithState {...args} />,
  args: {
    ...Default.args,
    initialCustomIcon: mockFile,
  },
};

export const EmptyState: Story = {
  render: (args) => <LinkEditWithState {...args} />,
  args: {
    initialTitle: "",
    initialUrl: "",
    locale: "en",
  },
};

export const GermanLocale: Story = {
  render: (args) => <LinkEditWithState {...args} />,
  args: {
    ...Default.args,
    locale: "de",
  },
};
