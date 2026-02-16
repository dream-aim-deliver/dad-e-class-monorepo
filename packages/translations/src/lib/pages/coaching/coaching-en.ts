import { TDictionary } from "../../dictionaries/base";

export const Coaching_EN: TDictionary["pages"]["coaching"] = {
  filterByTopic: "Search by Topic / Skill",
  chooseCategory: "What's your goal?",
  noCoachesFound: "No coaches found",
  briefingTitle: "Required: Brief your coach before the session",
  briefingDescription: "When booking your session, please brief your coach so they can tailor the coaching to your needs. Include the following:",
  briefingMotivation: "Motivation: Why are you booking the session and what would you like to work on?",
  briefingSkills: "Skills: Which skills or tools you already use, your current level (Beginner, Intermediate, Advanced), and where you want to grow.",
  briefingOutcome: "Outcome: What result or outcome you'd like to achieve by the end of the session.",
  briefingButtonText: "Prep your coach",
  briefingPlaceholder: "Enter your briefing here...",
  shortNoticeWarning: {
    title: "Short Notice Booking",
    description: "You are requesting a session with less than {hours} hours notice. Your coach may not see this request in time. Consider selecting a later time slot for a higher chance of confirmation.",
  },
  notAvailableToday: {
    title: "Not available today",
    description: "Next available slot: {date}",
    goToDate: "Jump to {date}",
  },
  bookingHelp: {
    standaloneDescription: "Browse the coach's availability on the calendar and select a time slot that works for you. You'll need to choose one of your available coaching sessions and provide a short briefing so your coach can prepare.",
    courseDescription: "Select an available time slot on the calendar to schedule the coaching session for your course lesson. You'll be asked to provide a short briefing so your coach can prepare.",
  },
  error: {
    title: "Failed to Load Coaching",
    description: "Unable to load coaching information. Please refresh the page or try again later.",
  },
}
