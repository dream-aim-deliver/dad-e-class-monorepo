import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { IconCourse } from '../icons/icon-course';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Divider } from '../divider';
import {
    IconCoachingSession,
    IconFile,
    IconPackageCourseBundle,
} from '../icons';
import { CoachingSessionSnippet } from './coaching-session-snippet';

export type OrderHistoryType = 'course' | 'coaching' | 'package';

interface BaseOrderHistoryCardProps extends isLocalAware {
    orderId: string;
    orderDate: string;
    total: string;
    onInvoiceClick: () => void;
}

/* Course Variant */
export interface CourseOrderHistoryProps extends BaseOrderHistoryCardProps {
    type: 'course';
    courseTitle: string;
    courseImageUrl: string;
    onClickCourse: () => void;
    coachingSessionCount?: number | null;
}

/* Coaching Variant */
export interface CoachingOrderHistoryProps extends BaseOrderHistoryCardProps {
    type: 'coaching';
    sessions: {
        sessionName: string; // e.g. "Quick sprint"
        durationMinutes: number; // e.g. 20
        count: number; // e.g. 4
    }[];
}

/* Package Variant */
export interface PackageOrderHistoryProps extends BaseOrderHistoryCardProps {
    type: 'package';
    packageTitle: string;
    packageImageUrl: string;
    coursesIncluded: {
        title: string;
        imageUrl: string;
        onClick: () => void;
    }[];
}

export type OrderHistoryCardProps =
    | CourseOrderHistoryProps
    | CoachingOrderHistoryProps
    | PackageOrderHistoryProps;

/**
 * `OrderHistoryCard` is a flexible UI component that visually represents
 * a single purchase or order in a user’s account history. It adapts its
 * layout and content dynamically depending on the **order type**:
 *
 * - `'course'`: Displays a purchased standalone course.
 * - `'coaching'`: Displays one or more booked coaching session types.
 * - `'package'`: Displays a bundled package containing multiple courses.
 *
 * Each variant includes localized labels and consistent design elements
 * (icons, avatars, dividers, and badges) that match the overall
 * e-class UI language.
 *
 * ---
 *
 * ### 🧩 Example usage
 *
 * #### Course order
 * ```tsx
 * <OrderHistoryCard
 *   locale="en"
 *   type="course"
 *   orderId="861284"
 *   orderDate="2024-08-10 at 17:01"
 *   total="120 CHF"
 *   courseTitle="Branding Basics"
 *   courseImageUrl="/images/branding.jpg"
 *   onClickCourse={() => alert('Course clicked')}
 *   onInvoiceClick={() => alert('Invoice downloaded')}
 * />
 * ```
 *
 * #### Coaching order
 * ```tsx
 * <OrderHistoryCard
 *   locale="en"
 *   type="coaching"
 *   orderId="861284"
 *   orderDate="2024-08-10 at 17:01"
 *   total="120 CHF"
 *   sessions={[
 *     { sessionName: 'Quick sprint', durationMinutes: 20, count: 4 },
 *     { sessionName: 'Full immersion', durationMinutes: 60, count: 1 },
 *   ]}
 *   onInvoiceClick={() => alert('Invoice clicked')}
 * />
 * ```
 *
 * #### Package order
 * ```tsx
 * <OrderHistoryCard
 *   locale="en"
 *   type="package"
 *   orderId="861284"
 *   orderDate="2024-08-10 at 17:01"
 *   total="120 CHF"
 *   packageTitle="Creative Bundle"
 *   packageImageUrl="/images/bundle.jpg"
 *   coursesIncluded={[
 *     { title: 'Branding Basics', imageUrl: '/img/branding.jpg', onClick: () => alert('Clicked') },
 *     { title: 'Marketing Mastery', imageUrl: '/img/marketing.jpg', onClick: () => alert('Clicked') },
 *   ]}
 *   onInvoiceClick={() => alert('Invoice clicked')}
 * />
 * ```
 *
 * ---
 *
 * @param {OrderHistoryCardProps} props - Props vary depending on the order type.
 * @param {'course' | 'coaching' | 'package'} props.type - Defines which variant of the card is displayed.
 * @param {string} props.orderId - Unique ID of the order.
 * @param {string} props.orderDate - Date and time when the order was placed.
 * @param {string} props.total - Formatted total amount of the order.
 * @param {string} props.locale - Locale used for localized labels.
 * @param {() => void} props.onInvoiceClick - Callback when invoice is clicked.
 * @param {string} [props.courseTitle] - For course variant, title of the course.
 * @param {() => void} [props.onClickCourse] - For course variant, click handler.
 * @param {Array} [props.sessions] - For coaching variant, list of session details.
 * @param {string} [props.packageTitle] - For package variant, title of the package.
 * @param {Array} [props.coursesIncluded] - For package variant, list of included courses.
 */

