import {
  CourseElementTemplate,
  CourseElementType,
  DesignerComponentProps,
  FormComponentProps
} from "../course-builder/types";
import { getDictionary } from "@maany_shr/e-class-translations";
import { IconQuiz } from "../icons/icon-quiz";
import { LinkPreview } from "../links";

const linksElement: CourseElementTemplate = {
  type: CourseElementType.Quiz,
  designerBtnElement: {
    icon: IconQuiz,
    label: "Quiz"
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
};

// TODO: implement designer component for Links
function DesignerComponent({
  elementInstance,
  onUpClick,
  onDownClick,
  onDeleteClick,
  locale,
}: DesignerComponentProps) {
    return <div>Links Designer Component</div>;
};

export function FormComponent({
  elementInstance,
  locale,
}: FormComponentProps) {
  if (elementInstance.type !== CourseElementType.Links) return null;

  const dictionary = getDictionary(locale);

  // TODO: translate links title
  return (
    <div>
      <div className="flex flex-col gap-4 p-4 bg-card-fill border-[1px] border-card-stroke rounded-medium w-full">
      <div className="flex gap-1 items-start pb-2 border-b-[1px] border-divider">
        <IconQuiz
          classNames="fill-base-white"
          size="6"
        />
        <p className="text-sm text-base-white leading-[150%] font-bold">
          Links
        </p>
      </div>
      {elementInstance.links.map((link, index) => (
        <LinkPreview
          key={`link-${elementInstance.id}-${index}`}
          title={link.title}
          url={link.url}
          customIcon={link.customIcon}
        />
      ))}
    </div>
    </div>
  );
};

export default linksElement;
