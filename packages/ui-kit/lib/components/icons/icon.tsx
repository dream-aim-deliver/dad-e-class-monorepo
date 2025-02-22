import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface IconProps {
  classNames?: string;
  fill?: string;
  size?: string;
}

const sizeMap: Record<string, string> = {
  '4': 'h-4 w-4',
  '5': 'h-5 w-5',
  '6': 'h-6 w-6',
  '8': 'h-8 w-8',
  '10': 'h-10 w-10',
  '12': 'h-12 w-12',
};

export const generateClassesForIcon = ({
  classNames,
  fill,
  size = '6',
}: IconProps) => {
  const sizeClass = sizeMap[size];

  return twMerge(
    sizeClass,
    'fill-current',
    clsx(fill && `text-${fill}`),
    classNames,
  );
};
