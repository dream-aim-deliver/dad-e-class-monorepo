import { TLocale, getDictionary } from "@maany_shr/e-class-translations";
import Banner from "./banner";

interface DefaultErrorProps {
    locale: TLocale;
    title?: string;
    description?: string;
    onRetry?: () => void;
}

// TODO: properly design the default error
export default function DefaultError(props: DefaultErrorProps) {
    const dictionary = getDictionary(props.locale);

    return <Banner 
        title={props.title || dictionary.components.defaultError.title}
        description={props.title || dictionary.components.defaultError.description}
        style="error"
        button={props.onRetry && {
            onClick: props.onRetry,
            label: dictionary.components.defaultError.retry,
        }}
    />;
}
