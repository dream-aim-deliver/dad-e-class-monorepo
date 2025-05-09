import { Button } from "../../button";
import { FC, useState, useEffect } from "react";
import { IconButton } from "../../icon-button";
import { IconTrashAlt } from "../../icons/icon-trash-alt";
import { getDictionary } from "@maany_shr/e-class-translations";
import { TextAreaInput } from "../../text-areaInput";
import { TextInput } from "../../text-input";
import { QuizTypeFourElement } from "../../lesson-components/types";
import { Uploader, UploadedFileType, ImageUploadResponse, UploadResponse } from "../../drag-and-drop/uploader";

type LabelState = {
  letter: string;
  description: string;
};

type ImageState = {
  correctLetter: string;
  file?: UploadedFileType;
};

const QuizTypeFour: FC<QuizTypeFourElement> = ({
  type,
  quizType,
  required,
  id,
  order,
  title,
  description,
  labels,
  images,
  locale,
  onChange,
}) => {
  const dictionary = getDictionary(locale);

  // State
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [quizDescription, setQuizDescription] = useState<string>("");
  const [labelStates, setLabelStates] = useState<LabelState[]>([]);
  const [imageStates, setImageStates] = useState<ImageState[]>([]);

  // Sync state with props (edit/create mode)
  useEffect(() => {
    const hasProps =
      (title && title.trim() !== "") ||
      (description && description.trim() !== "") ||
      (labels && labels.length > 0) ||
      (images && images.length > 0);
  
    if (hasProps) {
      setQuizTitle(title || "");
      setQuizDescription(description || "");
      setLabelStates(
        labels && labels.length > 0
          ? labels.map((lbl) => ({
              letter: lbl.letter,
              description: lbl.description,
            }))
          : []
      );
      setImageStates(
        images && images.length > 0
          ? images.map((img, idx) => ({
              correctLetter: labels?.[idx]?.letter || String.fromCharCode(65 + idx),
              file: img.imageThumbnailUrl
                ? {
                    file: new File([], "image.jpg"),
                    isUploading: false,
                    error: undefined,
                    responseData: {
                      imageId: img.imageId,
                      imageThumbnailUrl: img.imageThumbnailUrl,
                    },
                  }
                : undefined,
            }))
          : []
      );
    } else {
      // Create mode
      setQuizTitle("");
      setQuizDescription("");
      setLabelStates([
        { letter: "A", description: "" },
        { letter: "B", description: "" },
        { letter: "C", description: "" },
      ]);
      setImageStates([
        { correctLetter: "A", file: undefined },
        { correctLetter: "B", file: undefined },
        { correctLetter: "C", file: undefined },
      ]);
    }
    // eslint-disable-next-line
  }, [title, description, labels, images]);
  

  // Keep correctLetter in imageStates in sync with labelStates, but only update if needed
  useEffect(() => {
    setImageStates((prev) => {
      let changed = false;
      const newState = prev.map((img, idx) => {
        const newLetter = labelStates[idx]?.letter || img.correctLetter;
        if (img.correctLetter !== newLetter) {
          changed = true;
          return { ...img, correctLetter: newLetter };
        }
        return img;
      });
      return changed ? newState : prev;
    });
    // eslint-disable-next-line
  }, [labelStates]);

  // Propagate changes up
  useEffect(() => {
    if (onChange) {
      onChange({
        quizType,
        id,
        order,
        title: quizTitle,
        description: quizDescription,
        labels: labelStates,
        images: imageStates.map((img) => ({
          imageId: (img.file?.responseData as ImageUploadResponse | undefined)?.imageId || "",
          correctLetter: img.correctLetter,
          imageThumbnailUrl: (img.file?.responseData as ImageUploadResponse | undefined)?.imageThumbnailUrl || "",
        })),
      });
    }
    // eslint-disable-next-line
  }, [quizTitle, quizDescription, labelStates, imageStates]);
  

  // Handlers
  const handleLabelDescriptionChange = (index: number, value: string) => {
    setLabelStates((prev) =>
      prev.map((lbl, i) =>
        i === index ? { ...lbl, description: value } : lbl
      )
    );
  };

  // ImageUploader handlers (per image)
  const handleDeleteImage = (imgIdx: number) => {
    setImageStates((prev) =>
      prev.map((img, i) =>
        i === imgIdx ? { ...img, file: undefined } : img
      )
    );
  };
  
  const handleDownloadImage = (imgIdx: number) => {
    const fileObj = imageStates[imgIdx]?.file;
    if (fileObj && fileObj.file) {
      const url = URL.createObjectURL(fileObj.file);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileObj.file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };
  
  const handleFilesChange = async (imgIdx: number, files: UploadedFileType[]): Promise<UploadResponse> => {
    const fileObj = files[0];
    const response: ImageUploadResponse = {
      imageId: Math.random().toString(36).substr(2, 9),
      imageThumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
    };
    fileObj.isUploading = false;
    fileObj.responseData = response;
    setImageStates((prev) =>
      prev.map((img, i) => (i === imgIdx ? { ...img, file: fileObj } : img))
    );
    return response;
  };
  

  // Add/delete a pair (label+image)
  const handleAddPair = () => {
    const nextLetter = String.fromCharCode(65 + labelStates.length);
    setLabelStates((prev) => [
      ...prev,
      { letter: nextLetter, description: "" },
    ]);
    setImageStates((prev) => [
      ...prev,
      {
        imageId: "",
        correctLetter: nextLetter,
        imageThumbnailUrl: "",
        files: [],
      },
    ]);
  };

  const handleDeletePair = (idx: number) => {
    setLabelStates((prev) => prev.filter((_, i) => i !== idx));
    setImageStates((prev) => prev.filter((_, i) => i !== idx));
  };


  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-base-white leading-[150%]">
        {dictionary.components.quiz.quizTypeFour.headingText}
      </p>
      <div className="flex flex-col gap-2">
        <TextInput
          inputField={{
            className: "w-full",
            value: quizTitle,
            setValue: setQuizTitle,
            inputText: dictionary.components.quiz.enterTitleText,
          }}
          label={dictionary.components.quiz.quizTitleText}
        />
        <TextAreaInput
          label={dictionary.components.quiz.descriptionText}
          placeholder={dictionary.components.quiz.enterDescriptionText}
          value={quizDescription}
          setValue={setQuizDescription}
        />
        {/* Label-Image Pair Section */}
        <div className="flex flex-col gap-3 w-full">
          {labelStates.map((lbl, idx) => (
            <div key={idx} className="flex gap-2 md:flex-row flex-col items-stretch w-full">
            {/* Label and TextArea */}
              <div className="text-text-primary text-md leading-[120%] font-bold mt-2 flex items-center">
                {lbl.letter})
              </div>
              <div className="w-full flex flex-col md:flex-row gap-2 justify-center items-center">
                <div className="flex-1 w-full">
                  <TextAreaInput
                    placeholder={dictionary.components.quiz.quizTypeFour.choiceDescriptionText}
                    value={lbl.description}
                    setValue={(v) => handleLabelDescriptionChange(idx, v)}
                    className="h-full"
                  />
                </div>
                {/* ImageUploader and delete button */}
                <div className="flex-1 flex items-center md:max-w-1/2 max-w-[300px] w-full">
                  <Uploader
                    type="single"
                    variant="image"
                    locale={locale}
                    file={imageStates[idx]?.file}
                    onDelete={() => handleDeleteImage(idx)}
                    onDownload={() => handleDownloadImage(idx)}
                    onFilesChange={(files) => handleFilesChange(idx, files)}
                    maxSize={5}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <IconButton
                  styles="text"
                  icon={<IconTrashAlt />}
                  size="small"
                  onClick={() => handleDeletePair(idx)}
                  disabled={labelStates.length <= 1}
                />
              </div>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={handleAddPair}
            className="mb-4"
            text={dictionary.components.quiz.addChoiceText}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizTypeFour;
