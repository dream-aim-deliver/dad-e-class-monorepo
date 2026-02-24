import { TDictionary } from "../../dictionaries/base";

export const Offers_EN: TDictionary["pages"]["offers"] = {
  filterByTopic: "Filter by topic",
  chooseCategory: "What's your goal?",
  ourCourses: "Our Offers",
  ourPackages: "Our Packages",
  coachingIncluded: "Coaching Included",
  coachingOnDemand: "Coaching on demand",
  haveNotFound: "Haven't found what you're looking for?",
  coursesNotFound: {
    title: "No offers found",
    description: "We couldn’t find any offers matching your criteria. Try adjusting your filters – or tell us what you’d like to see. We’d love your feedback!",
  },
  coachesNotFound: {
    title: "No coaches found",
    description: "No coaches found for the selected topics. Try adjusting your filters.",
  },
  coachesNotFoundGuest: {
    title: "No coaches found",
    description: "Please create an account to browse all available coaches.",
  },
  packagesNotFound: {
    title: "No packages found",
    description: "There are currently no packages available. Please check back soon.",
  },
  loadError: {
    title: "Failed to Load Offers",
    description: "Unable to load offers. Please refresh the page or try again later.",
  },
}
