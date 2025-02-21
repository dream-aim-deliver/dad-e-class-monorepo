import {Button} from "../button";
import * as React from "react";
import { Briefcase} from "lucide-react";
interface CourseCreatorProps {
  creatorName: string;
}

export const CourseCreator: React.FC<CourseCreatorProps> = ({ creatorName }) => (
  <div className="flex flex-wrap items-center gap-2 mt-2 min-h-[32px]">
    <div className="flex items-center gap-1 text-sm text-stone-300">
      <Briefcase />
      <span>Created by</span>
    </div>
    <div className="flex items-center gap-1 px-2 py-1  rounded-md">
      <img
        src="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1727665998/anxious-people-under-stress_01_8_ts6dma.png"
        alt=""
        className="w-6 h-6"
      />
      {/* <span>{creatorName}</span> */}
      <Button variant={"text"} size={"small"}> {creatorName}</Button>
    </div>
  </div>
);

