import { getDictionary } from "@maany_shr/e-class-translations";
import { CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import { AccordionElement } from "./types";
import DesignerLayout from "../designer-layout";
import { IconAccordion } from "../icons/icon-accordion";
import { AccordionBuilderEdit, AccordionBuilderView, AccordionDataProps } from "../accordion-builder";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IconPlus } from "../icons/icon-plus";
import { Button } from "../button";
import { fileMetadata } from "@maany_shr/e-class-models";
import { InputField } from "../input-field";
import { CheckBox } from "../checkbox";

/**
 * Course element template definition for an Accordion element.
 * 
 * This object configures how the Accordion element appears and behaves
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
 * Renders the accordion element within the course designer interface.
 * Provides editing controls (move up, move down, delete) and displays the session builder UI.
 * 
 * @param elementInstance The instance of the coaching session element being edited.
 * @param onUpClick Callback for moving the element up in the list.
 * @param onDownClick Callback for moving the element down in the list.
 * @param onDeleteClick Callback for deleting the element.
 * @param locale (Optional) The locale code for translations.
 * 
 * @returns The designer layout for an accordion, or null if the element type does not match.
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
    onChange?: (value: { title: string; isChecked: boolean; data: AccordionDataProps[] }) => void;
    onImageChange?: (
        image: fileMetadata.TFileUploadRequest,
        signal: AbortSignal
    ) => Promise<void>;
    onIconDelete?: (id: string) => void;
    onIconDownload?: (id: string) => void;
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
    if (elementInstance.type !== CourseElementType.Accordion) return null;
    const dictionary = getDictionary(locale);
    const [accordionData, setAccordionData] = useState<AccordionDataProps[]>(
        (elementInstance as AccordionElement)?.accordionData ?? []
    );
    // Use stable per-item keys to ensure correct reordering behavior with React/Framer Motion
    const genKey = () => (typeof crypto !== 'undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : `${Date.now()}-${Math.random()}`);
    const [itemKeys, setItemKeys] = useState<string[]>(
        ((elementInstance as AccordionElement)?.accordionData ?? []).map(() => genKey())
    );
    const [accordionTitle, setAccordionTitle] = useState<string>(elementInstance.accordionTitle || "");
    const [isIncluded, setIsIncluded] = useState<boolean>(elementInstance.isChecked || false);
    const handleAddAccordion = () => {
        const newAccordion: AccordionDataProps = { title: "", content: "" };
        setAccordionData([...accordionData, newAccordion]);
        setItemKeys([...itemKeys, genKey()]);
    }
    const handleUpClick = (index: number) => {
        if (index === 0) return;
        const newData = [...accordionData];
        const [movedItem] = newData.splice(index, 1);
        newData.splice(index - 1, 0, movedItem);
        setAccordionData(newData);
        const newKeys = [...itemKeys];
        const [movedKey] = newKeys.splice(index, 1);
        newKeys.splice(index - 1, 0, movedKey);
        setItemKeys(newKeys);
        onChange?.({ title: accordionTitle, isChecked: isIncluded, data: newData });
    };
    const handleDownClick = (index: number) => {
        if (index === accordionData.length - 1) return;
        const newData = [...accordionData];
        const [movedItem] = newData.splice(index, 1);
        newData.splice(index + 1, 0, movedItem);
        setAccordionData(newData);
        const newKeys = [...itemKeys];
        const [movedKey] = newKeys.splice(index, 1);
        newKeys.splice(index + 1, 0, movedKey);
        setItemKeys(newKeys);
        onChange?.({ title: accordionTitle, isChecked: isIncluded, data: newData });
    };
    const handleDeleteClick = (index: number) => {
        const newData = accordionData.filter((_, i) => i != index);
        setAccordionData(newData);
        const newKeys = itemKeys.filter((_, i) => i != index);
        setItemKeys(newKeys);
        onChange?.({ title: accordionTitle, isChecked: isIncluded, data: newData });
    };

    const handleIconUpload = async (
        metadata: fileMetadata.TFileUploadRequest,
        signal: AbortSignal
    ): Promise<void> => {
        if (onImageChange) {
            await onImageChange(metadata, signal);
        }
    };
    return (
        <DesignerLayout
            data-testid="designer-layout"
            type={elementInstance.type}
            title={dictionary.components.accordion.accordionText}
            icon={<IconAccordion classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
            className="bg-card-fill"
        >
            <div
                className="flex flex-col gap-4 w-full"
            >
                <InputField
                    type='text'
                    inputPlaceholder={dictionary.components.accordion.accordionTitleText}
                    value={accordionTitle}
                    setValue={(value) => {
                        setAccordionTitle(value);
                        onChange?.({ title: value, isChecked: isIncluded, data: accordionData });
                    }}
                />
                <CheckBox
                    name="isPublicView"
                    value="isPublicView"
                    label={
                        <span className="text-text-primary text-md leading-[150%]">
                            {dictionary.components.accordion.checkboxText}
                        </span>
                    }
                    labelClass="text-text-primary text-sm leading-[100%]"
                    checked={isIncluded}
                    withText
                    onChange={(checked: boolean) => {
                        setIsIncluded(checked);
                        onChange?.({ title: accordionTitle, isChecked: checked, data: accordionData });
                    }}
                />
                <div className="w-full flex flex-col gap-4 transition-all duration-300">
                    <AnimatePresence>
                        {
                            accordionData.map((item, index) => (
                                <motion.div key={itemKeys[index] ?? index}
                                    layout
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <AccordionBuilderEdit
                                        orderNo={index + 1}
                                        totalItems={accordionData.length}
                                        initialData={{ title: item.title, content: item.content, iconUrl: item.iconUrl }}
                                        onItemDelete={() => handleDeleteClick(index)}
                                        onItemUp={() => handleUpClick(index)}
                                        onItemDown={() => handleDownClick(index)}
                                        onChange={(newData) => {
                                            const updatedData = [...accordionData];
                                            const currentItem = updatedData[index];
                                            if (currentItem) {
                                                updatedData[index] = { ...currentItem, ...newData };
                                                setAccordionData(updatedData);
                                                onChange?.({ title: accordionTitle, isChecked: isIncluded, data: updatedData });
                                            }
                                        }}
                                        onImageChange={handleIconUpload}
                                        onIconDelete={() => {
                                            const fileId = accordionData[index]?.iconUrl?.id;
                                            if (fileId) onIconDelete?.(fileId);
                                        }}
                                        onIconDownload={() => {
                                            const fileId = accordionData[index]?.iconUrl?.id;
                                            if (fileId) onIconDownload?.(fileId);
                                        }}

                                        locale={locale}
                                    />
                                </motion.div>
                            ))
                        }
                    </AnimatePresence>
                </div>
                <div
                    className="flex items-center gap-2"
                    role="group"
                    aria-label="Add link divider"
                >
                    <hr className="flex-grow border-t border-divider" />
                    <Button
                        text={dictionary.components.accordion.addItemText}
                        hasIconLeft
                        iconLeft={<IconPlus />}
                        onClick={handleAddAccordion}
                        aria-label="Add link"
                        variant="text"
                    />
                    <hr className="flex-grow border-t border-divider" />
                </div>
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