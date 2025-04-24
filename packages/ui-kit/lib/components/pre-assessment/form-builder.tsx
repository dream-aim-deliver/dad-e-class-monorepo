import { PreAssessmentInstance } from "./index";

interface FormBuilderProps {
    isLoading: boolean;
    isError: boolean;
    onSubmit: (PreAssessmentElement: PreAssessmentInstance[]) => void;
    Elements: PreAssessmentInstance[];
}
export function FormBuilder(){

}