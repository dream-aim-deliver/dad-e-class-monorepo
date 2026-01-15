import { TDictionary } from '../../dictionaries/base';

export const CheckoutReturn_DE: TDictionary['pages']['checkoutReturn'] = {
    loading: {
        processing: 'Deine Zahlung wird verarbeitet...',
    },
    error: {
        title: 'Zahlungsfehler',
        checkCardWarning: 'Bitte überprüfe deinen Kontoauszug, ob deine Karte belastet wurde.',
        transactionDetails: 'Transaktionsdetails',
        sessionId: 'Sitzungs-ID:',
        paymentIntentId: 'Zahlungs-ID:',
        customerEmail: 'E-Mail:',
        amount: 'Betrag:',
        items: 'Artikel:',
        purchaseInfo: 'Kaufinformationen:',
        timestamp: 'Zeit:',
        needHelp: 'Brauchst du Hilfe?',
        contactInstructions: 'Bitte kontaktiere uns mit den obigen Details und gib folgendes an:',
        includeEmail: 'Deine E-Mail-Adresse, die für den Kauf verwendet wurde',
        includeDescription: 'Eine kurze Beschreibung des Problems',
        email: 'E-Mail:',
        phone: 'Telefon:',
        tryAgain: 'Erneut versuchen',
        backToDashboard: 'Zurück zum Dashboard',
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
