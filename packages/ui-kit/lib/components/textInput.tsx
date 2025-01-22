import { FC, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle2, AlertTriangle, Search, Calendar } from 'lucide-react';
import IconButton from "./iconButton"


type InputType = 'text' | 'textarea' | 'search' | 'date';
type InputVariant = 'default' | 'warning' | 'error' | 'success';
type InputElementType = HTMLInputElement | HTMLTextAreaElement;

interface IconButtonConfig {
  show?: boolean;
  className?: string;
  customSize?: { button: string; icon: string };
  variant?: 'primary' | 'secondary' | 'text';
  color?: 'default' | 'hover' | 'pressed' | 'disabled';
  children?: ReactNode;
}

interface BaseInputProps {
  label?: string;
  value?: string; 
  onChange?: React.ChangeEventHandler<InputElementType>;
  inputType?: InputType;
  variant?: InputVariant;
  feedback?: string;
  primary?: boolean;
  leftIconButton?: IconButtonConfig;
  rightIconButton?: IconButtonConfig;
  outerClassName?: string;
  innerClassName?: string;
  labelClassName?: string;
}

type InputProps = BaseInputProps &
  Omit<InputHTMLAttributes<InputElementType>, 'type'> & {
    className?: string;
  };

const Input: FC<InputProps> = ({
  label,
  inputType = 'text',
  variant = 'default',
  value,
  onChange,
  feedback,
  primary = false,
  leftIconButton ,
  rightIconButton ,
  placeholder,
  className,
  outerClassName,
  innerClassName,
  labelClassName,
  ...props
}) => {
  const defaultSizes = {
    outer: inputType === 'textarea' ? 'w-full h-[104px] rounded-medium border' : 'w-full h-[40px] rounded-medium border',
    inner: inputType === 'textarea' ? 'w-full h-[90px] placeholder:text-text-secondary' : 'w-full h-[24px]',
    label: 'w-full h-[22px]',
    iconButton: {
      button: ' h-[24px]',
      icon: ' h-[12px]'
    }
  };

  const variantMap = {
    default: {
      outer: 'border-input-stroke',
      inner: 'text-text-secondary placeholder:text-text-secondary',
      feedback: 'text-input-stroke'
    },
    warning: {
      outer: 'border-feedback-warning-primary',
      inner: 'text-text-secondary placeholder:text-text-secondary',
      feedback: 'text-feedback-warning-primary'
    },
    error: {
      outer: 'border-feedback-error-primary',
      inner: 'text-text-secondary placeholder:text-text-secondary',
      feedback: 'text-feedback-error-primary'
    },
    success: {
      outer: 'border-feedback-success-primary',
      inner: 'text-text-secondary placeholder:text-text-secondary',
      feedback: 'text-feedback-success-primary'
    }
  };

  const outerClasses = clsx(
    'relative flex items-center outline-none focus:ring-0 px-[12px] py-[10px] bg-input-fill border border-input-stroke text-md',
    defaultSizes.outer,
    variantMap[variant].outer,
    primary,
    outerClassName,
    className
  );

  const inputClasses = clsx(
    'bg-input-fill w-full outline-none text-md placeholder:text-md placeholder:text-text-secondary',
    defaultSizes.inner,
    variantMap[variant].inner,
    leftIconButton?.show && 'pl-[48px]',
    rightIconButton?.show && 'pr-[48px]',
    innerClassName
  );

  const labelClasses = clsx(
    'flex items-center text-sm text-text-secondary',
    defaultSizes.label,
    labelClassName
  );



  const renderInput = () => {
    if (inputType === 'textarea') {
      return (
        <textarea
            id="reviewText"
            placeholder={placeholder}
            value={value}
            onChange={onChange} 
            {...props as TextareaHTMLAttributes<HTMLTextAreaElement>}
            className={`flex overflow-hidden relative gap-2 justify-start items-start px-3 pt-2.5 pb-4 rounded-medium border border-solid bg-input-fill border-input-stroke min-h-[104px] w-full text-text-secondary placeholder:text-text-secondary outline-none ${innerClassName}`}
          />
      );
    }

    if (inputType === 'search') {
      return (
        <>
          <Search className="absolute left-3 w-5 h-5 text-text-secondary" role="img" aria-hidden="true"/>
          <input
            type="text"
            className={`${inputClasses} pl-10`}
            placeholder={placeholder}
            value={value}             
            onChange={onChange} 
            {...props as InputHTMLAttributes<HTMLInputElement>}
          />
        </>
      );
    }

    if (inputType === 'date') {
      return (
        <>
          <input
            type="date"
            className={`${inputClasses} pr-10`}
            placeholder="e.g. 2025/12/31"
            value={value}
            onChange={onChange} 
            {...props as InputHTMLAttributes<HTMLInputElement>}
          />
          <Calendar className="absolute right-3 w-5 h-5 text-button-text-text" role="img" aria-hidden="true"/>
        </>
      );
    }

    return (
      <input
        type="text"
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange} 
        {...props as InputHTMLAttributes<HTMLInputElement>}
      />
    );
  };

  const renderIconButton = (config?: IconButtonConfig, position: 'left' | 'right' = 'left') => {
    if (!config?.show) return null;

    return (
      <div className={`absolute ${position === 'left' ? 'left-3' : 'right-3'}`}>
      {config.children ? (
            <div className={clsx('flex items-center justify-center', config.customSize?.button || defaultSizes.iconButton.button)}>
              {config.children}
            </div>
          ) : (
            <IconButton 
              className="rounded-none" size='small'
            />
          )}
      </div>
          
    );
  };

  const getFeedbackIcon = () => {
    if (!feedback) return null;

    const icons = {
      error: <AlertCircle className="w-4 h-4" role="svg"/>,
      warning: <AlertTriangle className="w-4 h-4"role="svg"/>,
      success: <CheckCircle2 className="w-4 h-4" role="svg"/>
    };

    return icons[variant as keyof typeof icons];
  };

  return (
    <div>
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}

      <div className={inputType === 'textarea' ? '' : outerClasses}>
        {renderIconButton(leftIconButton, 'left')}
        {renderInput()}
        {renderIconButton(rightIconButton, 'right')}
      </div>

      {feedback && (
        <div className={clsx('flex items-center gap-2 mt-1 text-sm', variantMap[variant].feedback)}>
          {getFeedbackIcon()}
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
};

export default Input;