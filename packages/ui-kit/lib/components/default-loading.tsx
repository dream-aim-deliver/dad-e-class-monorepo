import { TLocale, getDictionary } from "@maany_shr/e-class-translations";

// TODO: Implement proper design for the loading spinner
interface DefaultLoadingProps {
    locale: TLocale;
}

export default function DefaultLoading({locale}: DefaultLoadingProps) {
    const dictionary = getDictionary(locale);

    return (
        <div className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-transparent border-t-neutral-100"></div>
                <span className="text-neutral-100 text-sm font-medium">{dictionary.components.defaultLoading.loading}</span>
            </div>
        </div>
    );
};
