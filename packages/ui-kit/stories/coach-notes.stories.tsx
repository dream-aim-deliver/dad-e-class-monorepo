import React, { useState } from 'react';

import { CoachNotesCreate, CoachNotesView } from '../lib/components/coach/coach-notes';
import type { Descendant } from 'slate';
import { fileMetadata } from '@maany_shr/e-class-models';

// Simple Slate Descendant[] mock for demonstration
const sampleDescription: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is a sample note description with ' },
      { text: 'bold', bold: true },
      { text: ' and ' },
      { text: 'italic', italic: true },
      { text: '.' },
    ],
  },
];

const sampleLinks = [
  {
    title: 'Storybook',
    url: 'https://storybook.js.org',
    customIconMetadata: undefined,
  },
  {
    title: 'E-Class',
    url: 'https://e-class.example.com',
    customIconMetadata: undefined,
  },
];

const emptyDescription: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      { text: '' },
    ],
  },
];

// Mock file metadata for custom icon
const mockFile = {
  id: '1',
  name: 'custom-icon.png',
  mimeType: 'image/png',
  size: 1024,
  checksum: 'abc123',
  status: 'available' as const,
  category: 'image' as const,
  url: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  thumbnailUrl:
    'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
};

// Wrapper component to manage link state for Storybook
const CoachNotesWrapper = ({
  initialNoteLinks = [],
  initialDescription = JSON.stringify(emptyDescription),
  initialIncludeInMaterials = false
}) => {
  const [noteLinks, setNoteLinks] = useState(initialNoteLinks);
  const [includeInMaterials, setIncludeInMaterials] = useState(initialIncludeInMaterials);
  const [noteDescription, setNoteDescription] = useState(initialDescription);

  const handleImageChange = async (index: number, fileRequest: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal): Promise<fileMetadata.TFileMetadata> => {
    console.log('Starting upload for link at index:', index, 'file:', fileRequest.name);

    // // Create temporary metadata for UI state
    const processingFile: fileMetadata.TFileMetadata = {
      id: fileRequest.id,
      name: fileRequest.name,
      mimeType: fileRequest.file.type,
      size: fileRequest.file.size,
      category: 'image',
      status: 'processing',
      url: URL.createObjectURL(fileRequest.file),
      thumbnailUrl: URL.createObjectURL(fileRequest.file),
      checksum: '',
    };

    // // Use functional update to ensure we get the latest state
    // setNoteLinks(currentLinks => {
    //   const updatedLinks = [...currentLinks];
    //   // Handle new link case - extend array if index equals length
    //   if (index >= currentLinks.length) {
    //     updatedLinks.push({ title: '', url: '', customIconMetadata: processingFile });
    //   } else {
    //     updatedLinks[index] = {
    //       ...updatedLinks[index],
    //       customIconMetadata: processingFile,
    //     };
    //   }
    //   return updatedLinks;
    // });

    try {
      // Simulate upload with setTimeout that can be aborted
      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          console.log('Upload completed successfully for link at index:', index);
          resolve();
        }, 3000); // 3 second delay to see the spinner

        // Handle abort signal
        if (abortSignal) {
          abortSignal.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            console.log('Upload cancelled by user for link at index:', index);
            reject(new DOMException('Upload cancelled', 'AbortError'));
          });
        }
      });

      // Update to completed state using functional update
      const completedFile: fileMetadata.TFileMetadata = {
        ...processingFile,
        status: 'available' as const,
        checksum: 'uploaded-checksum',
      };
      setNoteLinks(currentLinks => {
        const finalLinks = [...currentLinks];

        if (index >= currentLinks.length) {
          finalLinks.push({ title: '', url: '', customIconMetadata: completedFile });
        } else {
          finalLinks[index] = {
            ...finalLinks[index],
            customIconMetadata: completedFile,
          };
        }
        return finalLinks;
      });
      console.log('File upload completed for link at index:', index, completedFile);
      return completedFile;

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Upload was cancelled for link at index:', index);
        // Remove the file on cancellation using functional update
        setNoteLinks(currentLinks => {
          const cancelledLinks = [...currentLinks];
          if (index < cancelledLinks.length) {
            cancelledLinks[index] = {
              ...cancelledLinks[index],
              customIconMetadata: undefined,
            };
          }
          return cancelledLinks;
        });
        throw error; // Re-throw abort error
      } else {
        console.error('Upload failed for link at index:', index, error);
        // Handle other errors - could set status to 'unavailable'
        const failedFile: fileMetadata.TFileMetadata = {
          ...processingFile,
          status: 'unavailable' as const,
        };
        return failedFile;
      }
    }
  };

  const handleDeleteIcon = (index: number) => {
    console.log('onDeleteIcon for link at index:', index);
    setNoteLinks(currentLinks => {
      if (index < currentLinks.length) {
        const updatedLinks = [...currentLinks];
        updatedLinks[index] = {
          ...updatedLinks[index],
          customIconMetadata: undefined,
        };
        return updatedLinks;
      }
      return currentLinks;
    });
  };

  return (
    <CoachNotesCreate
      noteDescription={noteDescription}
      noteLinks={noteLinks}
      includeInMaterials={includeInMaterials}
      locale="en"
      onPublish={(description, links, includeInMaterials) => {
        console.log('onPublish:', { description, links, includeInMaterials });
        alert('Notes published! Check console for details.');
      }}
      onImageChange={handleImageChange}
      onDeleteIcon={handleDeleteIcon}
      onNoteLinksChange={setNoteLinks}
      onIncludeInMaterialsChange={setIncludeInMaterials}
      onNoteDescriptionChange={setNoteDescription}
      isEditMode={false}
      onBack={() => console.log('onBack clicked')}
    />
  );
};

