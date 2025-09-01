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
        <div className="flex flex-col items-center justify-center text-center gap-2 py-16 px-6">
                <IconWarning 
                    classNames="w-24 h-24 fill-base-brand-500"
                />
            <h1>404</h1>
            <h2>
                {props.title || dictionary.components.defaultNotFound.title}
            </h2>
            
            <p className="text-text-secondary text-lg mb-8 max-w-md leading-relaxed">
                {props.description || dictionary.components.defaultNotFound.description}
            </p>
            
            {props.onGoBack && (
                <Button
                    variant="secondary"
                    size="medium"
                    text={props.buttonLabel || dictionary.components.defaultNotFound.goBack}
                    onClick={props.onGoBack}
                    className='w-fit'
                />
            )}
        </div>
    );
}
