import * as React from 'react';
import { X } from 'lucide-react';
import { SkillItemProps } from './types';
import {Button} from '../button';

interface SkillItemExtendedProps extends SkillItemProps {
  onRemove: (name: string) => void; 
}

export const SkillItem: React.FC<SkillItemExtendedProps> = ({ name, onRemove }) => (
  <div className="flex items-start self-stretch my-auto">
    <div className="flex gap-1 justify-center items-center rounded-md bg-base-neutral-800 text-text-primary">
      <div className="self-stretch my-auto">{name}</div>
      <Button
        variant="text" size="medium"
        onClick={() => onRemove(name)}
        className=" focus:outline-none "
      >
        <X size={20} />
      </Button>
    </div>
  </div>
);
