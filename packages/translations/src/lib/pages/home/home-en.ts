import { TDictionary } from "../../dictionaries/base";

export const Home_EN: TDictionary["pages"]["home"] = {
    title: 'Welcome to the app',
    buttonText: 'Click me',
    badgeText: 'Badge',
    signInButtonText: 'Sign in',
    notSignedInText: 'Not signed in',
    welcomeText: 'Welcome',
    signOutText: 'Sign out',
    topicsTitle: 'Offers by topic',
    loadError: {
        title: 'Unable to load home page',
        description: 'We couldn\'t load the home page content. Please try again.',
    },
    topicsLoadError: {
        title: 'Unable to load topics',
        description: 'We couldn\'t load the topics list. Please try again.',
    },
};
