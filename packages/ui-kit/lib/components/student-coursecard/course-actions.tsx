import {Badge} from "../badge";
import {Button} from "../button";
import { Check } from "lucide-react";
import * as React from "react";

interface CourseActionsProps {
  onBegin?: () => void;
  onResume?: () => void;
  onReview?: () => void;
  onDetails?: () => void;
  progress?: number;
  studyProgress?: 'yet-to-start' | 'in-progress' | 'completed';
}

export const CourseActions: React.FC<CourseActionsProps> = ({
  onBegin,
  onResume,
  onReview,
  onDetails,
  progress,
  studyProgress
}) => {
  if (studyProgress === 'completed') {
    return (
      <div className="flex flex-col gap-4">
        <Badge className="flex items-center gap-1 px-3 py-1 rounded-lg w-fit" variant={"successprimary"} size={"big"}><Check /> Course completed </Badge>
        <div className="flex flex-col gap-2">
          <Button className="" variant={"primary"} size={"medium"} onClick={onReview}>Review</Button>
          <Button className="" variant={"secondary"} size={"medium"} onClick={onDetails}>Details</Button>
        </div>
      </div>
    );
  } else if(studyProgress === 'in-progress') {
    return (
      <Button
      onClick={onResume} className="w-full p-3" variant={"primary"} size={"medium"}> Resume </Button>
    )
  }

  return (
    <Button
      onClick={onBegin} className="w-full p-3" variant={"primary"} size={"medium"}> Begin course </Button>
  );
};
