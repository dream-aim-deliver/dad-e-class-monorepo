'use client';
import {
    CourseElementTemplate,
    CourseElementType,
    DesignerComponentProps,
    FormComponentProps,
} from '../course-builder/types';
import { getDictionary } from '@maany_shr/e-class-translations';
import { LinkEdit, LinkPreview } from '../links';
import DesignerLayout from '../designer-layout';
import { IconLink } from '../icons/icon-link';
import { LinksElement } from './types';
import { fileMetadata, shared } from '@maany_shr/e-class-models';
import { useState } from 'react';
import { IconPlus } from '../icons/icon-plus';
import { ElementValidator } from '../lesson/types';
import DefaultError from '../default-error';
import { CheckBox } from '../checkbox';

export const getValidationError: ElementValidator = (props) => {
    const { elementInstance, dictionary } = props;

    if (elementInstance.type !== CourseElementType.Links)
        return dictionary.components.lessons.typeValidationText;

    // Check if at least one link is provided
    if (!elementInstance.links || elementInstance.links.length === 0) {
        return dictionary.components.linkLesson.linkCountValidationText;
    }

    // Validate each link has non-empty title and URL
    for (const link of elementInstance.links) {
        if (!link.title || link.title.trim().length === 0) {
            return;
        }
        if (!link.url || link.url.trim().length === 0) {
            return dictionary.components.linkLesson.urlValidationText;
        }
    }

    return undefined;
};

const linksElement: CourseElementTemplate = {
    type: CourseElementType.Links,
    designerBtnElement: {
        icon: IconLink,
        label: 'Links',
    },
    // @ts-ignore
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
};

interface LinkDesignerComponentProps extends DesignerComponentProps {
    elementInstance: LinksElement;
    onImageChange: (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    onImageReady: (
        fileMetadata: fileMetadata.TFileMetadata,
        index: number,
    ) => void;
    onLinkDelete: (index: number) => void;
    onLinkEdit: (data: shared.TLink, index: number) => void;
    onDeleteIcon: (index: number) => void;
    onClickAddLink: () => void;
    onIncludeInMaterialsChange: (value: boolean) => void;
    onAsPartOfMaterialsOnlyChange?: (value: boolean) => void;
}

export function DesignerComponent({
    elementInstance,
    onUpClick,
    onDownClick,
    onDeleteClick,
    locale,
    onImageChange,
    onImageReady,
    onLinkDelete,
    onLinkEdit,
    onDeleteIcon,
    onClickAddLink,
    validationError,
    onIncludeInMaterialsChange,
    onAsPartOfMaterialsOnlyChange,
}: LinkDesignerComponentProps) {
    if (elementInstance.type !== CourseElementType.Links) return null;

    const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);

    // When asPartOfMaterialsOnly is true, includeInMaterials must also be true
    const isAsPartOfMaterialsOnly = elementInstance.asPartOfMaterialsOnly ?? false;
    const includeInMaterialsChecked = isAsPartOfMaterialsOnly || (elementInstance.includeInMaterials ?? false);

    // TODO: merge with assignment
    return (
        <DesignerLayout
            type={elementInstance.type}
            title="Links"
            icon={<IconLink classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
            validationError={validationError}
        >
            <CheckBox
                name={`include-in-materials-${elementInstance.id}`}
                value={elementInstance.id}
                checked={includeInMaterialsChecked}
                withText
                label="Include links in course material tab"
                onChange={() =>
                    onIncludeInMaterialsChange(
                        !elementInstance.includeInMaterials,
                    )
                }
                className="mb-2"
                disabled={isAsPartOfMaterialsOnly}
            />
            <CheckBox
                name={`as-part-of-materials-only-${elementInstance.id}`}
                value={elementInstance.id}
                checked={isAsPartOfMaterialsOnly}
                withText
                label="Show only in materials tab (hide from lesson)"
                onChange={() => {
                    const newValue = !isAsPartOfMaterialsOnly;
                    onAsPartOfMaterialsOnlyChange?.(newValue);
                    // When enabling asPartOfMaterialsOnly, also enable includeInMaterials
                    if (newValue && !elementInstance.includeInMaterials) {
                        onIncludeInMaterialsChange(true);
                    }
                }}
                className="mb-2"
            />
            <div className="flex flex-col items-center justify-center gap-[10px] w-full">
                {elementInstance.links?.map((link, index) =>
                    linkEditIndex === index ? (
                        <div className="flex flex-col w-full" key={index}>
                            <LinkEdit
                                locale={locale}
                                initialTitle={link.title}
                                initialUrl={link.url}
                                initialCustomIcon={link.customIcon}
                                onSave={(title, url, customIcon) => {
                                    onLinkEdit(
                                        { title, url, customIcon },
                                        index,
                                    );
                                    setLinkEditIndex(null);
                                }}
                                onDiscard={() => {
                                    setLinkEditIndex(null);
                                }}
                                onImageChange={async (image, abortSignal) => {
                                    const result = await onImageChange(
                                        image,
                                        abortSignal,
                                    );
                                    onImageReady(result, index);
                                    return result;
                                }}
                                onDeleteIcon={() => onDeleteIcon(index)}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col w-full" key={index}>
                            <LinkPreview
                                preview
                                title={link.title || ''}
                                url={link.url || ''}
                                customIcon={link.customIcon}
                                onEdit={() => {
                                    setLinkEditIndex(index);
                                }}
                                onDelete={() => onLinkDelete(index)}
                            />
                        </div>
                    ),
                )}
                <div className="flex items-center mt-4 w-full">
                    <div className="flex-grow border-t border-divider"></div>
                    <span
                        onClick={onClickAddLink}
                        className="text-button-primary-fill mx-4 capitalize flex gap-1 items-center text-para-sm font-bold cursor-pointer hover:text-action-hover"
                    >
                        <IconPlus />
                        <span>Add Link</span>
                    </span>
                    <div className="flex-grow border-t border-divider"></div>
                </div>
            </div>
        </DesignerLayout>
    );
}

export function FormComponent({ elementInstance, locale }: FormComponentProps) {
    if (elementInstance.type !== CourseElementType.Links) return null;

    // If asPartOfMaterialsOnly is true, don't render in the lesson view (only show in materials tab)
    if (elementInstance.asPartOfMaterialsOnly) return null;

    const dictionary = getDictionary(locale);

    const validationError = getValidationError({ elementInstance, dictionary });
    if (validationError) {
        return (
            <DefaultError
                locale={locale}
                title={dictionary.components.lessons.elementValidationText}
                description={validationError}
            />
        );
    }

    return (
        <div className="flex flex-col gap-4 p-4 bg-card-fill border-[1px] border-card-stroke rounded-medium w-full">
            {elementInstance.links.map((link, index) => (
                <LinkPreview
                    key={`link-${elementInstance.id}-${index}`}
                    title={link.title as string}
                    url={link.url as string}
                    customIcon={link.customIcon}
                />
            ))}
        </div>
    );
}

export default linksElement;
