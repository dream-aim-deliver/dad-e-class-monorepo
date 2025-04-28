import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { formElements } from "./form-element-core";
import { useRef } from "react";
import { Button } from "../button";
import Banner from "../banner";
import { IconLoaderSpinner } from "../icons/icon-loader-spinner";
import { FormElement } from "./types";

interface FormElementRendererProps extends isLocalAware {
    isLoading: boolean;
    isError: boolean;
    onSubmit: (formValues: Record<string, FormElement>) => void;
    elements: FormElement[];
    errorMessage?: string;
}

export function FormElementRenderer({
    isLoading,
    isError,
    onSubmit,
    elements,
    locale,
    errorMessage
}: FormElementRendererProps) {
    const dictionary = getDictionary(locale);
    const formValues = useRef<{ [key: string]: FormElement }>({});

    const submitValue = (id: string, value: FormElement) => {
        formValues.current[id] = value;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        onSubmit(formValues.current);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-[560px] p-6 flex flex-col gap-4 bg-card-fill shadow-[0px_4px_12px_0px_base-neutral-950] border-1 rounded-medium border-card-stroke text-text-primary">
            <h3>{dictionary.components.formBuilder.title}</h3>
            <div className="flex flex-col gap-4">
                {elements.map((elementInstance) => {
                    const Element = formElements[elementInstance.type].formComponent;
                    return (
                        <Element
                            submitValue={submitValue}
                            key={elementInstance.id.toString()}
                            elementInstance={elementInstance}
                        />
                    );
                })}
            </div>
            {isError && (
                <Banner
                    style="error"
                    description={errorMessage || "An error occurred while submitting the form. Please try again."}
                />
            )}
            <Banner
                style="warning"
                description={dictionary.components.formBuilder.alertText}
            />
            <div className="relative w-full">
                <Button
                    type="submit"
                    variant="primary"
                    className="w-full capitalize"
                    disabled={isLoading}
                    text={dictionary.components.formBuilder.submitText}
                />
                {isLoading && <IconLoaderSpinner classNames="absolute left-[50%] top-[20%] animate-spin" />}
            </div>
        </form>
    );
}