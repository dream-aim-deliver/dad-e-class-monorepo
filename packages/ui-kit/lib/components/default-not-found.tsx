import { TLocale, getDictionary } from "@maany_shr/e-class-translations";
import Banner from "./banner";

interface DefaultNotFoundProps {
    locale: TLocale;
    title?: string;
    description?: string;
    onRetry?: () => void;
    buttonLabel?: string;
}

// TODO: properly design the default not found
export default function DefaultNotFound(props: DefaultNotFoundProps) {
    const dictionary = getDictionary(props.locale);

    return <Banner
        title={props.title || dictionary.components.defaultNotFound.title}
        description={props.description || dictionary.components.defaultNotFound.description}
        style="neutral"
        button={props.onRetry && {
            onClick: props.onRetry,
            label: props.buttonLabel || dictionary.components.defaultNotFound.retry,
        }}
    />;
}
