import {
    CourseElementTemplate,
    CourseElementType,
    DesignerComponentProps,
    FormComponentProps,
} from '../course-builder/types';
import { getDictionary } from '@maany_shr/e-class-translations';
import { IconQuiz } from '../icons/icon-quiz';
import { LinkPreview } from '../links';
import DesignerLayout from '../designer-layout';
import { IconLink } from '../icons/icon-link';

const linksElement: CourseElementTemplate = {
    type: CourseElementType.Quiz,
    designerBtnElement: {
        icon: IconQuiz,
        label: 'Quiz',
    },
    // @ts-ignore
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
};

interface LinkDesignerComponentProps extends DesignerComponentProps {}

// TODO: Implement the designer component for links
function DesignerComponent({
    elementInstance,
    onUpClick,
    onDownClick,
    onDeleteClick,
    locale,
}: LinkDesignerComponentProps) {
    return (
        <DesignerLayout
            type={elementInstance.type}
            title="Links"
            icon={<IconLink classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
        >
            <span>To implement</span>
        </DesignerLayout>
    );
}

export function FormComponent({ elementInstance, locale }: FormComponentProps) {
    if (elementInstance.type !== CourseElementType.Links) return null;

  return (
    <div className="flex flex-col gap-4 p-4 bg-card-fill border-[1px] border-card-stroke rounded-medium w-full">
      {elementInstance.links.map((link, index) => (
        <LinkPreview
          key={`link-${elementInstance.id}-${index}`}
          title={link.title as string}
          url={link.url as string}
          customIcon={link.customIcon}
        />
      ))}
    </div>
  );
};

export default linksElement;
