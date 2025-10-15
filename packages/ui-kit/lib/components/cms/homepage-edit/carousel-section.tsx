import { useState } from 'react';
import { TextAreaInput } from '../../text-areaInput';
import { TextInput } from '../../text-input';
import { Uploader } from '../../drag-and-drop-uploader/uploader';
import { Button } from '../../button';
import { fileMetadata } from '@maany_shr/e-class-models';
import { z } from 'zod';
import { HomePageSchema } from 'packages/models/src/view-models';

type CarouselType = z.infer<typeof HomePageSchema>['carousel'];
type CarouselItemType = CarouselType[0];

interface CarouselSectionProps {
    initialValue?: CarouselType;
    onChange: (value: CarouselType) => void;
    onFileUpload: (
        fileRequest: fileMetadata.TFileUploadRequest,
        uploadType: "upload_home_page_carousel_item_image",
        abortSignal?: AbortSignal
    ) => Promise<fileMetadata.TFileMetadata>;
    onFileDelete: (id: string) => void;
    onFileDownload: (id: string) => void;
    uploadProgress?: number;
}

export default function CarouselSection({
    initialValue = [],
    onChange,
    onFileUpload,
    onFileDelete,
    onFileDownload,
    uploadProgress,
}: CarouselSectionProps) {
    const [carouselData, setCarouselData] = useState<CarouselType>(initialValue);
    const [uploadedFiles, setUploadedFiles] = useState<Map<number, fileMetadata.TFileMetadata>>(new Map());
    const handleCarouselChange = (newCarouselData: CarouselType) => {
        setCarouselData(newCarouselData);
        onChange?.(newCarouselData);
    };

    const handleItemFieldChange = (index: number, field: keyof CarouselItemType, value: string | null) => {
        const newCarouselData = [...carouselData];
        newCarouselData[index] = {
            ...newCarouselData[index],
            [field]: value
        };
        handleCarouselChange(newCarouselData);
    };

    const addCarouselItem = () => {
        const newItem: CarouselItemType = {
            title: '',
            description: '',
            imageUrl: null,
            buttonText: '',
            buttonUrl: '',
            badge: ''
        };
        handleCarouselChange([...carouselData, newItem]);
    };

    const removeCarouselItem = (index: number) => {
        const newCarouselData = carouselData.filter((_, i) => i !== index);

        // Clean up uploaded file for this item
        const fileForItem = uploadedFiles.get(index);
        if (fileForItem) {
            onFileDelete(fileForItem.id);
            const newUploadedFiles = new Map(uploadedFiles);
            newUploadedFiles.delete(index);
            setUploadedFiles(newUploadedFiles);
        }

        handleCarouselChange(newCarouselData);
    };

    const handleOnFilesChange = async (
        index: number,
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => {
        return onFileUpload(file, "upload_home_page_carousel_item_image", abortSignal);
    };

    const handleUploadComplete = (index: number, file: fileMetadata.TFileMetadata) => {
        const newUploadedFiles = new Map(uploadedFiles);
        newUploadedFiles.set(index, file);
        setUploadedFiles(newUploadedFiles);
        handleItemFieldChange(index, 'imageUrl', file.url);
    };

    const handleFileDelete = (index: number, id: string) => {
        const newUploadedFiles = new Map(uploadedFiles);
        newUploadedFiles.delete(index);
        setUploadedFiles(newUploadedFiles);
        handleItemFieldChange(index, 'imageUrl', null);
        onFileDelete(id);
    };

    const handleFileDownload = (id: string) => {
        onFileDownload(id);
    };

    return (
        <div className="w-full p-6 border border-card-fill rounded-medium bg-card-fill flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2>Carousel Section</h2>

            </div>

            <div className="flex flex-col gap-6 transition-all duration-300 ease-in-out">
                {carouselData.map((item, index) => (
                    <div
                        key={index}
                        className=" rounded-medium flex flex-col gap-4 
                                   transition-all duration-300 ease-in-out"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold transition-colors duration-200">Carousel Item {index + 1}</h3>
                            <Button
                                variant="secondary"
                                size="small"
                                text="Remove"
                                onClick={() => removeCarouselItem(index)}
                                className="transition-all duration-200 hover:scale-105"
                            />
                        </div>

                        <form className="flex flex-col gap-4">
                            <TextAreaInput
                                label="Title"

                                value={item.title}
                                setValue={(value) => handleItemFieldChange(index, 'title', value)}
                                placeholder="Enter the title"
                            />

                            <TextAreaInput
                                label="Description"
                                value={item.description}
                                setValue={(value) => handleItemFieldChange(index, 'description', value)}
                                placeholder="Enter the description"
                            />

                            <div className="flex flex-col gap-2 w-full">
                                <label className="text-sm text-text-secondary">Upload Image</label>
                                <Uploader
                                    type="single"
                                    variant="image"
                                    file={uploadedFiles.get(index) || null}
                                    onDelete={(id) => handleFileDelete(index, id)}
                                    onDownload={handleFileDownload}
                                    onFilesChange={(file, abortSignal) => handleOnFilesChange(index, file, abortSignal)}
                                    onUploadComplete={(file) => handleUploadComplete(index, file)}
                                    locale="en"
                                    maxSize={10}
                                    uploadProgress={uploadProgress}
                                />
                            </div>

                            <TextInput
                                label="Button Text"
                                inputField={{
                                    inputText: "Enter button text",
                                    value: item.buttonText,
                                    setValue: (value) => handleItemFieldChange(index, 'buttonText', value)
                                }}
                            />

                            <TextInput
                                label="Button URL"
                                inputField={{
                                    inputText: "Enter button URL",
                                    value: item.buttonUrl,
                                    setValue: (value) => handleItemFieldChange(index, 'buttonUrl', value)
                                }}
                            />

                            <TextInput
                                label="Badge (Optional)"
                                inputField={{
                                    inputText: "Enter badge text",
                                    value: item.badge || '',
                                    setValue: (value) => handleItemFieldChange(index, 'badge', value || null)
                                }}
                            />
                        </form>
                    </div>
                ))}
                <Button
                    variant="primary"
                    size="medium"
                    text="Add Carousel Item"
                    onClick={addCarouselItem}
                    className="transition-all duration-200 hover:scale-105"
                />

                {carouselData.length === 0 && (
                    <div className="text-center py-8 text-text-secondary transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-4">
                        No carousel items yet. Click "Add Carousel Item" to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
