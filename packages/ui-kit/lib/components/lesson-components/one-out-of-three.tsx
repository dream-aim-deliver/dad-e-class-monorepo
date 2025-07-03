import { useState } from "react";
import { FormElement, FormElementTemplate, SubmitFunction, FormElementType, valueType, DesignerComponentProps } from "../pre-assessment/types";
import DesignerLayout from "../designer-layout";
import { getDictionary } from "@maany_shr/e-class-translations";
import { IconOneOutOfThree } from "../icons/icon-one-out-of-three";
import { OneOutOfThree, OneOutOfThreeData, OneOutOfThreePreview } from "../out-of-three/one-out-of-three";


const oneOutOfThreeElement: FormElementTemplate = {
    type: FormElementType.OneOutOfThree,
    designerBtnElement: {
        icon: IconOneOutOfThree,
        label: "One Out Of Three"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    submissionComponent: ViewComponent,
    validate: (elementInstance: FormElement, value: valueType) => {
        if (elementInstance.required) {
            // Check if any row has a selected column
            // First check if value exists
            if (!value) return false;

            // Type guard to check if value is OneOutOfThreeData
            const isOneOutOfThreeData = (val: valueType): val is OneOutOfThreeData =>
                typeof val === 'object' && val !== null && 'rows' in val && Array.isArray((val as OneOutOfThreeData).rows);

            // If it's not OneOutOfThreeData, we can't validate rows
            if (!isOneOutOfThreeData(value)) return false;

            // Now TypeScript knows value has rows property and we can safely check
            return value.rows.every(row => row.columns.some(col => col.selected));
        }
        return true;
    }
};

function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick }: DesignerComponentProps) {
    if (elementInstance.type !== FormElementType.OneOutOfThree) return null;
    const dictionary = getDictionary(locale);
    const [isRequired, setIsRequired] = useState<boolean>(elementInstance.required || false);
    const [data, setData] = useState<OneOutOfThreeData>({
        tableTitle: elementInstance.data.tableTitle,
        rows: elementInstance.data.rows
    })
    const handleRequiredChange = () => {
        setIsRequired(prev => !prev);
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
            courseBuilder={false}
            isChecked={isRequired}
            onChange={handleRequiredChange}
        >
            <OneOutOfThree
                locale={locale}
                data={data}
                onUpdate={(updatedData) => setData(updatedData)}
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
export function FormComponent({ elementInstance, submitValue }: { elementInstance: FormElement; submitValue?: SubmitFunction }) {
    if (elementInstance.type !== FormElementType.OneOutOfThree) return null;
    const oneOutOfThreeData: OneOutOfThreeData = {
        tableTitle: elementInstance.data.tableTitle,
        rows: elementInstance.data.rows
    };
    const handleChange = (updatedData: OneOutOfThreeData) => {
        if (submitValue) {
            submitValue(elementInstance.id, { ...elementInstance, data: updatedData });
        }
    }
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
        rows: elementInstance.data.rows
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