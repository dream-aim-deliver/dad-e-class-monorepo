import React from 'react';
import { getDictionary } from '@maany_shr/e-class-translations';
import {
    CourseElementTemplate,
    CourseElementType,
    DesignerComponentProps,
    FormComponentProps,
} from '../course-builder/types';
import { FeedbackElement } from '../course-builder-lesson-component/types';
import DesignerLayout from '../designer-layout';
import { IconChat } from '../icons/icon-chat';
import { ElementValidator } from '../lesson/types';
import DefaultError from '../default-error';
import { fileMetadata } from '@maany_shr/e-class-models';
import {
    CreateFeedbackBuilderView,
    CreateFeedbackProps,
} from '../feedback-course-builder/create-feedback-builder-view';
import { FeedbackBuilderView } from '../feedback-course-builder/feedback-builder-view';

const feedbackElement: CourseElementTemplate = {
    type: CourseElementType.Feedback,
    designerBtnElement: {
        icon: IconChat,
        label: 'Feedback',
    },
    // @ts-ignore
    designerComponent: DesignerComponent,
    // @ts-ignore
    formComponent: FormComponent,
};

export const getValidationError: ElementValidator = (props) => {
    const { elementInstance, dictionary } = props;

    if (elementInstance.type !== CourseElementType.Feedback)
        return dictionary.components.lessons.typeValidationText;

    if (!elementInstance.title || elementInstance.title.trim().length === 0) {
        return dictionary.components.lessons.typeValidationText;
    }

    if (
        !elementInstance.description ||
        elementInstance.description.trim().length === 0
    ) {
        return dictionary.components.lessons.typeValidationText;
    }

    return undefined;
};

interface FeedbackDesignerComponentProps
    extends Omit<CreateFeedbackProps, 'elementInstance'>,
        DesignerComponentProps {
    uploadProgress?: number;
}

export function DesignerComponent({
    elementInstance,
    onUpClick,
    onDownClick,
    onDeleteClick,
    locale,
    validationError,
    uploadProgress,
    ...props
}: FeedbackDesignerComponentProps) {
    if (elementInstance.type !== CourseElementType.Feedback) return null;
    const dictionary = getDictionary(locale);
    return (
        <DesignerLayout
            data-testid="designer-layout"
            type={elementInstance.type}
            title={dictionary.components.lessons.feedback}
            icon={<IconChat classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
            validationError={validationError}
        >
            <CreateFeedbackBuilderView
                elementInstance={elementInstance as FeedbackElement}
                locale={locale}
                uploadProgress={uploadProgress}
                {...props}
            />
        </DesignerLayout>
    );
}

interface FeedbackFormProps extends FormComponentProps {
    onFileDownload: (fileMetadata: fileMetadata.TFileMetadata) => void;
    viewButton?: React.ReactNode;
}

export function FormComponent({
    elementInstance,
    locale,
    onFileDownload,
    viewButton,
}: FeedbackFormProps) {
    if (elementInstance.type !== CourseElementType.Feedback) return null;

    const dictionary = getDictionary(locale);

    const validationError = getValidationError({ elementInstance, dictionary });
    if (validationError) {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={dictionary.components.lessons.elementValidationText}
                description={validationError}
            />
        );
    }

    return (
        <FeedbackBuilderView
            elementInstance={elementInstance as unknown as FeedbackElement}
            locale={locale}
            onFileDownload={onFileDownload}
            viewButton={viewButton}
        />
    );
}

export default feedbackElement;
