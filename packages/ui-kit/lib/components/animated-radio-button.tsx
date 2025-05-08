import React, { FC } from 'react';
import { CheckBox } from './checkbox';
import { cn } from '../utils/style-utils';

export interface AnimatedRadioButtonProps {
    name: string;
    value: string;
    label?: React.ReactNode;
    checked?: boolean;
    disabled?: boolean;
    withText?: boolean;
    size?: 'small' | 'medium' | 'large';
    onChange?: (value: string) => void;
    labelClass?: string;
}

const sizeConfig = {
    small: {
        container: 'w-[30px] h-[15px]',
        indicator: 'w-[11px] h-[11px]',
        translate: 'translate-x-[15px]',
        padding: 'top-[2px] left-[2px]'
    },
    medium: {
        container: 'w-[40px] h-[20px]',
        indicator: 'w-[16px] h-[16px]',
        translate: 'translate-x-[20px]',
        padding: 'top-[2px] left-[2px]'
    },
    large: {
        container: 'w-[50px] h-[25px]',
        indicator: 'w-[21px] h-[21px]',
        translate: 'translate-x-[25px]',
        padding: 'top-[2px] left-[2px]'
    },
};

/**
 * AnimatedRadioButton Component
 * A toggle switch with sliding animation.
 * The indicator slides from left to right when selected.
 * 
 * @param name - The name of the radio button group
 * @param value - The value of the radio button
 * @param label - Optional label text
 * @param checked - Whether the radio button is checked
 * @param disabled - Whether the radio button is disabled
 * @param withText - Whether to show the label
 * @param size - Size of the radio button (small, medium, large)
 * @param onChange - Callback when the radio button is clicked
 * @param labelClass - Additional classes for the label
 */
export const AnimatedRadioButton: FC<AnimatedRadioButtonProps> = ({
    name,
    value,
    label = 'Radio Button',
    checked = false,
    disabled = false,
    withText = false,
    size = 'medium',
    onChange,
    labelClass,
}) => {
    const { container, indicator, translate, padding } = sizeConfig[size];

    const containerClasses = cn(
        container,
        'relative inline-block rounded-full overflow-hidden cursor-pointer transition-colors duration-200 py-2',
        {
            'bg-radio-background-fill': !checked,
            'bg-button-primary-fill': checked,
            'opacity-50 cursor-not-allowed': disabled,
        },
    );

    const indicatorClasses = cn(
        indicator,
        'absolute rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out',
        padding,
        {
            [translate]: checked,
            'translate-x-0': !checked,
        },
    );

    const handleChange = (value: string) => {
        if (!disabled && onChange) {
            onChange(value);
        }
    };

    return (
        <label className="inline-flex items-center gap-3 relative">
            <div className="absolute top-0 left-4 z-10 hidden">
                <CheckBox
                    name={name}
                    value={value}
                    checked={checked}
                    disabled={disabled}
                    onChange={handleChange}
                    size={size}
                    withText={false}
                />
            </div>
            <div className={containerClasses}>
                <div className={indicatorClasses} />
            </div>
            {withText && <span className={labelClass}>{label}</span>}
        </label>
    );
};