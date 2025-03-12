"use client";
import React, { useEffect } from 'react';
import { useState } from 'react';

export interface ProgressBarProps {
  type?: 'slider' | 'progress'; // Determines behavior
  progress?: number; // Current progress value
  totalProgress?: number; // Maximum progress value
  onChange?: (value: number) => void; // Callback for slider
}

/**
 * A customizable ProgressBar component that can function as either a static progress indicator or an interactive slider.
 *
 * @param type The type of progress bar. Options:
 *   - `progress`: Displays a static progress indicator (default).
 *   - `slider`: Renders an interactive slider with a draggable handle.
 * @param progress The current progress value, between 0 and totalProgress. Defaults to `10`.
 * @param totalProgress The maximum progress value. Defaults to `100`.
 * @param onChange Optional callback function triggered when the slider value changes (only applicable when type is 'slider'). Receives the new `value` as an argument.
 *
 * @example
 * <ProgressBar
 *   type="slider"
 *   progress={50}
 *   totalProgress={100}
 *   onChange={(value) => console.log("Progress changed to:", value)}
 * />
 *
 * @example
 * <ProgressBar
 *   type="progress"
 *   progress={75}
 *   totalProgress={100}
 * />
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  type = 'progress',
  progress = 10,
  totalProgress = 100,
  onChange,
}) => {
  const [value, setValue] = useState(progress);
  useEffect( () => setValue(progress), [progress] )
 
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  const progressPercentage = (value / totalProgress) * 100;

  return (
    <div
      role="progressbar"
      className="flex flex-col items-center justify-center w-full"
    >
      <div className="relative w-full">
        {/* Slider track */}
        <div className="absolute top-1/2 h-2 w-full rounded-small bg-base-neutral-950 transform -translate-y-1/2"></div>

        {/* Filled progress */}
        <div
          className="absolute top-1/2 h-2 bg-slider-progress-fill  rounded-small transform -translate-y-1/2"
          style={{ width: `${progressPercentage}%` }}
        ></div>

        {/* Slider input (only if type is 'slider') */}
        {type === 'slider' && (
          <>
            <input
              type="range"
              min={0}
              max={totalProgress}
              value={value}
              onChange={handleChange}
              className="absolute w-full opacity-0 cursor-pointer"
            />

            {/* Custom handle */}
            <div
              className="absolute top-1/2 w-5 h-5 bg-slider-knob-fill border-[1px] border-slider-progress-stroke rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${progressPercentage}%` }}
            ></div>
          </>
        )}
      </div>
    </div>
  );
};
