import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { DesignerComponent, FormComponent } from "../lib/components/course-builder-lesson-component/upload-files";
import { CourseElementType } from "../lib/components/course-builder/types";
import { UploadResponse, UploadedFileType } from "../lib/components/drag-and-drop/uploader";

// Mock elementInstance for DesignerComponent
const designerElementInstance = {
  id: "designer-1",
  type: CourseElementType.uploadFile,
  description: "Designer component description.",
  studentComment: "Designer initial comment.",
  studentUploadedFiles: [],
  order: 1,
};

// Mock elementInstance for FormComponent
const formElementInstance = {
  id: "form-1",
  type: CourseElementType.uploadFile,
  description: "Please upload your assignment files.",
  studentComment: "Initial comment.",
  studentUploadedFiles: [],
  order: 1,
};

const locale = "en";

const meta: Meta = {
  title: "Components/Course Builder/UploadFiles",
  component: DesignerComponent,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

const DesignerStory: React.FC = () => {
  const handleChange = async (description: string): Promise<UploadResponse> => {
    console.log('Description changed:', description);
    return {} as UploadResponse;
  };

  return (
    <DesignerComponent
      elementInstance={designerElementInstance}
      locale={locale}
      onUpClick={() => alert("onUpClick")}
      onDownClick={() => alert("onDownClick")}
      onDeleteClick={() => alert("onDeleteClick")}
      onChange={handleChange}
    />
  );
};

const FormStory: React.FC = () => {
  const [files, setFiles] = useState<UploadedFileType[]>([]);
  const [value, setValue] = useState<string>(formElementInstance.studentComment);
const handleChange = (newValue: string) => {
    setValue(newValue);
    console.log('Student comment changed:', newValue);
  };
  const handleFilesChange = (newFiles: UploadedFileType[]): Promise<UploadResponse> => {
    const uploadingFiles = newFiles.filter((f) => f.isUploading);
    setFiles(newFiles);

    return new Promise((resolve, reject) => {
      if (uploadingFiles.length > 0) {
        setTimeout(() => {
          try {
            const processedFiles = newFiles.map((file) => {
              if (file.isUploading) {
                const fileType = file.file.type.split('/')[0];
                let responseData: UploadResponse;

                // Check file size (max 10MB)
                if (file.file.size > 10 * 1024 * 1024) {
                  throw new Error(`File ${file.file.name} exceeds maximum size of 10MB`);
                }

                switch (fileType) {
                  case 'image':
                    responseData = {
                      imageId: `image-${Math.random().toString(36).substr(2, 9)}`,
                      imageThumbnailUrl: URL.createObjectURL(file.file),
                      fileSize: file.file.size,
                    };
                    break;
                  case 'video':
                    responseData = {
                      videoId: `video-${Math.random().toString(36).substr(2, 9)}`,
                      thumbnailUrl: 'https://via.placeholder.com/150',
                      fileSize: file.file.size,
                    };
                    break;
                  case 'application':
                  case 'text':
                    responseData = {
                      fileId: `file-${Math.random().toString(36).substr(2, 9)}`,
                      fileName: file.file.name,
                      fileSize: file.file.size,
                    };
                    break;
                  default:
                    throw new Error(`Unsupported file type: ${fileType}`);
                }

                return {
                  ...file,
                  isUploading: false,
                  responseData,
                };
              }
              return file;
            });

            setFiles(processedFiles);
            resolve(processedFiles[0].responseData);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setFiles(newFiles.map(file => ({
              ...file,
              isUploading: false,
              error: errorMessage
            })));
            reject(error);
          }
        }, 2000);
      } else {
        resolve({
          fileId: 'no-upload',
          fileName: 'No file uploaded',
          fileSize: 0
        });
      }
    });
  };

  const handleFileDelete = (fileId: number) => {
    console.log('Delete file:', fileId);
    setFiles(files.filter((_, index) => index !== fileId));
  };

  const handleFileDownload = (fileId: number) => {
    console.log('Download file:', fileId);
    // In a real app, this would trigger the file download
  };

  return (
    <FormComponent
      elementInstance={formElementInstance}
      locale={locale}
      onStudentCommentChange={handleChange}
      onFileDelete={handleFileDelete}
      onFileDownload={handleFileDownload}
      files={files}
      onFilesChange={handleFilesChange}
    />
  );
};

export const Designer: Story = {
  render: () => <DesignerStory />
};

export const Form: Story = {
  render: () => <FormStory />
};