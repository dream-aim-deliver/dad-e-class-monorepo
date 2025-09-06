import { getDictionary, TLocale } from "@maany_shr/e-class-translations";

export function getAuthorDisplayName(name: string | null, surname: string | null, locale: TLocale): string {
    if (name && surname) {
        return `${name} ${surname}`;
    }
    if (name) {
        return name;
    }
    if (surname) {
        return surname;
    }
    const dictionary = getDictionary(locale);
    // TODO: Implement translation
    return 'Anonymous User';
}
