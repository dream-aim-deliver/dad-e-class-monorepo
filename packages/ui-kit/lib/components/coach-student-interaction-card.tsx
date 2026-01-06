import { getDictionary, isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { TListStudentInteractionsSuccess } from 'packages/models/src/view-models';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './accordion';
import { cn } from '../utils/style-utils';
import { IconChevronDown, IconChevronUp, IconTextInput } from './icons';
import { Button } from './button';
import RichTextRenderer from './rich-text-element/renderer';

interface CoachStudentInteractionCardProps extends isLocalAware {
  onViewLessonsClick: (moduleId: string, lessonId: string) => void;
  locale: TLocale;
  modules: TListStudentInteractionsSuccess['modules'];
  onDeserializationError: (message: string, error: Error) => void;
}

export const  CoachStudentInteractionCard = ({
  modules,
  locale,
  onViewLessonsClick,
  onDeserializationError,
}: CoachStudentInteractionCardProps) => {
  const dictionary = getDictionary(locale);
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
          className="bg-card-fill border border-divider px-4 py-6 rounded-medium"
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
            <h4 className="text-text-primary md:text-xl text-md font-bold">{dictionary.components.coachStudentInteractionCard.module} {module.position}: {module.title}</h4>
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
                          <h5 className="text-text-primary md:text-lg text-sm font-bold">{dictionary.components.coachStudentInteractionCard.lesson} {lesson.position}: {lesson.title}</h5>
                        </div>
                        <Button
                          onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                            e?.stopPropagation();
                            onViewLessonsClick(module.id, lesson.id);
                          }}
                          variant='text'
                          text={dictionary.components.coachStudentInteractionCard.viewLesson}
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent value={`lesson-${lesson.id}`} className="pb-4">
                      {/* Student-Coach Interactions */}
                      <div className="flex flex-col gap-4 mt-4">
                        <hr className="flex-grow border-t border-divider" />
                        {lesson.textInputs?.length > 0 ? (
                          lesson.textInputs.map((input, index) => (
                            <div
                              key={`text-input-${index}`}
                              className="w-full p-4 bg-base-neutral-800 rounded-medium border border-base-neutral-700"
                            >
                              {/* Question Section */}
                              <div className="flex flex-col gap-2 items-start">
                                <Button
                                  hasIconLeft
                                  iconLeft={<IconTextInput />}
                                  text={dictionary.components.coachStudentInteractionCard.textInput}
                                  variant="text"
                                  className="p-0 text-base-white hover:text-base-white"
                                />
                                <p className="text-text-secondary">{input?.helperText}</p>
                              </div>

                              <hr className="my-4 border-t border-divider" />

                              {/* Student Answer Section */}
                              <div className="flex flex-col gap-2 items-start">
                                <Button
                                  text={dictionary.components.coachStudentInteractionCard.studentReply}
                                  variant="text"
                                  className="p-0 text-base-white hover:text-base-white"
                                />
                                <RichTextRenderer
                                  content={input?.progress?.answer ?? ''}
                                  className="text-text-secondary"
                                  onDeserializationError={onDeserializationError}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-text-secondary text-sm">
                            {dictionary.components.coachStudentInteractionCard.noInteractionsYet}
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