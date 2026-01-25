'use client';

import { useState } from 'react';
import { getDictionary } from '@maany_shr/e-class-translations';
import { Uploader } from './drag-and-drop-uploader/uploader';
import { isLocalAware } from '@maany_shr/e-class-translations';
import { fileMetadata } from '@maany_shr/e-class-models';
import { InputField } from './input-field';
import RichTextEditor from './rich-text-element/editor';
import { deserialize, serialize } from './rich-text-element/serializer';
import { Descendant, Node } from 'slate';
import Banner from './banner';
import { IconCourse } from './icons/icon-course';
import { Divider } from './divider';
import { useImageComponent } from '../contexts/image-component-context';

interface CourseRequirement {
    id: number;
    title: string;
    slug: string;
    imageUrl: string;
}

interface CourseFormProps extends isLocalAware {
    mode: 'create' | 'edit';
    // Controlled form values
    courseVersion: number | null;

    image: fileMetadata.TFileMetadataImage | null;
    courseTitle: string;
    setCourseTitle: (title: string) => void;
    courseSlug: string;
    setCourseSlug: (slug: string) => void;
    courseDescription: Descendant[];
    setCourseDescription: (description: Descendant[]) => void;

    // Edit mode specific fields
    duration?: number;
    setDuration?: (duration: number) => void;
    requirements?: CourseRequirement[];
    onAddRequirement?: (requirement: CourseRequirement) => void;
    onRemoveRequirement?: (requirementId: number) => void;
    availableCourses?: CourseRequirement[];

    // File handling
    onFileChange: (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    onUploadComplete: (file: fileMetadata.TFileMetadataImage) => void;
    onDelete: (id: string) => void;
    onDownload: (id: string) => void;

    // UI state
    errorMessage?: string;
    hasSuccess?: boolean;
    duplicationCourse?: {
        title: string;
        imageUrl?: string;
    };
    uploadProgress?: number;
}

export interface CourseDetailsState {
    courseTitle: string;
    courseSlug: string;
    courseDescription: Descendant[];
    duration?: number;
    requirements?: CourseRequirement[];
    hasUserEditedSlug: boolean;
    categoryId?: number;
    topicIds?: number[];
    setCourseTitle: (title: string) => void;
    setCourseSlug: (slug: string) => void;
    setCourseDescription: (description: Descendant[]) => void;
    setDuration: (duration: number | undefined) => void;
    onAddRequirement: (requirement: CourseRequirement) => void;
    onRemoveRequirement: (requirementId: number) => void;
    setRequirements: (requirements: CourseRequirement[]) => void;
    setCategoryId: (id: number | undefined) => void;
    setTopicIds: (ids: number[]) => void;

    isDescriptionValid: () => boolean;
    serializeDescription: () => string;
    parseDescription: (value: string) => void;
}

interface UseCourseInitialState {
    courseTitle?: string;
    courseSlug?: string;
    courseDescription?: string;
    duration?: number | undefined;
    requirements?: CourseRequirement[];
}

// Hook for parent components to manage form state
export function useCourseForm(
    initialState?: UseCourseInitialState,
): CourseDetailsState {
    const [courseTitle, setCourseTitle] = useState(
        initialState?.courseTitle ?? '',
    );
    const [courseSlug, setCourseSlug] = useState(
        initialState?.courseSlug ?? '',
    );
    const [courseDescription, setCourseDescription] = useState<Descendant[]>(
        initialState?.courseDescription
            ? deserialize({
                  serializedData: initialState.courseDescription,
                  onError: console.error,
              })
            : [],
    );
    const [duration, setDuration] = useState<number | undefined>(
        initialState?.duration,
    );
    const [requirements, setRequirements] = useState<CourseRequirement[]>(
        initialState?.requirements ?? [],
    );
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
    const [topicIds, setTopicIds] = useState<number[]>([]);
    const [hasUserEditedSlug, setHasEditedCourseSlug] = useState(false);

    const serializeDescription = () => serialize(courseDescription);

    const handleCourseSlugChange = (slug: string) => {
        setCourseSlug(slug);
        setHasEditedCourseSlug(true);
    };

    const handleCourseTitleChange = (title: string) => {
        setCourseTitle(title);
        if (!hasUserEditedSlug) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            setCourseSlug(slug);
        }
    };

    const handleAddRequirement = (course: CourseRequirement) => {
        if (!requirements.find((req) => req.id === course.id)) {
            setRequirements((prev) => [...prev, course]);
        }
    };

    const handleRemoveRequirement = (courseId: number) => {
        setRequirements((prev) => prev.filter((req) => req.id !== courseId));
    };

    const isDescriptionValid = () => {
        const content = courseDescription
            .map((n) => Node.string(n))
            .join('\n')
            .trim();
        return content.length > 0;
    };

    const parseDescription = (value: string) => {
        const parsed = deserialize({
            serializedData: value,
            onError: console.error,
        });
        setCourseDescription(parsed);
    };

    return {
        // Form values
        courseTitle,
        courseSlug,
        courseDescription,
        duration,
        requirements,
        categoryId,
        topicIds,

        // Form handlers
        setCourseTitle: handleCourseTitleChange,
        setCourseSlug: handleCourseSlugChange,
        setCourseDescription,
        setDuration,
        onAddRequirement: handleAddRequirement,
        onRemoveRequirement: handleRemoveRequirement,
        setRequirements,
        setCategoryId,
        setTopicIds,

        // Utilities
        hasUserEditedSlug,
        isDescriptionValid,
        serializeDescription,
        parseDescription,
    };
}

