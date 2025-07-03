interface AssessmentFormProps {
    courseSlug: string;
}

export default function AssessmentForm(props: AssessmentFormProps) {
    return (
        <div className="text-white">Form for {props.courseSlug} assessment</div>
    );
}
