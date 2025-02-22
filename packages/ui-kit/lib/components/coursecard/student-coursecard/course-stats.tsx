import * as React from "react";
import { Languages , MessagesSquare , Clock3, Receipt } from "lucide-react";

interface StatItemProps {
  icon: React.ReactNode;
  text: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, text }) => (
  <div className="flex gap-1 items-center whitespace-nowrap">
    {icon}
    <span className="text-stone-300">{text}</span>
  </div>
);

interface CourseStatsProps {
  language: string;
  sessions: number;
  duration: string;
  sales: number;
}

export const CourseStats: React.FC<CourseStatsProps> = ({
  language,
  sessions,
  duration,
  sales,
}) => {
  const stats = [
    {
      icon: <Languages className="w-4 h-4 text-stone-300" />,
      text: language,
    },
    {
      icon: <MessagesSquare className="w-4 h-4 text-stone-300" />,
      text: `${sessions} coaching sessions`,
    },
    {
      icon:  <Clock3 className="w-4 h-4 text-stone-300" />,
      text: duration,
    },
    {
      icon:  <Receipt className="w-4 h-4 text-stone-300" />,
      text: `${sales} sales`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 mt-2 text-sm sm:flex sm:flex-wrap sm:gap-3.5">
      {stats.map((stat, index) => (
        <StatItem key={index} {...stat} />
      ))}
    </div>
  );
};
