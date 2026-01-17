'use client';

import { useState } from 'react';
import {
    FormElement,
    FormElementTemplate,
    SubmitFunction,
    FormElementType,
    valueType,
    DesignerComponentProps,
    FormComponentProps,
} from '../pre-assessment/types';
import DesignerLayout from '../designer-layout';
import { getDictionary } from '@maany_shr/e-class-translations';
import { IconOneOutOfThree } from '../icons/icon-one-out-of-three';
import {
    OneOutOfThree,
    OneOutOfThreeData,
    OneOutOfThreePreview,
} from '../out-of-three/one-out-of-three';
import { ElementValidator } from '../lesson/types';
import DefaultError from '../default-error';

export const getValidationError: ElementValidator = (props) => {
    const { elementInstance, dictionary, context = 'coach' } = props;

    if (elementInstance.type !== FormElementType.OneOutOfThree)
        return dictionary.components.lessons.typeValidationText;

    // Student validation: Always check if user has made selections for all rows (actual form submission)
    if (context === 'student') {
        const allRowsHaveSelection = elementInstance.data?.rows?.every(
            (row) => row.columns.some((col) => col.selected),
        );
        if (!allRowsHaveSelection) {
            return dictionary.components.formRenderer.fieldRequired;
        }
        return undefined;
    }

    // Coach validation: Check element structure (course builder - both designer and preview)
    // Check if title (tableTitle) is empty
    if (
        !elementInstance.data?.tableTitle ||
        elementInstance.data.tableTitle.trim() === ''
    ) {
        return dictionary.components.oneOutOfThreeLesson.titleValidationText;
    }

    // Check if there is at least one row
    if (!elementInstance.data?.rows || elementInstance.data.rows.length === 0) {
        return dictionary.components.oneOutOfThreeLesson.rowCountValidationText;
    }

    // Check if any row title is empty
    const hasEmptyRowTitle = elementInstance.data.rows.some(
        (row) => !row.rowTitle || row.rowTitle.trim() === '',
    );
    if (hasEmptyRowTitle) {
        return dictionary.components.oneOutOfThreeLesson.rowTitleValidationText;
    }

    // Check if any column title is empty
    const hasEmptyColumnTitle = elementInstance.data.rows.some(
        (row) =>
            row.columns.length < 3 ||
            row.columns.some(
                (col) => !col.columnTitle || col.columnTitle.trim() === '',
            ),
    );
    if (hasEmptyColumnTitle) {
        return dictionary.components.oneOutOfThreeLesson
            .columnTitleValidationText;
    }

    return undefined;
};

const oneOutOfThreeElement: FormElementTemplate = {
    type: FormElementType.OneOutOfThree,
    designerBtnElement: {
        icon: IconOneOutOfThree,
        label: 'One Out Of Three',
    },
    // @ts-ignore
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    submissionComponent: ViewComponent,
};

interface OneOutOfThreeDesignerComponentProps extends DesignerComponentProps {
    onChange: (updatedData: OneOutOfThreeData) => void;
    onRequiredChange: (isRequired: boolean) => void;
}

export function DesignerComponent({
    elementInstance,
    locale,
    onUpClick,
    onDownClick,
    onDeleteClick,
    onChange,
    onRequiredChange,
    validationError,
    isCourseBuilder,
}: OneOutOfThreeDesignerComponentProps) {
    if (elementInstance.type !== FormElementType.OneOutOfThree) return null;
    const dictionary = getDictionary(locale);
    const [isRequired, setIsRequired] = useState<boolean>(
        elementInstance.required || false,
    );
    const [data, setData] = useState<OneOutOfThreeData>({
        tableTitle: elementInstance.data.tableTitle,
        columns: elementInstance.data.columns || (elementInstance.data.rows[0]?.columns || [
            { columnTitle: '', selected: false },
            { columnTitle: '', selected: false },
            { columnTitle: '', selected: false }
        ]),
        rows: elementInstance.data.rows,
    });
    const handleRequiredChange = () => {
        setIsRequired((prev) => !prev);
        onRequiredChange(!isRequired);
    };

    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.lessons.oneOutOfThree}
            icon={<IconOneOutOfThree classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={isCourseBuilder}
            isChecked={isRequired}
            onChange={handleRequiredChange}
            validationError={validationError}
        >
            <OneOutOfThree
                locale={locale}
                data={data}
                onUpdate={(updatedData) => {
                    setData(updatedData);
                    onChange(updatedData);
                }}
            />
        </DesignerLayout>
    );
}

/**
 * FormComponent for rendering a multiple choice question in the form
 *
 * @param {Object} props - Component props
 * @param {FormElement} props.elementInstance - The form element instance containing the multiple choice question data
 * @param {SubmitFunction} [props.submitValue] - Function to handle submission of the form element value
 * @returns {JSX.Element|null} - Rendered component or null if element type doesn't match
 */
export function FormComponent({
    elementInstance,
    submitValue,
    locale,
    disableValidation,
}: FormComponentProps) {
    if (elementInstance.type !== FormElementType.OneOutOfThree) return null;

    const dictionary = getDictionary(locale);

    if (!disableValidation) {
        const validationError = getValidationError({
            elementInstance,
            dictionary,
            context: 'coach',
        });
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
    }

    const oneOutOfThreeData: OneOutOfThreeData = {
        tableTitle: elementInstance.data.tableTitle,
        columns: elementInstance.data.columns || (elementInstance.data.rows[0]?.columns || [
            { columnTitle: '', selected: false },
            { columnTitle: '', selected: false },
            { columnTitle: '', selected: false }
        ]),
        rows: elementInstance.data.rows,
    };
    const handleChange = (updatedData: OneOutOfThreeData) => {
        if (submitValue) {
            submitValue(elementInstance.id, {
                ...elementInstance,
                data: updatedData,
            });
        }
    };
    return (
        <OneOutOfThreePreview
            data={oneOutOfThreeData}
            displayOnly={false}
            onChange={handleChange}
            required={elementInstance.required ?? false}
        />
    );
}

function ViewComponent({ elementInstance }: { elementInstance: FormElement }) {
    if (elementInstance.type !== FormElementType.OneOutOfThree) return null;
    const oneOutOfThreeData: OneOutOfThreeData = {
        tableTitle: elementInstance.data.tableTitle,
        columns: elementInstance.data.columns || (elementInstance.data.rows[0]?.columns || [
            { columnTitle: '', selected: false },
            { columnTitle: '', selected: false },
            { columnTitle: '', selected: false }
        ]),
        rows: elementInstance.data.rows,
    };
    return (
        <OneOutOfThreePreview
            data={oneOutOfThreeData}
            displayOnly={true}
            required={elementInstance.required ?? false}
        />
    );
}

export default oneOutOfThreeElement;
