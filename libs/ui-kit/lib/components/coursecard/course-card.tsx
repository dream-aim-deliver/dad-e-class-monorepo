// ...existing code...
export const CourseCard = ({
  course,
  userType = 'student',
  onEdit,
  onDelete,
}: CourseCardProps) => {
  if (!course) {
    console.error('Course data is missing');
    return null;
  }

  if (userType === 'student') {
    return (
      <StudentCourseCard
        title={course.title}
        description={course.description}
        rating={course.rating}
        // ...existing props...
      />
    );
  }
  // ...existing code...
};
// ...existing code...
