import * as React from 'react';
import { X } from 'lucide-react';
import { SkillItemProps } from './types';
import { Button } from '../button';

export interface SkillItemExtendedProps extends SkillItemProps {
  onRemove: (name: string) => void;
}

export const SkillItem: React.FC<SkillItemExtendedProps> = ({
  name,
  onRemove,
}) => (
  <div
    className="flex items-start self-stretch my-auto"
    id="skill-item-container"
  >
    <div
      className="flex gap-1 justify-center items-center rounded-md bg-base-neutral-800 text-text-primary"
      id="skill-item-content"
    >
      <div className="self-stretch my-auto" id="skill-name">
        {name}
      </div>
      <div id="remove-button-container">
        <Button
          variant="text"
          size="medium"
          onClick={() => onRemove(name)}
          className="focus:outline-none"
        >
          <X size={20} />
        </Button>
      </div>
    </div>
  </div>
);
