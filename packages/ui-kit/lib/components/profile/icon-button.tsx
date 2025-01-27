import { FC, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import { RefreshCcw } from 'lucide-react';

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'big' | 'huge';
  styles?: 'primary' | 'secondary' | 'text';
  disabled?: boolean;
  icon?: React.ElementType;
}

const sizeMap = {
  small: {
    button: 'w-[32px] h-[32px] rounded-small',
    icon: 'w-[24px] h-[24px]',
  },
  medium: {
    button: 'w-[40px] h-[40px] rounded-medium',
    icon: 'w-[24px] h-[24px]',
  },
  big: { button: 'w-[56px] h-[56px] rounded-big', icon: 'w-[32px] h-[32px]' },
  huge: { button: 'w-[72px] h-[72px] rounded-huge', icon: 'w-[40px] h-[40px]' },
};

const colorMap = {
  primary: {
    default:
      'bg-button-primary-fill text-button-primary-text hover:bg-button-primary-hover-fill active:bg-button-primary-pressed-fill',
    disabled: 'opacity-50 bg-button-primary-fill text-button-primary-text',
  },
  secondary: {
    default:
      'bg-button-secondary-fill border-[1px] border-button-secondary-stroke hover:border-button-secondary-hover-stroke active:border-button-secondary-pressed-stroke text-button-secondary-text hover:text-button-secondary-hover-text active:text-button-secondary-pressed-text',
    disabled:
      'opacity-50 bg-button-secondary-fill border-[1px] border-button-secondary-stroke text-button-secondary-text',
  },
  text: {
    default:
      'text-button-text-text hover:text-button-text-hover-text active:text-button-text-pressed-text',
    disabled: 'opacity-50 text-button-text-text',
  },
};

export const IconButton: FC<IconButtonProps> = ({
  size = 'big',
  styles = 'primary',
  disabled = false,
  className,
  icon: Icon = RefreshCcw,
  onClick,
  ...props
}) => {
  const buttonSize = sizeMap[size].button;
  const iconSize = sizeMap[size].icon;

  const buttonClasses = clsx(
    'flex items-center justify-center transition-all duration-200',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    buttonSize,
    colorMap[styles][disabled ? 'disabled' : 'default'],
    className,
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <Icon className={iconSize} strokeWidth={3} data-testid="icon" />
    </button>
  );
};
