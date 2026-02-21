import { getDictionary, isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { TListStudentInteractionsSuccess } from 'packages/models/src/view-models';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './accordion';
import { cn } from '../utils/style-utils';
import { IconChevronDown, IconChevronUp, IconTextInput, IconSingleChoice, IconMultiChoice, IconOneOutOfThree, IconCloudUpload } from './icons';
import { Button } from './button';
import RichTextRenderer from './rich-text-element/renderer';

interface CoachStudentInteractionCardProps extends isLocalAware {
  onViewLessonsClick: (moduleId: string, lessonId: string) => void;
  locale: TLocale;
  modules: TListStudentInteractionsSuccess['modules'];
  onDeserializationError: (message: string, error: Error) => void;
}

type TInteraction = TListStudentInteractionsSuccess['modules'][number]['lessons'][number]['interactions'][number];

export const  CoachStudentInteractionCard = ({
  modules,
  locale,
  onViewLessonsClick,
  onDeserializationError,
}: CoachStudentInteractionCardProps) => {
  const dictionary = getDictionary(locale);
  const dict = dictionary.components.coachStudentInteractionCard;

  const renderTextInput = (interaction: Extract<TInteraction, { type: 'textInput' }>, index: number) => (
    <div
      key={`text-input-${interaction.id}-${index}`}
      className="w-full p-4 bg-base-neutral-800 rounded-medium border border-base-neutral-700"
    >
      <div className="flex flex-col gap-2 items-start">
        <Button
          hasIconLeft
          iconLeft={<IconTextInput />}
          text={dict.textInput}
          variant="text"
          className="p-0 text-base-white hover:text-base-white"
        />
        <RichTextRenderer
          content={interaction.helperText ?? ''}
          className="text-text-secondary"
          onDeserializationError={onDeserializationError}
        />
      </div>
      <hr className="my-4 border-t border-divider" />
      <div className="flex flex-col gap-2 items-start">
        <Button
          text={dict.studentReply}
          variant="text"
          className="p-0 text-base-white hover:text-base-white"
        />
        {interaction.progress ? (
          <RichTextRenderer
            content={interaction.progress.answer}
            className="text-text-secondary"
            onDeserializationError={onDeserializationError}
          />
        ) : (
          <p className="text-text-secondary text-sm">{dict.noAnswer}</p>
        )}
      </div>
    </div>
  );

  const renderSingleChoice = (interaction: Extract<TInteraction, { type: 'singleChoice' }>, index: number) => (
    <div
      key={`single-choice-${interaction.id}-${index}`}
      className="w-full p-4 bg-base-neutral-800 rounded-medium border border-base-neutral-700"
    >
      <div className="flex flex-col gap-2 items-start">
        <Button
          hasIconLeft
          iconLeft={<IconSingleChoice />}
          text={dict.singleChoice}
          variant="text"
          className="p-0 text-base-white hover:text-base-white"
        />
        <p className="text-text-secondary">{interaction.title}</p>
      </div>
      <hr className="my-4 border-t border-divider" />
      <div className="flex flex-col gap-2 items-start">
        <Button
          text={dict.studentAnswer}
          variant="text"
          className="p-0 text-base-white hover:text-base-white"
        />
        {interaction.progress ? (
          <ul className="flex flex-col gap-1 w-full">
            {interaction.options.map((option) => (
              <li
                key={option.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-medium text-sm",
                  interaction.progress?.answerId === option.id
                    ? "bg-base-neutral-700 text-text-primary font-bold"
                    : "text-text-secondary"
                )}
              >
                <span
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    interaction.progress?.answerId === option.id
                      ? "border-action-primary-default"
                      : "border-base-neutral-600"
                  )}
                >
                  {interaction.progress?.answerId === option.id && (
                    <span className="w-2 h-2 rounded-full bg-action-primary-default" />
                  )}
                </span>
                {option.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-secondary text-sm">{dict.noAnswer}</p>
        )}
      </div>
    </div>
  );

  const renderMultipleChoice = (interaction: Extract<TInteraction, { type: 'multipleChoice' }>, index: number) => (
    <div
      key={`multiple-choice-${interaction.id}-${index}`}
      className="w-full p-4 bg-base-neutral-800 rounded-medium border border-base-neutral-700"
    >
      <div className="flex flex-col gap-2 items-start">
        <Button
          hasIconLeft
          iconLeft={<IconMultiChoice />}
          text={dict.multipleChoice}
          variant="text"
          className="p-0 text-base-white hover:text-base-white"
        />
        <p className="text-text-secondary">{interaction.title}</p>
      </div>
      <hr className="my-4 border-t border-divider" />
      <div className="flex flex-col gap-2 items-start">
        <Button
          text={dict.studentAnswer}
          variant="text"
          className="p-0 text-base-white hover:text-base-white"
        />
        {interaction.progress ? (
          <ul className="flex flex-col gap-1 w-full">
            {interaction.options.map((option) => {
              const isSelected = interaction.progress?.answerIds?.includes(option.id) ?? false;
              return (
                <li
                  key={option.id}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-medium text-sm",
                    isSelected
                      ? "bg-base-neutral-700 text-text-primary font-bold"
                      : "text-text-secondary"
                  )}
                >
                  <span
                    className={cn(
                      "w-4 h-4 rounded-small border-2 flex items-center justify-center flex-shrink-0",
                      isSelected
                        ? "border-action-primary-default bg-action-primary-default"
                        : "border-base-neutral-600"
                    )}
                  >
                    {isSelected && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {option.name}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-text-secondary text-sm">{dict.noAnswer}</p>
        )}
      </div>
    </div>
  );

  const renderOneOutOfThree = (interaction: Extract<TInteraction, { type: 'oneOutOfThree' }>, index: number) => (
    <div
      key={`one-out-of-three-${interaction.id}-${index}`}
      className="w-full p-4 bg-base-neutral-800 rounded-medium border border-base-neutral-700"
    >
      <div className="flex flex-col gap-2 items-start">
        <Button
          hasIconLeft
          iconLeft={<IconOneOutOfThree />}
          text={dict.oneOutOfThree}
          variant="text"
          className="p-0 text-base-white hover:text-base-white"
        />
        <p className="text-text-secondary">{interaction.title}</p>
      </div>
      <hr className="my-4 border-t border-divider" />
      <div className="flex flex-col gap-2 items-start">
        <Button
          text={dict.studentAnswer}
          variant="text"
          className="p-0 text-base-white hover:text-base-white"
        />
        {interaction.progress ? (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-text-secondary p-2" />
                  {interaction.columns.map((col) => (
                    <th key={col.id} className="text-center text-text-secondary p-2 font-medium">
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {interaction.rows.map((row) => (
                  <tr key={row.id} className="border-t border-base-neutral-700">
                    <td className="text-text-secondary p-2">{row.name}</td>
                    {interaction.columns.map((col) => {
                      const isSelected = interaction.progress?.answers?.some(
                        (a) => a.rowId === row.id && a.columnId === col.id
                      ) ?? false;
                      return (
                        <td key={col.id} className="text-center p-2">
                          <span
                            className={cn(
                              "inline-block w-4 h-4 rounded-full border-2",
                              isSelected
                                ? "border-action-primary-default bg-action-primary-default"
                                : "border-base-neutral-600"
                            )}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-text-secondary text-sm">{dict.noAnswer}</p>
        )}
      </div>
    </div>
  );

  const renderUploadFiles = (interaction: Extract<TInteraction, { type: 'uploadFiles' }>, index: number) => (
    <div
      key={`upload-files-${interaction.id}-${index}`}
      className="w-full p-4 bg-base-neutral-800 rounded-medium border border-base-neutral-700"
    >
      <div className="flex flex-col gap-2 items-start">
        <Button
          hasIconLeft
          iconLeft={<IconCloudUpload />}
          text={dict.uploadFiles}
          variant="text"
          className="p-0 text-base-white hover:text-base-white"
        />
        <p className="text-text-secondary">{interaction.description}</p>
      </div>
      <hr className="my-4 border-t border-divider" />
      <div className="flex flex-col gap-2 items-start">
        <Button
          text={dict.filesUploaded}
          variant="text"
          className="p-0 text-base-white hover:text-base-white"
        />
        {interaction.progress ? (
          <div className="flex flex-col gap-2 w-full">
            <ul className="flex flex-col gap-1">
              {interaction.progress.files.map((file) => (
                <li key={file.id} className="flex items-center gap-2 text-sm">
                  <a
                    href={file.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-action-primary-default hover:underline"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
            {interaction.progress.comment && (
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-text-secondary text-sm font-medium">{dict.comment}:</span>
                <p className="text-text-secondary text-sm">{interaction.progress.comment}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-text-secondary text-sm">{dict.noAnswer}</p>
        )}
      </div>
    </div>
  );

  const renderInteraction = (interaction: TInteraction, index: number) => {
    switch (interaction.type) {
      case 'textInput':
        return renderTextInput(interaction, index);
      case 'singleChoice':
        return renderSingleChoice(interaction, index);
      case 'multipleChoice':
        return renderMultipleChoice(interaction, index);
      case 'oneOutOfThree':
        return renderOneOutOfThree(interaction, index);
      case 'uploadFiles':
        return renderUploadFiles(interaction, index);
      default:
        return null;
    }
  };

  return (
    <Accordion
      className={cn("flex flex-col gap-4")}
      type="multiple"
      defaultValue={modules.length > 0 ? [`module-${modules[0].id}`] : []}
    >
      {/* Map through all modules */}
      {modules.map((module) => (
        <AccordionItem
          key={`module-${module.id}`}
          value={`module-${module.id}`}
          className="border border-divider px-4 py-6 rounded-medium bg-card-fill border-card-stroke"
        >
          <AccordionTrigger
            value={`module-${module.id}`}
            className="w-full"
            expandIcon={
              <span
                title={
                  dictionary.components
                    .courseMaterialsAccordion.expand
                }
                className="text-button-text-text"
              >
                <IconChevronUp size="6" />
              </span>
            }
            collapseIcon={
              <span
                title={
                  dictionary.components
                    .courseMaterialsAccordion.collapse
                }
                className="text-button-text-text"
              >
                <IconChevronDown size="6" />
              </span>
            }
          >
            <h4 className="text-text-primary md:text-xl text-md font-bold">{dict.module} {module.position}: {module.title}</h4>
          </AccordionTrigger>

          <AccordionContent value={`module-${module.id}`} className="pt-4 pb-6">
            {/* Nested Lessons Accordion */}
            <div className="pb-2">
              <Accordion
                type="multiple"
                className="flex flex-col gap-4"
              >
                {module.lessons?.map((lesson) => (
                  <AccordionItem
                    key={`lesson-${lesson.id}`}
                    value={`lesson-${lesson.id}`}
                    className="bg-base-neutral-800 p-4 rounded-medium border border-base-neutral-700"
                  >
                    <AccordionTrigger
                      value={`lesson-${lesson.id}`}
                      className="w-full"
                      expandIcon={
                        <span
                          title={
                            dictionary.components
                              .courseMaterialsAccordion.expand
                          }
                          className="text-button-text-text"
                        >
                          <IconChevronUp size="6" />
                        </span>
                      }
                      collapseIcon={
                        <span
                          title={
                            dictionary.components
                              .courseMaterialsAccordion.collapse
                          }
                          className="text-button-text-text"
                        >
                          <IconChevronDown size="6" />
                        </span>
                      }
                    >
                      <div className="flex items-center justify-between gap-4 flex-1">
                        <div className="flex items-center gap-4">
                          <h5 className="text-text-primary md:text-lg text-sm font-bold">{dict.lesson} {lesson.position}: {lesson.title}</h5>
                        </div>
                        <Button
                          onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                            e?.stopPropagation();
                            onViewLessonsClick(module.id, lesson.id);
                          }}
                          variant='text'
                          text={dict.viewLesson}
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent value={`lesson-${lesson.id}`} className="pb-4">
                      {/* Student-Coach Interactions */}
                      <div className="flex flex-col gap-4 mt-4">
                        <hr className="flex-grow border-t border-divider" />
                        {lesson.interactions?.length > 0 ? (
                          lesson.interactions.map((interaction, index) =>
                            renderInteraction(interaction, index)
                          )
                        ) : (
                          <p className="text-text-secondary text-sm">
                            {dict.noInteractionsYet}
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
