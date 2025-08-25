import Banner from "./banner";
import { TLocale, getDictionary } from "@maany_shr/e-class-translations";

interface DefaultComingSoonProps {
    locale: TLocale;
    title?: string;
    description?: string;
    onRetry?: () => void;
    buttonLabel?: string;
}

export default function DefaultComingSoon(props: DefaultComingSoonProps) {
    const dictionary = getDictionary(props.locale);
    const title = props.title || dictionary?.components.defaultComingSoon?.title;
    const description =
        props.description ||
        dictionary.components.defaultComingSoon.description;
       

    return (
        <Banner
            title={title}
            description={description}
            style="neutral"
            button={props.onRetry ? {
                onClick: props.onRetry,
                label: props.buttonLabel || dictionary?.components.defaultComingSoon?.goBack || 'Go back',
            } : undefined}
        />
    );
}


