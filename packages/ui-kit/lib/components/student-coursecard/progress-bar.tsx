import * as React from "react";

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <div className="flex items-center gap-4 mt-4 w-full">
    <div className="flex-1 h-2 bg-stone-950 rounded-md">
      <div
        className="h-full bg-primary rounded-md transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
    <span className="text-sm text-stone-300">{progress}%</span>
  </div>
);