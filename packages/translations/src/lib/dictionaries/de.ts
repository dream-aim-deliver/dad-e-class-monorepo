import { Home_DE } from '../pages/home/home-de';
import { TDictionary } from './base';
export const DE: TDictionary = {
  home: Home_DE,
  components: {
    coachBanner: {
      title: 'Teilen Sie Ihre Fähigkeiten und verdienen',
      subtitle: 'Starte Coaching jetzt',
      description: 'Möchten Sie Ihr Fachwissen mit Leidenschaft weitergeben und anderen dabei helfen, ihre Karriere voranzutreiben und gleichzeitig Geld zu verdienen? Treten Sie unserer Coach-Community bei und leisten Sie einen echten Beitrag – ob Sie nun Ihren eigenen Kurs erstellen oder Einzelcoaching anbieten möchten, Sie haben die Freiheit zu entscheiden, wie Sie beitragen und sich weiterentwickeln. Wagen Sie den Sprung und verwandeln Sie Ihre Fähigkeiten noch heute in eine lohnende Chance!',
      buttontext: 'Coach werden',
    },
    skills: {
      title: 'Fähigkeiten',
    },
    dragDrop: {
      title: 'Legen Sie die Dateien hier ab... ',
      buttontext: 'Klicken zum Hochladen',
      dragtext: 'oder Datei ziehen & ablegen',
      filesize: 'Maximale Dateigröße',
      uploading: 'Hochladen..',
      cancelUpload: 'Upload abbrechen',
    },
    profileTab: {
      personal: 'Persönlich',
      professional: 'Beruflich',
    },
    languageSelector: {
      title: 'Fließend gesprochene Sprachen (C1 und höher)',
      choosetext: '',
      interface: 'Oberflächensprache',
      chooseLanguage: 'Sprache wählen',
      chooseColor: 'Farbe wählen',
      chooseOptions: 'Optionen wählen',
      english: 'Englisch',
      german: 'Deutsch',
    },

    profileInfo: {
      title: 'E-Klasse Plattform',
      name: 'Name',
      namePlaceholder: 'Johann',
      surname: 'Nachname',
      surnamePlaceholder: 'Doe',
      email: 'E-Mail',
      emailPlaceholder: 'johndoe@gmail.com',
      phoneNumber: 'Telefonnummer',
      phoneNumberPlaceholder: '+44 1234567890',
      password: 'Passwort',
      changePassword: 'Passwort ändern',
      date: 'Datum',
      checkboxtext1: 'Ich handle im Namen eines Unternehmens',
      companyName: 'Firmenname',
      companyNamePlaceholder: 'e.g. Acme',
      companyUID: 'Company UID (VAT) (optional)',
      companyUIDPlaceholder: 'e.g. CHE123456789',
      address: 'Adresse',
      addressPlaceholder: 'Hermetschloostrasse 70, 8048 Zürich',
      profilePicture: 'Profilbild',
      platformPreferences: 'Plattformpräferenzen',
      platformPP: 'Fließend gesprochene Sprachen (C1 und höher)',
      interfaceLang: 'Oberflächensprache',
      checkboxtext2: 'Newsletter erhalten',
      buttontext1: 'Verwerfen',
      buttontext2: 'Änderungen speichern',
    },
    professionalInfo: {
      title: 'Berufliche Informationen',
      bio: 'Biografie (max. 280 Zeichen)',
      bioPlaceholder:
        'Eine überzeugende Biografie hilft Ihnen, sich von anderen Coaches abzuheben. Dies wird für alle Studierenden sichtbar sein.',

      linkedinUrl: 'LinkedIn-URL',
      linkedinPlaceholder: 'https://www.linkedin.com/company/bewerbeagentur/',

      curriculumVitae: 'Lebenslauf (CV)',
      portfolioWebsite: 'Portfolio-Webseite-URL (optional)',
      portfolioWebsitePlaceholder: 'https://wimlanz.ch/',

      associatedCompanyName: 'Firmenname (optional)',
      associatedCompanyNAMEPlaceholder: 'Bewerbeagentur',
      associatedCompanyRole: 'Position (optional)',
      associatedCompanyPlaceholder: 'Senior DevOps Engineer',
      associatedCompanyIndustry: 'Branche (optional)',
      associatedCompanyIndustryPlaceholder: 'z. B. Informationstechnologie',

      skills: 'Ihre Fähigkeiten',
      addSkills: 'Fähigkeiten hinzufügen',
      privateProfile:
        'Privates Profil (nur registrierte Benutzer können Ihren Namen, Nachnamen und Ihre Biografie sehen)',
      buttontext1: 'Verwerfen',
      buttontext2: 'Änderungen speichern',
    },
    courseCard: {
      courseEmptyState: {
        message: 'Sie haben noch keine Kurse gekauft',
        buttonText: 'Kurse kaufen',
      },
    },
  },
};
