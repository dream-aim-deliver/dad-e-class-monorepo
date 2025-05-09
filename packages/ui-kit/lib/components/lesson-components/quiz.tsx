import { IconQuiz } from "../icons/icon-quiz";
import {
  CourseElementTemplate,
  CourseElementType,
  DesignerComponentProps,
  FormComponentProps
} from "../course-builder/types";
import DesignerLayout from "./designer-layout";
import { useState } from "react";

// Inline QuizEdit dependencies
import { Dropdown } from "../dropdown";
import {
  QuizType,
  QuizTypeOneElement,
  QuizTypeTwoElement,
  QuizTypeThreeElement,
  QuizTypeFourElement,
  QuizTypeOnePreviewElement,
  QuizTypeTwoPreviewElement,
  QuizTypeThreePreviewElement,
  QuizTypeFourPreviewElement,
} from "../lesson-components/types";
import QuizTypeOne from "../quiz/quiz-type-one/quiz-type-one";
import QuizTypeTwo from "../quiz/quiz-type-two/quiz-type-two";
import QuizTypeThree from "../quiz/quiz-type-three/quiz-type-three";
import QuizTypeFour from "../quiz/quiz-type-four/quiz-type-four";
import QuizTypeOnePreview from "../quiz/quiz-type-one/quiz-type-one-preview";
import QuizTypeTwoPreview from "../quiz/quiz-type-two/quiz-type-two-preview";
import QuizTypeThreePreview from "../quiz/quiz-type-three/quiz-type-three-preview";
import QuizTypeFourPreview from "../quiz/quiz-type-four/quiz-type-four-preview";
import { getDictionary } from "@maany_shr/e-class-translations";

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

  const [quizType, setQuizType] = useState<QuizType>(elementInstance.quizType || "quizTypeOne");
  const dictionary = getDictionary(locale);

  // Options for dropdown
  const typeOptions = [
    { label: "Type 1", value: "quizTypeOne" },
    { label: "Type 2", value: "quizTypeTwo" },
    { label: "Type 3", value: "quizTypeThree" },
    { label: "Type 4", value: "quizTypeFour" },
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
          onSelectionChange={(selected) => {
            if (typeof selected === "string") {
              setQuizType(selected as QuizType);
              elementInstance.quizType = selected as QuizType; // Keep elementInstance in sync
            }
          }}
          text={{ simpleText: "Select Quiz Type" }}
          defaultValue={quizType}
          className="w-fit"
        />
        {quizType === "quizTypeOne" && (
          <QuizTypeOne {...({ ...elementInstance, quizType , locale } as QuizTypeOneElement)} />
        )}
        {quizType === "quizTypeTwo" && (
          <QuizTypeTwo {...({ ...elementInstance, quizType , locale } as QuizTypeTwoElement)} />
        )}
        {quizType === "quizTypeThree" && (
          <QuizTypeThree {...({ ...elementInstance, quizType , locale } as QuizTypeThreeElement)} />
        )}
        {quizType === "quizTypeFour" && (
          <QuizTypeFour {...({ ...elementInstance, quizType , locale } as QuizTypeFourElement)} />
        )}
      </div>
    </DesignerLayout>
  );
}

// Inline QuizPreview logic
function formComponent({ elementInstance , locale}: FormComponentProps) {
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
      {quizType === "quizTypeOne" && <QuizTypeOnePreview {...({...elementInstance , locale} as QuizTypeOnePreviewElement)} />}
      {quizType === "quizTypeTwo" && <QuizTypeTwoPreview {...({...elementInstance} as QuizTypeTwoPreviewElement)} />}
      {quizType === "quizTypeThree" && <QuizTypeThreePreview {...({...elementInstance , locale} as QuizTypeThreePreviewElement)} />}
      {quizType === "quizTypeFour" && <QuizTypeFourPreview {...({...elementInstance , locale} as QuizTypeFourPreviewElement)} />}
    </div>
  );
}

export default quizElement;