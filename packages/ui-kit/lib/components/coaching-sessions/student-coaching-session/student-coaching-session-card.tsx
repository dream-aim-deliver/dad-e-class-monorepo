import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { DateAndTime } from '../date-and-time';
import { CourseCreator } from '../course-creator';
import { StudentAction } from './student-action';
import { ReviewCard } from '../review-card';
import { IconCalendarAlt } from '../../icons/icon-calendar-alt';
import { IconClock } from '../../icons/icon-clock';

export interface StudentCoachingSessionCardProps extends isLocalAware {
    status:
        | 'ongoing'
        | 'upcoming-editable'
        | 'upcoming-locked'
        | 'ended'
        | 'requested'
        | 'rescheduled'
        | 'canceled'
        | 'to-be-defined';
    title: string;
    duration: number;
    date: Date;
    previousDate?: Date;
    startTime: string;
    endTime: string;
    previousStartTime?: string;
    previousEndTime?: string;
    creatorName: string;
    creatorImageUrl?: string;
    courseName?: string;
    courseImageUrl?: string;
    groupName?: string;
    reviewText?: string;
    rating?: number;
    callQualityRating?: number;
    meetingLink?: string;
    isRecordingDownloading?: boolean;
    hoursLeftToEdit?: number;
    onClickCreator?: () => void;
    onClickCourse?: () => void;
    onClickGroup?: () => void;
    onClickJoinMeeting?: () => void;
    onClickReschedule?: () => void;
    onClickCancel?: () => void;
    onClickReviewCoachingSession?: () => void;
    onClickDownloadRecording?: () => void;
    onClickDecline?: () => void;
    onClickAccept?: () => void;
    onClickSuggestAnotherDate?: () => void;
}

/**
 * `StudentCoachingSessionCard` es un componente que muestra los detalles visuales de una sesión de coaching
 * desde la perspectiva de un estudiante. Adapta dinámicamente su contenido en función del estado de la sesión
 * (por ejemplo, definida, por definir, finalizada, etc.) y muestra información relevante como fecha, duración,
 * profesor(a), curso, y permite realizar diversas acciones según corresponda.
 *
 * Si el estado es `'to-be-defined'`, muestra una tarjeta placeholder con información pendiente.
 *
 * @param status - Estado actual de la sesión. Puede ser:
 *   `'ongoing'`, `'upcoming-editable'`, `'upcoming-locked'`, `'ended'`, `'requested'`, `'rescheduled'`, `'canceled'`, `'to-be-defined'`.
 * @param title - Título de la sesión.
 * @param duration - Duración de la sesión en minutos.
 * @param date - Fecha de la sesión.
 * @param previousDate - (Opcional) Fecha previa de la sesión si fue reprogramada.
 * @param startTime - Hora de inicio de la sesión (formato string).
 * @param endTime - Hora de finalización de la sesión (formato string).
 * @param previousStartTime - (Opcional) Hora de inicio anterior si la sesión fue reprogramada.
 * @param previousEndTime - (Opcional) Hora de finalización anterior si la sesión fue reprogramada.
 * @param creatorName - Nombre del coach o creador de la sesión.
 * @param creatorImageUrl - (Opcional) URL de la imagen del creador.
 * @param courseName - (Opcional) Nombre del curso relacionado.
 * @param courseImageUrl - (Opcional) URL de la imagen del curso.
 * @param groupName - (Opcional) Nombre del grupo al que pertenece la sesión.
 * @param reviewText - (Opcional) Texto de reseña ingresado por el estudiante.
 * @param rating - (Opcional) Calificación dada a la sesión (1 a 5).
 * @param callQualityRating - (Opcional) Calificación de la calidad de la llamada (1 a 5).
 * @param meetingLink - (Opcional) Enlace para unirse a la sesión.
 * @param isRecordingDownloading - (Opcional) Indica si la grabación está siendo descargada actualmente.
 * @param hoursLeftToEdit - (Opcional) Horas restantes para poder editar la sesión.
 * @param onClickCreator - (Opcional) Callback al hacer clic en el nombre o imagen del creador.
 * @param onClickCourse - (Opcional) Callback al hacer clic en el nombre o imagen del curso.
 * @param onClickGroup - (Opcional) Callback al hacer clic en el nombre del grupo.
 * @param onClickJoinMeeting - (Opcional) Callback para unirse a la sesión.
 * @param onClickReschedule - (Opcional) Callback para reprogramar la sesión.
 * @param onClickCancel - (Opcional) Callback para cancelar la sesión.
 * @param onClickReviewCoachingSession - (Opcional) Callback para dejar una reseña.
 * @param onClickDownloadRecording - (Opcional) Callback para descargar la grabación.
 * @param onClickDecline - (Opcional) Callback para rechazar una sesión sugerida.
 * @param onClickAccept - (Opcional) Callback para aceptar una sesión sugerida.
 * @param onClickSuggestAnotherDate - (Opcional) Callback para sugerir otra fecha.
 * @param locale - Código de idioma/localización para la traducción de textos.
 *
 * @example
 * <StudentCoachingSessionCard
 *   status="ongoing"
 *   title="Clase de Introducción a React"
 *   duration={60}
 *   date={new Date()}
 *   startTime="10:00 AM"
 *   endTime="11:00 AM"
 *   creatorName="Laura González"
 *   creatorImageUrl="https://example.com/avatar.jpg"
 *   locale="es"
 *   onClickJoinMeeting={() => console.log('Join clicked')}
 * />
 */

