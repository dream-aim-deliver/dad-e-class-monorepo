import { TDictionary } from '../../dictionaries/base';

export const Coaching_DE: TDictionary['pages']['coaching'] = {
  filterByTopic: 'Suche nach Thema / Fähigkeit',
  chooseCategory: 'Was ist dein Ziel?',
  noCoachesFound: 'Keine Coaches gefunden',
  briefingTitle: 'Pflichtangabe: Briefe deinen Coach vor der Session',
  briefingDescription: 'Wenn du deine Session buchst, bitte briefe deinen Coach, damit er das Coaching optimal auf deine Bedürfnisse abstimmen kann. Gib Folgendes an:',
  briefingMotivation: 'Motivation: Warum buchst du die Session und woran möchtest du arbeiten?',
  briefingSkills: 'Skills: Welche Fähigkeiten oder Tools nutzt du bereits, auf welchem Niveau (Beginner, Intermediate, Advanced) bist du, und wo möchtest du dich weiterentwickeln?',
  briefingOutcome: 'Ziel: Welches Ergebnis oder welchen Output möchtest du am Ende der Session erreichen?',
  briefingButtonText: 'Coach briefen',
  briefingPlaceholder: 'Gib hier dein Briefing ein...',
  shortNoticeWarning: {
    title: 'Kurzfristige Buchung',
    description: 'Du buchst eine Session mit weniger als {hours} Stunden Vorlaufzeit. Dein Coach sieht diese Anfrage möglicherweise nicht rechtzeitig. Wähle einen späteren Termin für eine höhere Bestätigungswahrscheinlichkeit.',
  },
  notAvailableToday: {
    title: 'Heute nicht verfügbar',
    description: 'Nächster verfügbarer Termin: {date}',
    goToDate: 'Zum {date} springen',
  },
  bookingHelp: {
    standaloneDescription: 'Durchsuche die Verfügbarkeit des Coaches im Kalender und wähle einen passenden Zeitslot aus. Du musst eine deiner verfügbaren Coaching-Sessions auswählen und ein kurzes Briefing abgeben, damit sich dein Coach vorbereiten kann.',
    courseDescription: 'Wähle einen verfügbaren Zeitslot im Kalender, um die Coaching-Session für deine Kurslektion zu planen. Du wirst gebeten, ein kurzes Briefing abzugeben, damit sich dein Coach vorbereiten kann.',
  },
  error: {
    title: 'Coaching konnte nicht geladen werden',
    description: 'Die Coaching-Informationen konnten nicht geladen werden. Bitte aktualisieren Sie die Seite oder versuchen Sie es später erneut.',
  },
};
