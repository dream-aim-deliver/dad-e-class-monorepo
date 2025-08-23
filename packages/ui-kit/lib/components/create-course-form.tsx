import { useState } from 'react';
import { getDictionary } from '@maany_shr/e-class-translations';
import { Uploader } from './drag-and-drop-uploader/uploader';
import { isLocalAware } from '@maany_shr/e-class-translations';
import { fileMetadata } from '@maany_shr/e-class-models';
import { InputField } from './input-field';
import RichTextEditor from './rich-text-element/editor';
import { serialize } from './rich-text-element/serializer';
import { Descendant, Node } from 'slate';
import Banner from './banner';
import { IconCourse } from './icons/icon-course';
import { Divider } from './divider';

interface CreateCourseFormProps extends isLocalAware {
    image: fileMetadata.TFileMetadataImage | null;
    courseTitle: string;
    setCourseTitle: (title: string) => void;
    courseSlug: string;
    setCourseSlug: (slug: string) => void;
    courseDescription: Descendant[];
    setCourseDescription: (description: Descendant[]) => void;
    onFileChange: (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    onUploadComplete: (file: fileMetadata.TFileMetadataImage) => void;
    onDelete: (id: string) => void;
    onDownload: (id: string) => void;
    errorMessage?: string;
    hasSuccess?: boolean;
    duplicationCourse?: {
        title: string;
        imageUrl?: string;
    };
}

export function useCreateCourseForm() {
    const [courseTitle, setCourseTitle] = useState('');
    const [courseSlug, setCourseSlug] = useState('');
    const [courseDescription, setCourseDescription] = useState<Descendant[]>(
        [],
    );
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

    const isDescriptionValid = () => {
        const content = courseDescription
            .map((n) => Node.string(n))
            .join('\n')
            .trim();
        return content.length > 0;
    };

    return {
        courseTitle,
        setCourseTitle: handleCourseTitleChange,
        courseSlug,
        setCourseSlug: handleCourseSlugChange,
        courseDescription,
        setCourseDescription,
        serializeDescription,
        hasUserEditedSlug,
        isDescriptionValid,
    };
}

export function CreateCourseForm(props: CreateCourseFormProps) {
    const dictionary = getDictionary(props.locale);
    const {
        locale,
        onDelete,
        onDownload,
        courseTitle,
        setCourseTitle,
        courseSlug,
        setCourseSlug,
        courseDescription,
        setCourseDescription,
        errorMessage,
        hasSuccess,
        duplicationCourse,
    } = props;

    const handleOnFilesChange = async (
        file: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => {
        return props.onFileChange(file, abortSignal);
    };

    const handleOnUploadComplete = (file: fileMetadata.TFileMetadata) => {
        if (file.category !== 'image') {
            console.error('Uploaded file is not an image');
            return;
        }
        props.onUploadComplete(file);
    };

    const [hasDuplicationThumbnailError, setHasDuplicationThumbnailError] =
        useState<boolean>(false);

    const renderCourseIcon = () => {
        const imageUrlString = duplicationCourse?.imageUrl ?? '';

        if (!imageUrlString || hasDuplicationThumbnailError) {
            return <IconCourse className="w-6 h-6" />;
        }

        return (
            <img
                className="w-6 h-6 rounded-md"
                src={imageUrlString}
                alt={duplicationCourse?.title}
                onError={() => setHasDuplicationThumbnailError(true)}
            />
        );
    };

    return (
        <div className="w-full p-4 bg-card-fill rounded-md flex flex-col gap-4 border-1 border-card-stroke">
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
                    <div className="flex flex-col gap-1">
                        <label className="text-sm md:text-md text-text-secondary">
                            {
                                dictionary.components.courseIntroInformation
                                    .briefDescription
                            }
                        </label>
                        <RichTextEditor
                            locale={locale}
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
                </div>
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
                            file={props.image}
                            onFilesChange={handleOnFilesChange}
                            onUploadComplete={handleOnUploadComplete}
                            onDelete={onDelete}
                            onDownload={onDownload}
                            className='mb-2'
                        />
                        <p className="text-text-secondary text-sm">
                            {dictionary.components.createCourseForm.recommendedSizeText}
                        </p>
                    </div>
                </div>
            </div>
            {errorMessage && (
                <Banner style="error" description={errorMessage} />
            )}
            {hasSuccess && (
                <Banner
                    style="success"
                    description={
                        dictionary.components.createCourseForm.successBanner
                    }
                />
            )}
        </div>
    );
}
