import { TDictionary } from '../../dictionaries/base';

export const CheckoutReturn_DE: TDictionary['pages']['checkoutReturn'] = {
    loading: {
        processing: 'Deine Zahlung wird verarbeitet...',
    },
    error: {
        title: 'Zahlungsfehler',
        needHelp: 'Brauchst du Hilfe?',
        email: 'E-Mail:',
        phone: 'Telefon:',
        tryAgain: 'Erneut versuchen',
        backToCheckout: 'Zurück zur Kasse',
    },
    success: {
        title: 'Zahlung erfolgreich!',
        confirmationEmailSent: 'Bestätigungs-E-Mail gesendet an',
        transactionReceipt: 'Transaktionsbeleg',
        transactionId: 'Transaktions-ID:',
        amount: 'Betrag:',
        alreadyProcessed:
            'Dieser Kauf wurde bereits verarbeitet und freigeschaltet.',
        purchaseUnlocked:
            'Dein Kauf wurde freigeschaltet und ist jetzt verfügbar.',
        redirectingIn: 'Weiterleitung in {countdown} Sekunden...',
    },
    actions: {
        goToCourse: 'Zum Kurs',
        viewMyCourses: 'Meine Kurse ansehen',
        browseOfferings: 'Angebote durchsuchen',
        bookSession: 'Sitzung buchen',
        continue: 'Weiter',
    },
};
