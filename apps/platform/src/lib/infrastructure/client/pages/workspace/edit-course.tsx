interface EditCoursesProps {
    slug: string;
}

export default function EditCourse({ slug }: EditCoursesProps) {
    return <div>Edit course: {slug}</div>;
}
