import { getDictionary } from "@maany_shr/e-class-translations";
import { CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import { AccordionElement } from "./types";
import DesignerLayout from "../designer-layout";
import { IconAccordion } from "../icons/icon-accordion";
import { AccordionBuilderEdit, AccordionBuilderView, AccordionDataProps } from "../accordion-builder";
import { useEffect, useState } from "react";
import { IconPlus } from "../icons/icon-plus";
import { Button } from "../button";
import { fileMetadata } from "@maany_shr/e-class-models";

/**
 * Course element template definition for a Coaching Session.
 * 
 * This object configures how the Coaching Session appears and behaves
 * within the course builder, including its icon, label, designer component,
 * and form component.
 * 
 * @property type The type identifier for this course element (CoachingSession).
 * @property designerBtnElement The button configuration (icon and label) for adding this element in the designer.
 * @property designerComponent The React component rendered in the course designer view.
 * @property formComponent The React component rendered in the student-facing form view.
 */

const accordionElement: CourseElementTemplate = {
    type: CourseElementType.Accordion,
    designerBtnElement: {
        icon: IconAccordion,
        label: "Accordion"
    },
    designerComponent: DesignerComponent,
    formComponent: formComponent,
};

/**
 * DesignerComponent
 * 
 * Renders the coaching session element within the course designer interface.
 * Provides editing controls (move up, move down, delete) and displays the session builder UI.
 * 
 * @param elementInstance The instance of the coaching session element being edited.
 * @param onUpClick Callback for moving the element up in the list.
 * @param onDownClick Callback for moving the element down in the list.
 * @param onDeleteClick Callback for deleting the element.
 * @param locale (Optional) The locale code for translations.
 * 
 * @returns The designer layout for a coaching session, or null if the element type does not match.
 * 
 * @example
 * <DesignerComponent
 *   elementInstance={element}
 *   onUpClick={handleUp}
 *   onDownClick={handleDown}
 *   onDeleteClick={handleDelete}
 *   locale="en"
 * />
 */
interface DesignerComponentProp extends DesignerComponentProps {
    onChange: (value: AccordionDataProps[]) => void;
    onImageChange: (
        image: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal
    ) => Promise<fileMetadata.TFileMetadata>;
    onIconDelete: (index: number) => void;
    onIconDownload: (index: number) => void;
}
function DesignerComponent({
    elementInstance,
    onUpClick,
    onDownClick,
    onDeleteClick,
    onChange,
    locale,
    onImageChange,
    onIconDelete,
    onIconDownload,
}: DesignerComponentProp) {

    const dictionary = getDictionary(locale);
    const [accordionData, setAccordionData] = useState<AccordionDataProps[]>([
        
    ]);
    useEffect(() => {
        if (accordionData.length === 0) {
            handleAddAccordion();
        }
    }, [accordionData.length]);
    const handleAddAccordion = () => {
         const newAccordion = { title: "", content: "" }; // or your default AccordionDataProps
    setAccordionData([...accordionData, newAccordion]);
    }
    const handleUpClick = (index: number) => {
         if (index === 0) return;
        const newData = [...accordionData];
        const [movedItem] = newData.splice(index, 1);
        console.log("Moved Item:", movedItem);
        newData.splice(index - 1, 0, movedItem);
        setAccordionData(newData);
        if (onChange) {
            onChange(newData);
        }
    };
    const handleDownClick = (index: number) => {
        console.log("Down Clicked at index:", index);
          if (index === accordionData.length - 1) return;
        const newData = [...accordionData];
        const [movedItem] = newData.splice(index, 1);
        newData.splice(index + 1, 0, movedItem);
        setAccordionData(newData);
        if (onChange) {
            onChange(newData);
        }
    };
    const handleDeleteClick = (index: number) => {
        console.log("Delete Clicked at index:", index);
        const newData = accordionData.filter((_, i) => i != index);
        console.log("New Data after deletion:", newData);
        setAccordionData(newData);
        if (onChange) {
            onChange(newData);
        }
    };

   const handleIconUpload = async (
      metadata: { id?: string; name?: string; file?: File; },
      signal: AbortSignal
    ): Promise<void> => {
      await onImageChange(metadata as fileMetadata.TFileUploadRequest, signal);
    };
    return (
        <DesignerLayout
            data-testid="designer-layout"
            type={elementInstance.type}
            title="Accordion"
            icon={<IconAccordion classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
            className="bg-card-fill"
        >
            <div className="w-full flex flex-col gap-4 transition-all duration-300">
                {
                    accordionData.map((item, index) => (
                        <AccordionBuilderEdit
                            orderNo={index + 1}
                            key={index}
                            initialData={{ title: item.title, content: item.content }}
                            onItemDelete={() => handleDeleteClick(index)}
                            onItemUp={() => handleUpClick(index)}
                            onItemDown={() => handleDownClick(index)}
                            onChange={(newData) => {
                                const updatedData = [...accordionData];
                                updatedData[index] = newData;
                                setAccordionData(updatedData);
                                onChange(updatedData);
                            }}
                            onImageChange={handleIconUpload}
                            onIconDelete={() => {
                                onIconDelete(index);
                            }}
                            onIconDownload={() => {
                                onIconDownload(index);
                            }}
                            locale={locale}
                        />
                    ))
                }

            </div>
            <div
                className="flex items-center mt-4 gap-2"
                role="group"
                aria-label="Add link divider"
            >
                <hr className="flex-grow border-t border-divider" />
                <Button
                    text={"add accordion"}
                    hasIconRight
                    iconRight={<IconPlus />}
                    onClick={handleAddAccordion}
                    aria-label="Add link"
                    variant="text"
                    
                />
                <hr className="flex-grow border-t border-divider" />
            </div>
        </DesignerLayout>
    );
};


function formComponent({ elementInstance, locale }: FormComponentProps) {
    return (
        <div className="py-4 px-6 bg-card-fill border border-card-stroke radius-md ">
            <AccordionBuilderView data={(elementInstance as AccordionElement).accordionData} />
        </div>
    );
};

export default accordionElement;