export const OrderHistoryCard = (props: OrderHistoryCardProps) => {
    const dictionary = getDictionary(props.locale).components.orderHistoryCard;

    return (
        <div className="flex flex-col md:p-4 p-2 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <p className="text-text-primary text-md">{props.orderDate}</p>
                <p className="text-text-secondary text-xs truncate" title={`${dictionary.orderIdLabel} ${props.orderId}`}>
                    {dictionary.orderIdLabel} {props.orderId}
                </p>
            </div>
            <Divider className="my-1" />

            {/* Variant: COURSE */}
            {props.type === 'course' && (
                <div className="flex flex-col gap-2 items-start">
                    <div className="flex flex-col items-start gap-2">
                        <div className="flex bg-base-neutral-700 border border-base-neutral-600 rounded-medium">
                            <IconCourse
                                classNames="text-text-primary m-2"
                                size="5"
                            />
                        </div>
                        <p className="text-text-secondary text-sm md:text-md">
                            {props.coachingSessionCount && props.coachingSessionCount > 0
                                ? dictionary.courseWithCoaching
                                : dictionary.course}
                        </p>
                    </div>
                    <Button
                        variant="text"
                        size="small"
                        className="p-0 gap-2 text-sm truncate"
                        hasIconLeft
                        iconLeft={
                            <UserAvatar
                                className="rounded-small"
                                fullName={props.courseTitle}
                                size="xSmall"
                                imageUrl={props.courseImageUrl}
                            />
                        }
                        text={props.courseTitle}
                        onClick={props.onClickCourse}
                    />
                    {props.coachingSessionCount && props.coachingSessionCount > 0 && (
                        <div className="flex flex-row items-center gap-2 mt-1">
                            <div className="flex bg-base-neutral-700 border border-base-neutral-600 rounded-medium">
                                <IconCoachingSession
                                    classNames="text-text-primary m-1"
                                    size="4"
                                />
                            </div>
                            <p className="text-text-secondary text-xs md:text-sm">
                                {props.coachingSessionCount} {dictionary.coachingSessionsIncluded}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Variant: COACHING */}
            {props.type === 'coaching' && (
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col items-start gap-2">
                        <div className="flex bg-base-neutral-700 border border-base-neutral-600 rounded-medium">
                            <IconCoachingSession
                                classNames="text-text-primary m-2"
                                size="5"
                            />
                        </div>
                        <p className="text-text-primary text-sm md:text-md">
                            {dictionary.coachingSession}
                        </p>
                    </div>
                    <div className="flex flex-row flex-wrap gap-2 items-start">
                        {props.sessions.map((session, index) => (
                            <CoachingSessionSnippet
                                key={index}
                                locale={props.locale}
                                sessionName={session.sessionName}
                                durationMinutes={session.durationMinutes}
                                count={session.count}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Variant: PACKAGE */}
            {props.type === 'package' && (
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col items-start gap-2">
                        <div className="flex bg-base-neutral-700 border border-base-neutral-600 rounded-medium">
                            <IconPackageCourseBundle
                                classNames="text-text-primary m-2"
                                size="5"
                            />
                        </div>
                        <div className="flex flex-row gap-4 items-center">
                            <p className="text-text-secondary text-sm md:text-md flex-shrink-0">
                                {dictionary.package}
                            </p>
                            <Button
                                variant="text"
                                size="small"
                                className="p-0 gap-2 text-left whitespace-normal break-words"
                                hasIconLeft
                                iconLeft={
                                    <UserAvatar
                                        className="rounded-small flex-shrink-0"
                                        fullName={props.packageTitle}
                                        size="xSmall"
                                        imageUrl={props.packageImageUrl}
                                    />
                                }
                                text={props.packageTitle}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 items-start">
                        <p className="text-text-secondary text-sm md:text-md">
                            {dictionary.coursesIncluded} (
                            {props.coursesIncluded.length}):
                        </p>
                        <div className="flex flex-row flex-wrap gap-2">
                            {props.coursesIncluded.map((course, i) => (
                                <Button
                                    key={i}
                                    variant="text"
                                    size="small"
                                    className="p-0 gap-2 truncate"
                                    hasIconLeft
                                    iconLeft={
                                        <UserAvatar
                                            className="rounded-small"
                                            fullName={course.title}
                                            size="xSmall"
                                            imageUrl={course.imageUrl}
                                        />
                                    }
                                    text={course.title}
                                    onClick={course.onClick}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <Divider className="my-1" />
            <div className="flex flex-row w-full justify-between items-center gap-2">
                <Button
                    variant="text"
                    className="p-0 gap-1 text-xs md:text-sm flex-shrink-0"
                    size="small"
                    text={dictionary.invoice}
                    onClick={props.onInvoiceClick}
                    hasIconLeft
                    iconLeft={<IconFile size="6" />}
                />
                <p className="text-text-primary font-important text-sm md:text-md ml-auto truncate" title={`${dictionary.total} ${props.total}`}>
                    {dictionary.total} {props.total}
                </p>
            </div>
        </div>
    );
};
