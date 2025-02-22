/**
 * A ProgressBar component that can function as either a slider or a progress indicator.
 * @param type Determines the behavior of the component ('slider' allows user interaction, 'progress' is read-only).
 * @param progress The current progress value.
 * @param totalProgress The maximum progress value.
 * @param onChange Callback function triggered when the slider value changes.
 * @returns A styled progress bar or slider component.
 */
import { useState } from 'react';

export interface ProgressBarProps {
  type?: 'slider' | 'progress'; // Determines behavior
  progress?: number; // Current progress value
  totalProgress?: number; // Maximum progress value
  onChange?: (value: number) => void; // Callback for slider
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  type = 'progress',
  progress = 10,
  totalProgress = 100,
  onChange,
}) => {
  const [value, setValue] = useState(progress);

  /**
   * Handles changes to the slider input.
   * @param event The input change event.
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  const progressPercentage = (value / totalProgress) * 100;

  return (
    <div className="flex flex-col items-center justify-center w-full h-20">
      <div className="relative w-full">
        {/* Slider track */}
        <div className="absolute top-1/2 h-3 w-full rounded-small bg-slider-background-fill border-[1px] border-slider-background-stroke transform -translate-y-1/2"></div>

        {/* Filled progress */}
        <div
          className="absolute top-1/2 h-3 bg-slider-progress-fill border-[1px] border-slider-progress-stroke rounded-small transform -translate-y-1/2"
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
