import React, { useEffect, useState } from 'react'
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations'
import { Button } from './button'
import { InputField } from './input-field'
import { IconPlus } from './icons/icon-plus'
import { IconMinus } from './icons/icon-minus'
import { IconInfoCircle } from './icons/icon-infocircle'

/**
 * Represents a course available for coaching sessions.
 */
type Course = {
    id: string;
    title: string;
    price: number;
    duration: number;
    totalSessions: number;
}

/**
 * Props for the BuyCoachingSession component.
 */
export interface BuyCoachingSessionProps extends isLocalAware {
    /** List of courses available for purchase. */
    courses: Course[];
}

/**
 * BuyCoachingSession Component
 *
 * This component allows users to purchase coaching sessions for different courses.
 *
 * @param {BuyCoachingSessionProps} props - The component properties.
 * @returns {JSX.Element} The rendered component.
 */
function BuyCoachingSession({ courses, locale }: BuyCoachingSessionProps) {
    const dictionary = getDictionary(locale);
    const [totalCost, setTotalCost] = useState(0);
    const [courseList, setCourseList] = useState<Course[]>(courses);

    useEffect(() => {
        const total = courseList.reduce((acc, course) => acc + course.price * course.totalSessions, 0);
        setTotalCost(total);
    }, [courseList]);

    /**
     * Increases the total sessions count for a specific course.
     * 
     * @param {string} id - The ID of the course to increment.
     */
    function handleIncrement(id: string): void {
        setCourseList(prevCourses =>
            prevCourses.map(course =>
                course.id === id ? { ...course, totalSessions: course.totalSessions + 1 } : course
            )
        );
    }

    /**
     * Decreases the total sessions count for a specific course, ensuring it doesn't go below 0.
     * 
     * @param {string} id - The ID of the course to decrement.
     */
    function handleDecrement(id: string): void {
        setCourseList(prevCourses =>
            prevCourses.map(course =>
                course.id === id && course.totalSessions > 0
                    ? { ...course, totalSessions: course.totalSessions - 1 }
                    : course
            )
        );
    }

    /**
     * Updates the total session count for a specific course based on user input.
     * 
     * @param {string} id - The ID of the course to update.
     * @param {string} value - The new session count as a string.
     */
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
                                {course.title} <IconInfoCircle size="4" />
                            </h6>
                            <div className='flex gap-2 items-center text-text-secondary'>
                                <p className="text-xs md:text-sm">${course.price}</p>
                                <p className="text-sm md:text-md">{course.duration} {dictionary.components.buyCoachingSession.minutes}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div onClick={() => handleDecrement(course.id)} aria-label="decrease">
                                <IconMinus classNames='text-button-text-text' size="6" />
                            </div>
                            <InputField
                                type='number'
                                className='w-[3rem] h-[2.5rem] text-lg text-center'
                                value={course.totalSessions.toString()}
                                setValue={(value) => handleInputChange(course.id, value)}
                            />
                            <div onClick={() => handleIncrement(course.id)} aria-label="increase">
                                <IconPlus classNames='text-button-text-text' size="6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h6 className='text-right text-text-primary font-normal'>
                {dictionary.components.buyCoachingSession.total}: {totalCost}
            </h6>

            {/* Footer */}
            <Button variant='primary' text={dictionary.components.buyCoachingSession.buttonText} />
        </div>
    );
}

export default BuyCoachingSession;