export default {
  title: 'Coach/CoachNotes',
  component: CoachNotesCreate,
  subcomponents: { CoachNotesView },
};

export const DefaultEditable = () => (
  <CoachNotesWrapper
    initialNoteLinks={sampleLinks}
    initialIncludeInMaterials={true}
  />
);

export const ViewOnly = () => (
  <CoachNotesView
    noteDescription={JSON.stringify(sampleDescription)}
    noteLinks={sampleLinks}
    includeInMaterials={true}
    locale="en"
    onExploreCourses={() => alert('onExploreCourses')}
  />
);

export const EmptyState = () => (
  <CoachNotesView
    noteDescription={JSON.stringify(emptyDescription)}
    noteLinks={[]}
    includeInMaterials={false}
    locale="en"
    onExploreCourses={() => alert('onExploreCourses')}
  />
);

export const EditableEmptyLinks = () => (
  <CoachNotesWrapper
    initialNoteLinks={[]}
    initialIncludeInMaterials={false}
  />
);

export const UploadTest = () => (
  <CoachNotesWrapper
    initialNoteLinks={[
      {
        title: 'Test Upload Link',
        url: 'https://example.com',
        customIconMetadata: undefined,
      },
    ]}
    initialIncludeInMaterials={true}
  />
);

export const ProcessingStateLink = () => (
  <CoachNotesWrapper
    initialNoteLinks={[
      {
        title: 'Processing Upload',
        url: 'https://example.com',
        customIconMetadata: {
          id: 'processing-coach-1',
          name: 'uploading-icon.png',
          mimeType: 'image/png',
          size: 2048,
          checksum: 'processing456',
          status: 'processing',
          category: 'image',
          url: 'https://via.placeholder.com/48',
          thumbnailUrl: 'https://via.placeholder.com/48',
        },
      },
    ]}
    initialIncludeInMaterials={true}
  />
);

export const WithCustomIcon = () => (
  <CoachNotesWrapper
    initialNoteLinks={[
      {
        title: 'Link with Custom Icon',
        url: 'https://example.com',
        customIconMetadata: mockFile,
      },
    ]}
    initialIncludeInMaterials={true}
  />
);