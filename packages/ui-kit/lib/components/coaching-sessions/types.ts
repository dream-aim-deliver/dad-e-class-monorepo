export interface TimeInfoProps {
  date: string;
  time: string;
}

export interface ReviewCardProps {
  text: string;
  onClick: () => void;
  rating: number;
  hasCallQualityRating: boolean;
  readMore: string;
}

export interface CreatorInfoProps {
  creatorName: string;
  courseName: string;
  groupName: string;
  userRole: string;
  withinCourse: boolean;
  groupSession: boolean;
  createdBy: string;
  student: string;
  course: string;
  group: string;
}
