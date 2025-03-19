import React, { useEffect, useMemo, useState } from 'react'
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations'
import { Button } from './button'
import { InputField } from './input-field'
import { IconPlus } from './icons/icon-plus'
import { IconMinus } from './icons/icon-minus'
import Tooltip from './tooltip'

type Course = {
    id: string;
    title: string;
    price: number;
    duration: number;
    totalSessions: number;
    content: string
}

export interface BuyCoachingSessionProps extends isLocalAware {
    courses: Course[];
    onClick: () => void;
    currencyType: string;
}

/**
 * A reusable component for purchasing coaching sessions, allowing users to select courses and adjust session quantities.
 *
 * @param courses An array of available courses, each containing:
 *   - `id`: A unique identifier for the course.
 *   - `title`: The name of the course.
 *   - `price`: The price per session of the course.
 *   - `duration`: The duration of a single session in minutes.
 *   - `totalSessions`: The number of sessions the user wants to purchase.
 * @param onClick A callback function triggered when the purchase button is clicked.
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
function BuyCoachingSession({ courses, onClick, locale,currencyType }: BuyCoachingSessionProps) {
    const dictionary = getDictionary(locale);
    const [courseList, setCourseList] = useState<Course[]>(courses);
    const totalCost = useMemo(() => {
        return courseList.reduce((acc, course) => acc + course.price * course.totalSessions, 0);
    }, [courseList]);

    function handleIncrement(id: string): void {
        setCourseList(prevCourses =>
            prevCourses.map(course =>
                course.id === id ? { ...course, totalSessions: course.totalSessions + 1 } : course
            )
        );
    }
    function handleDecrement(id: string): void {
        setCourseList(prevCourses =>
            prevCourses.map(course =>
                course.id === id && course.totalSessions > 0
                    ? { ...course, totalSessions: course.totalSessions - 1 }
                    : course
            )
        );
    }
    function handleInputChange(id: string, value: string): void {
        const newValue = Number(value);
        if (!isNaN(newValue) && newValue >= 0) {
            setCourseList(prevCourses =>
                prevCourses.map(course =>
                    course.id === id ? { ...course, totalSessions: newValue } : course
                )
            );
        }
    }

    return (
        <div className='min-auto border border-card-stroke rounded-medium bg-card-fill px-4 py-6 flex flex-col gap-6'>
            {/* Header */}
            <div className='flex flex-col gap-2'>
                <h5 className='text-text-primary text-lg md:text-[1.5rem]'>
                    {dictionary.components.buyCoachingSession.title}
                </h5>
                <p className='text-text-secondary text-md md:text-xl leading-6 md:leading-[1.875rem]'>
                    {dictionary.components.buyCoachingSession.description}
                </p>
            </div>

            {/* Body */}
            <div className="flex flex-col">
                {courseList.map(course => (
                    <div key={course.id} className="flex justify-between items-center py-3 border-b border-divider">
                        <div className="flex flex-col gap-2">
                            <h6 className="flex items-center gap-2 text-text-primary text-md md:text-lg">
                            <Tooltip text={course.title} description={course.content}/>
                            </h6>
                            <div className='flex gap-2 items-center text-text-secondary'>
                                <p className="text-xs md:text-sm font-important">{course.price} {currencyType}</p>
                                <p className="text-sm md:text-md">{course.duration} {dictionary.components.buyCoachingSession.minutes}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleDecrement(course.id)} aria-label="decrease" className="p-2">
                                <IconMinus classNames='text-button-text-text' size="6" />
                            </button>
                            <InputField
                                type='number'
                                className='w-[3rem] h-[3rem] text-lg text-center'
                                value={course.totalSessions.toString()}
                                setValue={(value) => handleInputChange(course.id, value)}
                            />
                            <button onClick={() => handleIncrement(course.id)} aria-label="increase">
                                <IconPlus classNames='text-button-text-text' size="6" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <h6 className='text-right text-text-primary font-normal'>
                {dictionary.components.buyCoachingSession.total}: {totalCost} {currencyType}
            </h6>

            {/* Footer */}
            <Button onClick={onClick} variant='primary' text={dictionary.components.buyCoachingSession.buttonText} />
        </div>
    );
}

export default BuyCoachingSession