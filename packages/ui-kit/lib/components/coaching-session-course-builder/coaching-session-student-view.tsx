import { FC } from 'react';
import { CoachingSessionElement } from '../course-builder-lesson-component/types';
import { CoachingSessionHeader } from './coaching-session-header';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { getValidationError } from '../course-builder-lesson-component/coaching-session';
import DefaultError from '../default-error';

/**
 * A component that displays the student view of a coaching session.
 * It includes a header and renders any child components passed to it.
 *
 * @param type The type of the coaching session.
 * @param id The unique ID of the coaching session.
 * @param order The order of the coaching session in the course.
 * @param children The child components to be rendered inside the coaching session view.
 * @param studentHadSessionBeforeInCourse Indicates whether the student has had a session before in the course.
 * @param locale The locale for translation and localization purposes.
 *
 * @example
 * <CoachingSessionStudentView>
 *   <p>This is the content of the list of coaching session.</p>
 * </CoachingSessionStudentView>
 */

interface CoachingSessionStudentViewProps extends isLocalAware {
    elementInstance: CoachingSessionElement;
    progressContent: React.ReactNode;
}

export const CoachingSessionStudentView: FC<
    CoachingSessionStudentViewProps
> = ({ elementInstance, progressContent: coachList, locale }) => {
    const dictionary = getDictionary(locale);

    const validationError = getValidationError({ elementInstance, dictionary });
    if (validationError) {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={dictionary.components.lessons.elementValidationText}
                description={validationError}
            />
        );
    }

    // TODO: add book a coach text
    return (
        <div className="flex flex-col w-full gap-4 p-4 bg-card-fill border-1 border-card-stroke rounded-medium">
            <CoachingSessionHeader
                name={elementInstance.coachingSession!.name}
                duration={elementInstance.coachingSession!.duration}
                locale={locale}
            />
            {coachList}
        </div>
    );
};
