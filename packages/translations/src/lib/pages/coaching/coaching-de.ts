import { TDictionary } from '../../dictionaries/base';

export const Coaching_DE: TDictionary['pages']['coaching'] = {
  filterByTopic: 'Suche nach Thema / Fähigkeit',
  chooseCategory: 'Was ist dein Ziel?',
  noCoachesFound: 'Keine Coaches gefunden',
  briefingTitle: 'Briefing für deinen Coach (erforderlich)',
  briefingTitleOptional: 'Briefing für deinen Coach (optional)',
  briefingDescription: 'Damit sich dein Coach auf die Session vorbereiten kann.',
  briefingButtonText: 'Coach briefen',
  briefingPlaceholder: 'Ziel: Was möchtest du erreichen?\nHintergrund: Dein aktueller Stand oder deine Situation\nErgebnis: Was soll nach der Session klarer sein?',
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
