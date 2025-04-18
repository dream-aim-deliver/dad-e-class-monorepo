import { CourseEmptyState } from './course-empty-state';
import { TLocale } from '@maany_shr/e-class-translations';

export interface CourseCardListProps {
  children?: React.ReactNode;
  locale: TLocale;
  onEmptyStateButtonClick?: () => void;
}

/**
 * A server-side layout component that renders a grid of course cards or an empty state if no children are provided.
 *
 * @param children React nodes representing course cards (e.g., CourseCard, CourseCreatorCard, etc.).
 * @param locale The locale for localization of the empty state message.
 * @param onEmptyStateButtonClick Optional callback for the empty state button (serializable for server rendering).
 *
 * @returns A responsive grid layout with children or an EmptyState component.
 *
 * @example
 * <CourseCardList locale="en">
 *   <CourseCard userType="student" course={courseData} />
 *   <CourseCard userType="creator" course={courseData} />
 * </CourseCardList>
 */
export function CourseCardList({ children, locale, onEmptyStateButtonClick }: CourseCardListProps) {
  // Early return for empty state if no children are provided
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return (
      <CourseEmptyState
        locale={locale}
        onButtonClick={onEmptyStateButtonClick}
      />
    );
  }

  return (
    <div
      className="course-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      role="list"
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <div key={child?.key ?? `course-card-${index}`} role="listitem">
            {child}
          </div>
        ))
      ) : (
        <div key="single-course-card" role="listitem">
          {children}
        </div>
      )}
    </div>
  );
}