import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";

interface PreAssessmentFormProps extends isLocalAware {
    children: React.ReactNode;
}

export function PreAssessmentForm({
    locale,
    children
}: PreAssessmentFormProps) {
    const dictionary = getDictionary(locale);

    return <div className="max-w-[560px] p-6 flex flex-col gap-4 bg-card-fill shadow-[0px_4px_12px_0px_base-neutral-950] border-1 rounded-medium border-card-stroke text-text-primary">
        <h3>{dictionary.components.formRenderer.title}</h3>
        {children}
    </div>;
}