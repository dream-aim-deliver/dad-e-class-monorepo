import { TDictionary } from '../../dictionaries/base';

export const Offers_DE: TDictionary['pages']['offers'] = {
  filterByTopic: 'Nach Thema filtern',
  chooseCategory: 'Was ist dein Ziel?',
  ourCourses: 'Unsere Angebote',
  ourPackages: 'Unsere Pakete',
  coachingIncluded: 'Coaching inklusive',
  coachingOnDemand: 'Coaching bei Bedarf',
  haveNotFound: 'Noch nicht gefunden, wonach du suchst?',
  coursesNotFound: {
    title: "Keine Angebote gefunden",
    description: "Wir konnten keine passenden Angebote finden. Passe deine Filter an – oder sag uns, was dir fehlt. Wir freuen uns auf dein Feedback.", // Fixed typo: 'freunen' → 'freuen'
  },
  coachesNotFound: {
    title: "Keine Coaches gefunden",
    description: "Keine Coaches für die ausgewählten Themen gefunden. Passe deine Filter an.",
  },
  coachesNotFoundGuest: {
    title: "Keine Coaches gefunden",
    description: "Bitte erstelle ein Konto, um alle verfügbaren Coaches zu sehen.",
  },
  packagesNotFound: {
    title: "Keine Pakete gefunden",
    description: "Momentan sind keine Pakete verfügbar. Schau bald wieder vorbei.",
  },
  loadError: {
    title: "Angebote konnten nicht geladen werden",
    description: "Die Angebote konnten nicht geladen werden. Bitte aktualisieren Sie die Seite oder versuchen Sie es später erneut.",
  },
};
