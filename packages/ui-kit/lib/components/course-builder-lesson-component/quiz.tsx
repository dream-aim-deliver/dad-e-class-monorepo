import {
  CourseElementTemplate,
  CourseElementType,
  DesignerComponentProps,
  FormComponentProps
} from "../course-builder/types";

// Inline QuizEdit dependencies
import { Dropdown } from "../dropdown";
import {
  QuizType,
  QuizTypeTwoElement,
  QuizTypeThreeElement,
  QuizTypeFourElement,
  QuizTypeOneElement,
} from "../course-builder-lesson-component/types";
import QuizTypeOne from "../quiz/quiz-type-one/quiz-type-one";
import QuizTypeTwo from "../quiz/quiz-type-two/quiz-type-two";
import QuizTypeThree from "../quiz/quiz-type-three/quiz-type-three";
import QuizTypeFour from "../quiz/quiz-type-four/quiz-type-four";
import { getDictionary, TLocale } from "@maany_shr/e-class-translations";
import DesignerLayout from "../designer-layout";
import { IconQuiz } from "../icons/icon-quiz";

const quizElement: CourseElementTemplate = {
  type: CourseElementType.Quiz,
  designerBtnElement: {
    icon: IconQuiz,
    label: "Quiz"
  },
  designerComponent: DesignerComponent,
  formComponent: formComponent,
};

function DesignerComponent({
  elementInstance,
  onUpClick,
  onDownClick,
  onDeleteClick,
  locale,
}: DesignerComponentProps) {
  if (elementInstance.type !== CourseElementType.Quiz) return null;

  const quizType = elementInstance.quizType as QuizType;

  const dictionary = getDictionary(locale);

  // Options for dropdown
  const typeOptions = [
    { label: dictionary.components.quiz.typeOneText, value: "quizTypeOne" },
    { label: dictionary.components.quiz.typeTwoText, value: "quizTypeTwo" },
    { label: dictionary.components.quiz.typeThreeText, value: "quizTypeThree" },
    { label: dictionary.components.quiz.typeFourText, value: "quizTypeFour" },
  ];

  return (
    <DesignerLayout
      type={elementInstance.type}
      title={dictionary.components.quiz.quizText}
      icon={<IconQuiz classNames="w-6 h-6" />}
      onUpClick={() => onUpClick?.(elementInstance.id)}
      onDownClick={() => onDownClick?.(elementInstance.id)}
      onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
      locale={locale}
      courseBuilder={true}
    >
      {/* Inline QuizEdit logic */}
      <div className="flex flex-col gap-4 mt-4 w-full">
        <Dropdown
          type="simple"
          options={typeOptions}
          onSelectionChange={(selected) => elementInstance.onTypeChange?.(selected as QuizType)}
          text={{ simpleText: "Select Quiz Type" }}
          defaultValue={quizType}
          className="w-fit"
          buttonClassName="bg-base-neutral-700 border-base-neutral-600"
        />
        {quizType === "quizTypeOne" && (
          <QuizTypeOne {...({ ...elementInstance, quizType, locale } as QuizTypeOneElement)} />
        )}
        {quizType === "quizTypeTwo" && (
          <QuizTypeTwo {...({ ...elementInstance, quizType, locale } as QuizTypeTwoElement)} />
        )}
        {quizType === "quizTypeThree" && (
          <QuizTypeThree {...({ ...elementInstance, quizType, locale } as QuizTypeThreeElement)} />
        )}
        {quizType === "quizTypeFour" && (
          <QuizTypeFour {...({ ...elementInstance, quizType, locale } as QuizTypeFourElement)} />
        )}
      </div>
    </DesignerLayout>
  );
}

// Inline QuizPreview logic
// TODO: remove and instead use different types of elements
function formComponent({ elementInstance, locale }: FormComponentProps) {
  if (elementInstance.type !== CourseElementType.Quiz) return null;

  const quizType = elementInstance.quizType as QuizType;
  const dictionary = getDictionary(locale);
  return (
    <div className="flex flex-col gap-4 p-4 bg-card-fill border-[1px] border-card-stroke rounded-medium w-full">
      <div className="flex gap-1 items-start pb-2 border-b-[1px] border-divider">
        <IconQuiz
          classNames="fill-base-white"
          size="6"
        />
        <p className="text-sm text-base-white leading-[150%] font-bold">
          {dictionary.components.quiz.quizText}
        </p>
      </div>
    </div>
  );
}

export function FormComponentWrapper({children, locale}: {
  children: React.ReactNode;
  locale: TLocale;
}) {
  const dictionary = getDictionary(locale);
  return (
    <div className="flex flex-col gap-4 p-4 bg-card-fill border-[1px] border-card-stroke rounded-medium w-full">
      <div className="flex gap-1 items-start pb-2 border-b-[1px] border-divider">
        <IconQuiz
          classNames="fill-base-white"
          size="6"
        />
        <p className="text-sm text-base-white leading-[150%] font-bold">
          {dictionary.components.quiz.quizText}
        </p>
      </div>
      {children}
    </div>
  );
}

export default quizElement;