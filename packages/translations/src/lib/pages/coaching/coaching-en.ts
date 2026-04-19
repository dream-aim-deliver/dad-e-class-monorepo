import { TDictionary } from "../../dictionaries/base";

export const Coaching_EN: TDictionary["pages"]["coaching"] = {
  filterByTopic: "Search by Topic / Skill",
  chooseCategory: "What's your goal?",
  noCoachesFound: "No coaches found",
  briefingTitle: "Brief your coach (required)",
  briefingTitleOptional: "Brief your coach (optional)",
  briefingDescription: "So your coach can prepare.",
  briefingButtonText: "Prep your coach",
  briefingPlaceholder: "Goal: What do you want to achieve?\nBackground: Your current level or situation\nOutcome: What should be clearer after the session?",
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
    standaloneDescription: "Browse the coach's availability and click a time slot to book it. You'll be asked to pick one of your available standalone coaching sessions and write a short briefing so your coach can prepare. Course coaching sessions shown below must be booked from within their course lesson.",
    courseDescription: "Select an available time slot on the calendar to schedule the coaching session for your course lesson. You'll be asked to provide a short briefing so your coach can prepare.",
  },
  error: {
    title: "Failed to Load Coaching",
    description: "Unable to load coaching information. Please refresh the page or try again later.",
  },
}
