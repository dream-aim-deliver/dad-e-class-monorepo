import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import Banner from './banner';

interface BaseErrorProps {
    locale: TLocale;
    title: string;
    description: string;
    onRetry?: () => void;
    className?: string;
}

interface SimpleErrorProps extends BaseErrorProps {
    type: 'simple';
}

interface WithSupportEmailErrorProps extends BaseErrorProps {
    type: 'withSupportEmail';
    supportEmailAddress: string;
}

export type DefaultErrorProps = SimpleErrorProps | WithSupportEmailErrorProps;

export default function DefaultError(props: DefaultErrorProps) {
    const dictionary = getDictionary(props.locale);

    // Build description: base description + optional contact line for critical errors
    let fullDescription = props.description;
    if (props.type === 'withSupportEmail' && props.supportEmailAddress) {
        const contactLine = dictionary.components.defaultError.contactSupportLine.replace(
            '{supportEmailAddress}',
            props.supportEmailAddress,
        );
        fullDescription = `${props.description} ${contactLine}`;
    }

    return (
        <Banner
            title={props.title}
            description={fullDescription}
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
