import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import { Button } from './button';
import { IconWarning } from './icons';

interface DefaultNotFoundProps {
    locale: TLocale;
    title?: string;
    description?: string;
    onGoBack?: () => void;
    buttonLabel?: string;
}

export default function DefaultNotFound(props: DefaultNotFoundProps) {
    const dictionary = getDictionary(props.locale);

    return (
        <div className="flex w-full flex-col m-auto items-center justify-center rounded-medium border border-card-stroke bg-card-fill px-8 py-12 text-center md:px-14 md:py-16">
            <IconWarning
                classNames="w-24 h-24 fill-base-brand-500 mb-4"
            />
            <h1>404</h1>
            <h2 className="mb-4">
                {props.title || dictionary.components.defaultNotFound.title}
            </h2>

            <p className="mb-8 max-w-md text-lg leading-relaxed text-text-secondary text-balance">
                {props.description || dictionary.components.defaultNotFound.description}
            </p>

            {props.onGoBack && (
                <Button
                    variant="secondary"
                    size="medium"
                    text={props.buttonLabel || dictionary.components.defaultNotFound.goBack}
                    onClick={props.onGoBack}
                    className="w-fit"
                />
            )}
        </div>
    );
}
