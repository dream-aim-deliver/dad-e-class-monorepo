import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import Banner from './banner';

interface DefaultErrorProps {
    locale: TLocale;
    title?: string;
    description?: string;
    onRetry?: () => void;
    className?: string;
}

// TODO: properly design the default error
export default function DefaultError(props: DefaultErrorProps) {
    const dictionary = getDictionary(props.locale);
    const contactEmail =
        (typeof process !== 'undefined' &&
            process?.env?.NEXT_PUBLIC_CONTACT_EMAIL) ||
        '';
    const defaultDescription =
        dictionary.components.defaultError.description.replace(
            '{contactEmail}',
            contactEmail,
        );

    return (
        <Banner
            title={props.title || dictionary.components.defaultError.title}
            description={props.description || defaultDescription}
            style="error"
            button={
                props.onRetry && {
                    onClick: props.onRetry,
                    label: dictionary.components.defaultError.retry,
                }
            }
            className={props.className}
        />
    );
}
