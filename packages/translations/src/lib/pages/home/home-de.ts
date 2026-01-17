import { TDictionary } from "../../dictionaries/base";

export const Home_DE: TDictionary["pages"]["home"] = {
    title: 'Hallo Welt',
    buttonText: 'Klick mich',
    badgeText: 'Badge-12',
    signInButtonText: 'Anmelden',
    notSignedInText: 'Nicht angemeldet',
    welcomeText: 'Willkommen',
    signOutText: 'Abmelden',
    topicsTitle: 'Angebote nach Thema',
    loadError: {
        title: 'Startseite konnte nicht geladen werden',
        description: 'Der Inhalt der Startseite konnte nicht geladen werden. Bitte versuchen Sie es erneut.',
    },
    topicsLoadError: {
        title: 'Themen konnten nicht geladen werden',
        description: 'Die Themenliste konnte nicht geladen werden. Bitte versuchen Sie es erneut.',
    },
};
