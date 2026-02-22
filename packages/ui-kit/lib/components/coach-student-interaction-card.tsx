import { getDictionary, isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { TListStudentInteractionsSuccess } from 'packages/models/src/view-models';
import { fileMetadata } from '@maany_shr/e-class-models';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './accordion';
import { cn } from '../utils/style-utils';
import { IconChevronDown, IconChevronUp, IconCloudUpload } from './icons';
import { Button } from './button';
import RichTextRenderer from './rich-text-element/renderer';
import SingleChoicePreview from './single-choice';
import MultipleChoicePreview from './multiple-check';
import { OneOutOfThreePreview, type OneOutOfThreeData } from './out-of-three/one-out-of-three';
import { FilePreview } from './drag-and-drop-uploader/file-preview';

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
      className="text-text-primary flex flex-col gap-4"
    >
      <section className="text-sm leading-[21px] text-text-secondary">
        <RichTextRenderer
          content={interaction.helperText ?? ''}
          onDeserializationError={onDeserializationError}
        />
      </section>
      {interaction.progress ? (
        <RichTextRenderer
          className="p-2 bg-base-neutral-800 rounded-md"
          content={interaction.progress.answer}
          onDeserializationError={onDeserializationError}
        />
      ) : (
        <p className="text-text-secondary text-sm italic">{dict.noAnswer}</p>
      )}
    </div>
  );

  const renderSingleChoice = (interaction: Extract<TInteraction, { type: 'singleChoice' }>, index: number) => {
    const options = interaction.options.map(opt => ({
      id: opt.id,
      name: opt.name,
      isSelected: interaction.progress?.answerId === opt.id,
    }));

    return (
      <div
        key={`single-choice-${interaction.id}-${index}`}
        className="text-text-primary flex flex-col gap-2"
      >
        <SingleChoicePreview
          title={interaction.title}
          options={options}
          filled={true}
          required={interaction.required}
        />
        {!interaction.progress && (
          <p className="text-text-secondary text-sm italic">{dict.noAnswer}</p>
        )}
      </div>
    );
  };

  const renderMultipleChoice = (interaction: Extract<TInteraction, { type: 'multipleChoice' }>, index: number) => {
    const options = interaction.options.map(opt => ({
      id: opt.id,
      name: opt.name,
      isSelected: interaction.progress?.answerIds?.includes(opt.id) ?? false,
    }));

    return (
      <div
        key={`multiple-choice-${interaction.id}-${index}`}
        className="text-text-primary flex flex-col gap-2"
      >
        <MultipleChoicePreview
          title={interaction.title}
          options={options}
          filled={true}
          required={interaction.required}
        />
        {!interaction.progress && (
          <p className="text-text-secondary text-sm italic">{dict.noAnswer}</p>
        )}
      </div>
    );
  };

  const renderOneOutOfThree = (interaction: Extract<TInteraction, { type: 'oneOutOfThree' }>, index: number) => {
    const oneOutOfThreeData: OneOutOfThreeData = {
      tableTitle: interaction.title,
      columns: interaction.columns.map(col => ({
        id: col.id,
        columnTitle: col.name,
        selected: false,
      })),
      rows: interaction.rows.map(row => ({
        id: row.id,
        rowTitle: row.name,
        columns: interaction.columns.map(col => ({
          id: col.id,
          columnTitle: col.name,
          selected: interaction.progress?.answers?.some(
            a => a.rowId === row.id && a.columnId === col.id
          ) ?? false,
        })),
      })),
    };

    return (
      <div
        key={`one-out-of-three-${interaction.id}-${index}`}
        className="flex flex-col gap-2"
      >
        <OneOutOfThreePreview
          data={oneOutOfThreeData}
          displayOnly={true}
          required={interaction.required}
        />
        {!interaction.progress && (
          <p className="text-text-secondary text-sm italic">{dict.noAnswer}</p>
        )}
      </div>
    );
  };

  const renderUploadFiles = (interaction: Extract<TInteraction, { type: 'uploadFiles' }>, index: number) => (
    <div
      key={`upload-files-${interaction.id}-${index}`}
      className="p-4 pt-2 w-full border rounded-md bg-base-neutral-800 flex flex-col gap-4 border-base-neutral-700"
    >
      <div className="flex items-center gap-2 flex-1 text-text-primary py-4 border-b border-divider">
        <span className="min-w-0 flex-shrink-0">
          <IconCloudUpload />
        </span>
        <p className="text-md font-important leading-[24px]">
          {dictionary.components.courseBuilder.uploadFilesText}
        </p>
      </div>

      <p className="font-important text-text-primary leading-[150%] text-sm md:text-md">
        {interaction.description}
      </p>

      {interaction.progress ? (
        <>
          {interaction.progress.files.length > 0 && (
            <div className="flex flex-col gap-2 w-full">
              {interaction.progress.files.map((file, fileIndex) => {
                const fileMeta: fileMetadata.TFileMetadata = {
                  id: String(file.id),
                  name: file.name,
                  size: file.size,
                  status: 'available',
                  category: 'generic',
                  url: file.downloadUrl,
                };
                return (
                  <FilePreview
                    key={file.id || `file-${fileIndex}`}
                    uploadResponse={fileMeta}
                    locale={locale}
                    readOnly={true}
                    deletion={{ isAllowed: false }}
                    onDownload={() => {
                      window.open(file.downloadUrl, '_blank');
                    }}
                  />
                );
              })}
            </div>
          )}

          {interaction.progress.comment && (
            <div className="w-full flex flex-col gap-2">
              <p className="text-sm md:text-md text-text-secondary flex gap-1 items-center">
                {dictionary.components.courseBuilder.additionalCommentsTooltip}
              </p>
              <p className="text-sm text-text-primary">{interaction.progress.comment}</p>
            </div>
          )}
        </>
      ) : (
        <p className="text-text-secondary text-sm italic">{dict.noAnswer}</p>
      )}
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

          <AccordionContent value={`module-${module.id}`}>
            <div className="pt-4 pb-6">
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
                          lesson.interactions.map((interaction, index) => (
                            <div key={`wrapper-${interaction.id}-${index}`} className="flex flex-col gap-2 p-4 border border-divider rounded-md">
                              {renderInteraction(interaction, index)}
                            </div>
                          ))
                        ) : (
                          <p className="text-text-secondary text-sm italic">
                            {dict.noInteractionsYet}
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