export const StudentCoachingSessionCard: React.FC<
    StudentCoachingSessionCardProps
> = ({
    status,
    title,
    duration,
    date,
    previousDate,
    startTime,
    endTime,
    previousStartTime,
    previousEndTime,
    creatorName,
    creatorImageUrl,
    courseName,
    courseImageUrl,
    groupName,
    reviewText,
    rating,
    callQualityRating,
    meetingLink,
    isRecordingDownloading,
    hoursLeftToEdit,
    onClickCreator,
    onClickCourse,
    onClickGroup,
    onClickJoinMeeting,
    onClickReschedule,
    onClickCancel,
    onClickReviewCoachingSession,
    onClickDownloadRecording,
    onClickDecline,
    onClickAccept,
    onClickSuggestAnotherDate,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    if (status === 'to-be-defined') {
        return (
            <div
                className={`flex flex-col justify-center md:p-4 p-2 gap-3 rounded-medium border border-card-stroke basis-0 bg-card-fill w-auto max-w-[24rem]`}
            >
                <div className="flex gap-4 items-center justify-between">
                    <p
                        title={title}
                        className="text-md text-text-primary font-bold leading-[120%] line-clamp-2"
                    >
                        {title}
                    </p>
                    <p className="text-xs text-text-primary font-bold leading-[120%] whitespace-nowrap">
                        {duration}
                        {dictionary.components.coachingSessionCard.durationText}
                    </p>
                </div>
                <div className="flex text-text-primary p-3 items-start flex-col gap-3 bg-base-neutral-800 rounded-small border border-base-neutral-700">
                    <div className="flex items-center gap-2">
                        <IconCalendarAlt size="4" />
                        <p className="text-sm text-text-primary leading-[100%]">
                            {
                                dictionary.components.coachingSessionCard
                                    .toBeDefined
                            }
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <IconClock size="4" />
                        <p className="text-sm text-text-primary leading-[100%]">
                            {
                                dictionary.components.coachingSessionCard
                                    .toBeDefined
                            }
                        </p>
                    </div>
                </div>
                <p className="text-md text-text-primary">
                    {' '}
                    {
                        dictionary.components.coachingSessionCard
                            .toBeDefinedMessage
                    }{' '}
                </p>
            </div>
        );
    }
    return (
        <div
            className={`flex flex-col justify-center md:p-4 p-2 gap-3 rounded-medium border border-card-stroke basis-0 bg-card-fill w-auto max-w-[24rem]`}
        >
            <div className="flex gap-4 items-center justify-between">
                <p
                    title={title}
                    className="text-md text-text-primary font-bold leading-[120%] line-clamp-2"
                >
                    {title}
                </p>
                <p className="text-xs text-text-primary font-bold leading-[120%] whitespace-nowrap">
                    {duration}
                    {dictionary.components.coachingSessionCard.durationText}
                </p>
            </div>
            <DateAndTime
                date={date}
                previousDate={previousDate}
                startTime={startTime}
                endTime={endTime}
                previousStartTime={previousStartTime}
                previousEndTime={previousEndTime}
                hasReview={rating > 0 ? true : false}
            />
            {rating > 0 && (
                <ReviewCard
                    reviewText={reviewText}
                    rating={rating}
                    callQualityRating={callQualityRating}
                    locale={locale}
                />
            )}
            <CourseCreator
                creatorName={creatorName}
                creatorImageUrl={creatorImageUrl}
                courseName={courseName}
                courseImageUrl={courseImageUrl}
                groupName={groupName}
                userRole="student"
                onClickCourse={onClickCourse}
                onClickCreator={onClickCreator}
                onClickGroup={onClickGroup}
                locale={locale}
            />
            <StudentAction
                status={status}
                hoursLeftToEdit={hoursLeftToEdit}
                meetingLink={meetingLink}
                hasReview={rating ? true : false}
                onClickJoinMeeting={onClickJoinMeeting}
                onClickReschedule={onClickReschedule}
                onClickCancel={onClickCancel}
                onClickReviewCoachingSession={onClickReviewCoachingSession}
                onClickDownloadRecording={onClickDownloadRecording}
                isRecordingDownloading={isRecordingDownloading}
                onClickAccept={onClickAccept}
                onClickDecline={onClickDecline}
                onClickSuggestAnotherDate={onClickSuggestAnotherDate}
                locale={locale}
            />
        </div>
    );
};
