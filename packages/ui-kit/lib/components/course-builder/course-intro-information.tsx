import { useState } from 'react'
import { getDictionary } from '@maany_shr/e-class-translations'
import { Uploader } from '../drag-and-drop-uploader/uploader'
import { TCourseMetadata, TCourseDuration } from 'packages/models/src/course'
import { isLocalAware } from '@maany_shr/e-class-translations'
import { fileMetadata } from '@maany_shr/e-class-models';
import { InputField } from '../input-field';
import RichTextEditor from '../rich-text-element/editor';
import { deserialize } from '../rich-text-element/serializer';
import { Descendant } from 'slate';
import { SearchableDropdown } from '../SearchableDropdown';
import { Button } from '../button';
import { IconTrashAlt, IconCourse } from '../icons';
import { z } from 'zod';

// Use proper type inference from the existing schema
type TFileMetadataImage = z.infer<typeof fileMetadata.FileMetadataImageSchema>;

/**
 * Course Intro Information Component
 * 
 * @param {courseIntroInformationProps} props - The props for the component.
 *
 * @returns {JSX.Element} The rendered component.
 */
interface courseIntroInformationProps extends Omit<TCourseMetadata, 'imageUrl'>, isLocalAware {
    imageUrl: TFileMetadataImage;
    requiredCourses: { id: number; name: string }[];
    availableCourses: { id: number; name: string; imageUrl: TFileMetadataImage; }[]
    coaches: { name: string; imageUrl: TFileMetadataImage }[];
    courseCreator: { name: string; imageUrl: TFileMetadataImage };
    onFileChange: (file: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => Promise<fileMetadata.TFileMetadata>;
    onUploadComplete: (file: fileMetadata.TFileMetadata) => void;
    onSave: (course: TCourseMetadata) => void;
    onDelete: (id: string) => void;
    onDownload: (id: string) => void;
}
function CourseIntroInformationEdit({ ...props }: courseIntroInformationProps) {
    const dictionary = getDictionary(props.locale)
    const { description, duration, courseCreator, locale, onSave, imageUrl, availableCourses, onDelete, onDownload } = props
    const [courseTitle, setCourseTitle] = useState(courseCreator.name);
    const [courseDescription, setCourseDescription] = useState<Descendant[]>(
        deserialize({ serializedData: description as string, onError: (msg, err) => console.error(msg, err) })
    );
    const [courseDuration, setCourseDuration] = useState<number>((duration as TCourseDuration)?.selfStudy || 0);
    const [selectedCourses, setSelectedCourses] = useState(availableCourses);
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

    // Function to handle image error
    const handleImageError = (courseId: number) => {
        setImageErrors(prev => new Set(prev).add(courseId));
    };

    // Function to render course icon
    const renderCourseIcon = (course: { id: number; imageUrl: TFileMetadataImage; name: string }) => {
        // Try to get the image URL from the metadata object
        const imageUrlString = course.imageUrl?.url || '';

        if (!imageUrlString || imageErrors.has(course.id)) {
            return <IconCourse className="w-6 h-6 text-gray-500" />;
        }

        return (
            <img
                className='w-6 h-6 rounded-md'
                src={imageUrlString}
                alt={course.name}
                onError={() => handleImageError(course.id)}
            />
        );
    };


    const handleOnFilesChange = async (file: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => {
        return props.onFileChange(file, abortSignal)
    };

    const handleOnUploadComplete = (file: fileMetadata.TFileMetadata) => {
        props.onUploadComplete(file);
    }
    return (
        <div className='w-full p-4 bg-card-fill rounded-md flex flex-col gap-4' >
            <header>
                <h2 className='text-text-primary md:text-3xl text-[32px]'>{dictionary.components.courseIntroInformation.generalInformation}</h2>
            </header>
            <div className='w-full flex flex-col md:flex-row gap-8 min-w-0'>
                <div className='flex-1 w-full flex flex-col gap-6 min-w-0'>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm md:text-md text-text-secondary'>{dictionary.components.courseIntroInformation.courseTitle}</label>
                        <InputField
                            inputPlaceholder={dictionary.components.courseIntroInformation.courseTitle}


                            type='text'
                            value={courseTitle} setValue={value => setCourseTitle(value)} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm md:text-md text-text-secondary'>{dictionary.components.courseIntroInformation.briefDescription}</label>
                        <RichTextEditor
                            locale={locale}
                            name="courseDescription"
                            placeholder={dictionary.components.courseIntroInformation.briefDescriptionPlaceholder}
                            initialValue={courseDescription}
                            onLoseFocus={(value) => { onSave({ ...props, description: value, imageUrl: props.imageUrl.url }) }}
                            onChange={(value) => setCourseDescription(value)}
                            onDeserializationError={(msg, err) => console.error(msg, err)}
                        />

                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm md:text-md text-text-secondary'>{dictionary.components.courseIntroInformation.estimatedDuration}</label>
                        <InputField
                            inputPlaceholder='0'
                            type='number'
                            value={courseDuration.toString()}
                            setValue={value => setCourseDuration(Number(value))}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h6 className="text-text-primary md:text-xl leading-[120%]">{dictionary.components.courseIntroInformation.requirements}</h6>
                        <label className='text-sm md:text-md text-text-secondary'>{dictionary.components.courseIntroInformation.requirementsDescription}</label>
                        <SearchableDropdown
                            locale={locale}
                            options={availableCourses.filter(ac => !selectedCourses.some(sc => sc.id === ac.id))}
                            optionKey="id"
                            optionValue="name"
                            onSelect={(course) => {
                                if (!selectedCourses.find(c => c.id === course.id)) {
                                    setSelectedCourses([...selectedCourses, course]);
                                }
                            }}
                            placeholder={dictionary.components.courseIntroInformation.searchCoursesPlaceholder}
                        />
                        <div className="flex flex-wrap gap-2 mb-2">
                            {selectedCourses.map(course => (
                                <div key={course.id} className='flex items-center gap-2'>
                                    <Button
                                        text={course.name}
                                        variant="text"
                                        hasIconLeft
                                        iconLeft={renderCourseIcon(course)}
                                    />

                                    <div title={dictionary.components.courseIntroInformation.removeCourse} className="cursor-pointer text-button-text-text" onClick={() => setSelectedCourses(selectedCourses.filter(c => c.id !== course.id))}>
                                        <IconTrashAlt />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-1 min-w-0 md:w-80 w-full'>

                    <label className='text-sm md:text-md text-text-secondary leading-[150%] capitalize'>{dictionary.components.courseIntroInformation.featuredImage}</label>
                    <div className='w-full'>
                        <Uploader
                            locale={locale}
                            variant='image'
                            type='single'
                            file={imageUrl}
                            onFilesChange={handleOnFilesChange}
                            onUploadComplete={handleOnUploadComplete}
                            onDelete={onDelete}
                            onDownload={onDownload}
                        />
                    </div>
                </div>
            </div>



        </div>
    )

}


export default CourseIntroInformationEdit
