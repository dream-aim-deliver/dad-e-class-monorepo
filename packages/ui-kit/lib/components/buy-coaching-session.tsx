'use client';

import { useMemo, useState } from 'react'
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations'
import { Button } from './button'
import { InputField } from './input-field'
import { IconPlus } from './icons/icon-plus'
import { IconMinus } from './icons/icon-minus'
import Tooltip from './tooltip'
import { formatPrice } from '../utils/format-utils'

type CoachingOffering = {
    id: string | number;
    title: string;
    price: number;
    duration: number;
    content: string;
}

export interface BuyCoachingSessionProps extends isLocalAware {
    offerings: CoachingOffering[];
    onBuy: (sessionsPerOffering: Record<string | number, number>) => void;
    currencyType: string;
}

/**
 * A reusable component for purchasing coaching sessions, allowing users to select courses and adjust session quantities.
 *
 * @param offerings An array of coaching offerings, each containing an id, title, price, duration, and content for tooltips.
 * @param onBuy A callback function triggered when the purchase button is clicked, receiving the selected sessions per offering.
 * @param locale A string representing the current locale for translations.
 * @param currencyType The type of currency to display for course prices.
 *
 * @example
 * <BuyCoachingSession
 *   courses={[
 *     { id: "1", title: "Python Basics", price: 50, duration: 60, totalSessions: 1 },
 *     { id: "2", title: "React Advanced", price: 75, duration: 90, totalSessions: 2 }
 *   ]}
 *   onClick={() => console.log("Purchase initiated")}
 *   locale="en"
 *   currencyType="USD"
 * />
 */
function BuyCoachingSession({ offerings, onBuy, locale, currencyType }: BuyCoachingSessionProps) {
    const dictionary = getDictionary(locale);
    // State to keep track of the number of sessions per offering
    const [sessionsPerOffering, setSessionsPerOffering] = useState<Record<string | number, number>>({});
    
    const totalCost = useMemo(() => {
        return offerings.reduce((total, offering) => {
            const sessionCount = sessionsPerOffering[offering.id] ?? 0;
            return offering.price * sessionCount + total;
        }, 0);
    }, [offerings, sessionsPerOffering]);

    function handleIncrement(id: string | number): void {
        setSessionsPerOffering(prev => {
            const currentCount = prev?.[id] ?? 0;
            return {
                ...prev,
                [id]: currentCount + 1
            };
        });
    }

    function handleDecrement(id: string | number): void {
        setSessionsPerOffering(prev => {
            const currentCount = prev?.[id] ?? 0;
            if (currentCount > 0) {
                return {
                    ...prev,
                    [id]: currentCount - 1
                };
            }
            return prev;
        });
    }

    function handleInputChange(id: string | number, value: string): void {
        const newValue = Number(value);
        if (!isNaN(newValue) && newValue >= 0) {
            setSessionsPerOffering(prev => {
                return {
                    ...prev,
                    [id]: newValue,
                };
            });
        }
    }

    return (
        <div className='min-auto border border-card-stroke rounded-medium bg-card-fill px-4 py-6 flex flex-col gap-4'>
            {/* Header */}
            <div className='flex flex-col gap-2'>
                <h5 className="text-xl font-bold text-text-primary">
                    {dictionary.components.buyCoachingSession.title}
                </h5>
                <p className='text-text-secondary text-md md:text-lg'>
                    {dictionary.components.buyCoachingSession.description}
                </p>
            </div>

            {/* Body */}
            <div className="flex flex-col">
                {offerings.map(offering => (
                    <div key={offering.id} className="flex justify-between items-center py-3 border-b border-divider">
                        <div className="flex flex-col gap-2">
                            <h6 className="text-lg font-semibold text-text-primary">
                                <Tooltip contentClassName='max-w-[200px]' text={offering.title} description={offering.content} />
                            </h6>
                            <div className='flex gap-2 items-center text-text-secondary'>
                                <p className="text-xs md:text-sm font-important">{formatPrice(offering.price)} {currencyType}</p>
                                <p className="text-sm md:text-md">{offering.duration} {dictionary.components.buyCoachingSession.minutes}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleDecrement(offering.id)} aria-label="decrease" className="p-2 cursor-pointer">
                                <IconMinus classNames='text-button-text-text' size="6" />
                            </button>
                            <InputField
                                type='number'
                                className='w-[3rem] h-[3rem] text-lg'
                                inputClassName='text-center'
                                value={sessionsPerOffering[offering.id]?.toString() ?? '0'}
                                setValue={(value) => handleInputChange(offering.id, value)}
                                inputText=''
                            />
                            <button onClick={() => handleIncrement(offering.id)} className='cursor-pointer' aria-label="increase">
                                <IconPlus classNames='text-button-text-text' size="6" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <h6 className='text-right text-text-primary font-normal'>
                {dictionary.components.buyCoachingSession.total}: {formatPrice(totalCost)} {currencyType}
            </h6>

            {/* Footer */}
            <Button onClick={() => onBuy(sessionsPerOffering)} variant='primary' text={dictionary.components.buyCoachingSession.buttonText} />
        </div>
    );
}

export default BuyCoachingSession