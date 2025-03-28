import { Home_DE } from '../pages/home/home-de';
import { Login_DE } from '../pages/login/login-de';
import { SSO_DE } from '../pages/sso/sso-de';


import { TDictionary } from './base';
export const DE: TDictionary = {
  home: Home_DE,
  login:Login_DE,
  sso: SSO_DE,
  components: {
    skills: {
      title: 'Fähigkeiten',
    },
    courseCard: {
      createdBy: 'Erstellt von',
      you: 'Sie',
      group: 'Gruppe',
      manageButton: 'Verwalten',
      editCourseButton: 'Kurs bearbeiten',
      beginCourseButton: 'Kurs beginnen',
      resumeCourseButton: 'Fortsetzen',
      reviewCourseButton: 'Überprüfen',
      detailsCourseButton: 'Einzelheiten',
      publishedBadge: 'Veröffentlichung',
      underReviewBadge: 'In Bearbeitung',
      buyButton: 'Kaufen',
      fromButton: 'von',
      draftBadge: 'Entwurf',
      completedBadge: 'Kurs abgeschlossen',
      cochingSession: 'Coaching-Sitzung',
      sales: 'Verkauf',
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
    generalCard: {
      buttonText: 'Das richtige Angebot finden',
      placeHolderText: 'Kein Bild verfügbar',
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
    availableCoachingSessions: {
      title: 'Verfügbare Coaching-Sitzungen',
      buyMoreSessions: 'Kaufen Sie mehr Sitzungen',
      durationMinutes: 'Minuten',
      loadingText: 'Sitzungen werden geladen...',
      noAvailableSessionText: 'Keine verfügbaren Sitzungen',
    },
    coachReview:{
      by:'von'
    },
    coachCard:{
      coachingSession: "Coaching-Sitzung",
      teaches: "Lehrt",
      viewProfile: "Profil ansehen",
      bookSession: "Sitzung buchen",
    },
    buyCoachingSession: {
      title: "Coaching-Sitzung kaufen",
      description: "Plane deine Sitzungen jederzeit mit deinem Lieblingscoach.",
      buttonText: "Coaching-Sitzungen kaufen",
      total: "Gesamt",
      minutes: "Minuten"
    },
    richTextToolbar:{
      paragraph: "Absatz",
      bold: "Fett (Strg+B)",
      italic: "Kursiv (Strg+I)",
      underline: "Unterstrichen (Strg+U)",
      undo: "Rückgängig (Strg+Z)",
      redo: "Wiederholen (Strg+Y)",
      link: "Link einfügen",
      strikethrough: "Durchgestrichen",
      superscript: "Hochgestellt",
      subscript: "Tiefgestellt",
      highlight: "Hervorheben",
      code: "Code",
      leftAlign:"Links ausrichten",
      centerAlign:"Zentriert ausrichten",
      rightAlign:"Rechts ausrichten",
      justifyAlign:"Blocksatz",
      blockQuote:"Zitat",
      numberedList:"Nummerierte Liste",
      bulletedList:"Aufzählungsliste",
      unlink:"Link entfernen"
    },
    coachingOnDemandBanner: {
      noImageText: 'Kein Bild verfügbar',
    },
    navbar: {
      workspace: 'Arbeitsbereich',
      login: 'Anmelden',
    },
  },
};
