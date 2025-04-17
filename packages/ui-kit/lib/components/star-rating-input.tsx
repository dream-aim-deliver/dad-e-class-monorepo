import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingInputProps {
  totalStars?: number;
  size?: number;
  type: 'range' | 'single';
  onChange: (value: { min?: number; max?: number; single?: number }) => void;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({
  totalStars = 5,
  size = 16,
  type,
  onChange,
}) => {
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(0);
  const [singleRating, setSingleRating] = useState(0);

  const handleRatingChange = (index: number, isMin: boolean) => {
    if (type === 'range') {
      if (isMin) {
        const newMinRating = index + 1;
        setMinRating(newMinRating);
        onChange({ min: newMinRating, max: maxRating });
      } else {
        const newMaxRating = index + 1;
        setMaxRating(newMaxRating);
        onChange({ min: minRating, max: newMaxRating });
      }
    } else {
      const newSingleRating = index + 1;
      setSingleRating(newSingleRating);
      onChange({ single: newSingleRating });
    }
  };

  const renderStars = (selectedRating: number, isMin?: boolean) => {
    return [...Array(totalStars)].map((_, index) => (
      <div
        key={index}
        onClick={() => handleRatingChange(index, isMin ?? false)}
        className="relative cursor-pointer"
        style={{ width: size, height: size }}
      >
        <Star
          data-testid="star-icon"
          size={size}
          className={`absolute text-button-primary-fill`}
          strokeWidth={2}
        />
        <div
          style={{
            width: index < selectedRating ? '100%' : '0%',
          }}
          className="absolute h-full overflow-hidden"
        >
          <Star
            size={size}
            className={`text-button-primary-fill fill-button-primary-fill hover:text-button-primary-hover-fill`}
            strokeWidth={2}
          />
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col gap-4">
      {type === 'range' ? (
        <>
          <div className="flex gap-1">{renderStars(minRating, true)}</div>
          <div className="flex gap-1">{renderStars(maxRating, false)}</div>
        </>
      ) : (
        <div className="flex gap-1">{renderStars(singleRating)}</div>
      )}
    </div>
  );
};

export default StarRatingInput;
