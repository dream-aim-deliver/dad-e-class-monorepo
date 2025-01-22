import { FC, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import { RefreshCcw } from 'lucide-react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'big' | 'huge';
  styles?: 'primary' | 'secondary' | 'text';
  disabled?: boolean;
  icon?: React.ElementType;
}

const sizeMap = {
  small: { button: 'w-[32px] h-[32px] rounded-lg', icon: 'w-[24px] h-[24px]' },
  medium: { button: 'w-[40px] h-[40px] rounded-lg', icon: 'w-[24px] h-[24px]' },
  big: { button: 'w-[56px] h-[56px] rounded-xl', icon: 'w-[32px] h-[32px]' },
  huge: { button: 'w-[72px] h-[72px] rounded-2xl', icon: 'w-[40px] h-[40px]' },
};

const colorMap = {
  primary: {
    default: 'bg-primary text-black hover:bg-button-hover active:bg-button-pressed',
    disabled: 'opacity-50 bg-primary text-black',
  },
  secondary: {
    default: 'border-2 border-primary hover:border-button-hover active:border-button-pressed text-primary hover:text-button-hover active:text-button-pressed',
    disabled: 'opacity-50 border-2 border-primary text-primary',
  },
  text: {
    default: 'text-primary hover:text-button-hover active:text-button-pressed',
    disabled: 'opacity-50 text-primary',
  },
};

const IconButton: FC<IconButtonProps> = ({
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
    className
  );

  return (
    <button className={buttonClasses} disabled={disabled} onClick={onClick} {...props}>
      <Icon className={iconSize} strokeWidth={3} data-testid="icon"/>
    </button>
  );
};

export default IconButton;