// Main unified form component
export function CourseForm(props: CourseFormProps) {
    const ImageComponent = useImageComponent();
    const dictionary = getDictionary(props.locale);
    const {
        mode,
        locale,
        courseVersion,
        // Controlled form values
        image,
        courseTitle,
        setCourseTitle,
        courseSlug,
        setCourseSlug,
        courseDescription,
        setCourseDescription,
        duration = 0,
        setDuration,
        requirements = [],
        onAddRequirement,
        onRemoveRequirement,
        availableCourses = [],
        // File handling
        onFileChange,
        onUploadComplete,
        onDelete,
        onDownload,
        // UI state
        errorMessage,
        hasSuccess,
        duplicationCourse,
    } = props;

    const handleOnFilesChange = async (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => {
        return onFileChange(file, abortSignal);
    };

    const handleOnUploadComplete = (file: fileMetadata.TFileMetadata) => {
        if (file.category !== 'image') {
            console.error('Uploaded file is not an image');
            return;
        }
        onUploadComplete(file);
    };

    const [hasDuplicationThumbnailError, setHasDuplicationThumbnailError] =
        useState<boolean>(false);

    const renderCourseIcon = () => {
        const imageUrlString = duplicationCourse?.imageUrl ?? '';

        if (!imageUrlString || hasDuplicationThumbnailError) {
            return <IconCourse className="w-6 h-6" />;
        }

        return (
            <ImageComponent
                className="w-6 h-6 rounded-md"
                src={imageUrlString}
                alt={duplicationCourse?.title}
                width={24}
                height={24}
                onError={() => setHasDuplicationThumbnailError(true)}
            />
        );
    };

    const isEditMode = mode === 'edit';

    return (
        <div className="w-full flex flex-col gap-4">
            {duplicationCourse && (
                <>
                    <div className="flex items-center gap-3 text-text-primary">
                        {renderCourseIcon()}
                        <span>
                            {' '}
                            {
                                dictionary.components.createCourseForm
                                    .duplicating
                            }{' '}
                            {duplicationCourse.title}
                        </span>
                    </div>
                    <Divider className="my-1" />
                </>
            )}

            <div className="w-full flex flex-col md:flex-row gap-8 min-w-0">
                <div className="flex-1 w-full flex flex-col gap-4 min-w-0">
                    {/* Title */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm md:text-md text-text-secondary">
                            {
                                dictionary.components.courseIntroInformation
                                    .courseTitle
                            }
                        </label>
                        <InputField
                            inputText={
                                dictionary.components.courseIntroInformation
                                    .courseTitle
                            }
                            type="text"
                            value={courseTitle}
                            setValue={(value) => setCourseTitle(value)}
                        />
                    </div>

                    {/* Slug */}
                    {!isEditMode && (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm md:text-md text-text-secondary">
                                {dictionary.components.createCourseForm.slug}
                            </label>
                            <InputField
                                inputText={
                                    dictionary.components.createCourseForm.slug
                                }
                                type="text"
                                value={courseSlug}
                                setValue={(value) => setCourseSlug(value)}
                            />
                        </div>
                    )}

                    {/* Duration - only in edit mode */}

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm md:text-md text-text-secondary">
                            {
                                dictionary.components.courseIntroInformation
                                    .briefDescription
                            }
                        </label>
                        <RichTextEditor
                            locale={locale}
                            key={`course-description-${courseVersion}`} // Reset editor when course version changes
                            name="courseDescription"
                            placeholder={
                                dictionary.components.courseIntroInformation
                                    .briefDescriptionPlaceholder
                            }
                            initialValue={courseDescription}
                            onLoseFocus={(value) => {
                                // Don't perform any action on lose focus
                            }}
                            onChange={(value) => setCourseDescription(value)}
                            onDeserializationError={(msg, err) =>
                                console.error(msg, err)
                            }
                        />
                    </div>

                    {isEditMode && setDuration && (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm md:text-md text-text-secondary">
                                {
                                    dictionary.components.createCourseForm
                                        .estimatedDurationText
                                }
                            </label>
                            <InputField
                                inputText={
                                    dictionary.components.createCourseForm
                                        .durationPlaceholderText
                                }
                                type="number"
                                min={0}
                                value={duration.toString()}
                                setValue={(value) =>
                                    setDuration(parseInt(value))
                                }
                            />
                        </div>
                    )}
                </div>

                {/* Image Upload */}
                <div className="flex flex-col gap-1 min-w-0 md:w-80 w-full">
                    <label className="text-sm md:text-md text-text-secondary leading-[150%] capitalize">
                        {
                            dictionary.components.courseIntroInformation
                                .featuredImage
                        }
                    </label>
                    <div className="w-full">
                        <Uploader
                            locale={locale}
                            variant="image"
                            type="single"
                            file={image}
                            onFilesChange={handleOnFilesChange}
                            onUploadComplete={handleOnUploadComplete}
                            onDelete={onDelete}
                            onDownload={onDownload}
                            isDeletionAllowed
                            className="mb-2"
                            uploadProgress={props.uploadProgress}
                        />
                        <p className="text-text-secondary text-sm">
                            {
                                dictionary.components.createCourseForm
                                    .recommendedSizeText
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Error/Success Messages */}
            {errorMessage && (
                <Banner style="error" description={errorMessage} />
            )}
            {hasSuccess && (
                <Banner
                    style="success"
                    description={
                        isEditMode
                            ? dictionary.components.createCourseForm
                                  .successUpdatedBanner
                            : dictionary.components.createCourseForm
                                  .successCreatedBanner
                    }
                />
            )}
        </div>
    );
}
