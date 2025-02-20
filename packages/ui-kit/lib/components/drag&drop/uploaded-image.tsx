import { Badge } from '../badge';
import clsx from 'clsx';
import { DragAndDrop } from './drag&drop';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { IconCloudDownload } from '../icons/icon-cloud-download';
import { IconTrashAlt } from '../icons/icon-trash-alt';
import { IconLoaderSpinner } from '../icons/icon-loader-spinner';

export type UploadedImageProps = {
  files: file[];
  onUpload: (files: File[]) => void;
  handleDelete: (index: number) => void;
  className: string;
  text: {
    title?: string;
    buttontext?: string;
    dragtext?: string;
    filesize?: string;
    uploading?: string;
    cancelUpload?: string;
  };
};
export type file = {
  file: File;
  isUploading: boolean;
};

/**
 * A reusable component for managing image uploads with support for drag-and-drop, image previews, progress indicators, and deletion.
 *
 * @param files An array of uploaded images. Each file includes:
 *  - `file`: The actual `File` object being uploaded.
 *  - `isUploading`: A boolean indicating whether the file is currently being uploaded.
 * @param onUpload Callback function triggered when new images are uploaded. Receives an array of `File` objects.
 * @param handleDelete Callback function triggered when an image is deleted. Receives the index of the image to delete.
 * @param className Optional additional CSS class names to customize the component's appearance.
 * @param text Object containing customizable text for various parts of the component:
 *  - `title`: Text displayed when dragging images over the drop area.
 *  - `buttontext`: Text for the button in the drag-and-drop area.
 *  - `dragtext`: Instructional text displayed in the drag-and-drop area when no images are uploaded.
 *  - `filesize`: Label for displaying the maximum file size allowed.
 *  - `uploading`: Text displayed while an image is being uploaded.
 *  - `cancelUpload`: Text for the button to cancel an ongoing upload.
 *
 * @example
 * <UploadedImage
 *   files={[
 *     { file: new File(["content"], "example.jpg"), isUploading: false },
 *   ]}
 *   onUpload={(files) => console.log(files)}
 *   handleDelete={(index) => console.log("Delete image at index", index)}
 *   className="custom-class"
 *   text={{
 *     title: "Drop your images here",
 *     buttontext: "Choose Images",
 *     dragtext: "or drag and drop images here",
 *     filesize: "Max size",
 *     uploading: "Uploading...",
 *     cancelUpload: "Cancel",
 *   }}
 * />
 */

export function UploadedImage({
  files,
  onUpload,
  handleDelete,
  className,
  text,
}: UploadedImageProps) {
  const handleDownload = (file: File) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <div>
      {files.length > 0 ? (
        <div className={clsx('w-full ', className)}>
          {files.map(({ file, isUploading }, index) => (
            <div
              key={index}
              className="rounded flex w-full justify-between items-center"
            >
              <div className="flex gap-3">
                {file &&
                  (isUploading ? (
                    <div className="w-12 h-12 flex items-center justify-center rounded-medium bg-base-neutral-800 border-base-neutral-700 ">
                      <IconLoaderSpinner classNames="w-6 h-6 animate-spin" />
                    </div>
                  ) : (
                    <img
                      data-testid="image-preview"
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ))}

                <div className="flex flex-col gap-1 justify-center ">
                  <p className="text-sm text-base-neutral-50 line-clamp-2">
                    {file.name}
                  </p>
                  <p className="text-text-secondary text-xs flex items-start">
                    {isUploading ? (
                      <Badge variant={'info'} text={text.uploading} />
                    ) : (
                      <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    )}
                  </p>
                </div>
              </div>
              <div>
                {isUploading ? (
                  <Button
                    variant="text"
                    className="px-0"
                    onClick={() => handleDelete(index)}
                    text={text.cancelUpload}
                  />
                ) : (
                  <div className="font-bold flex items-center cursor-pointer">
                    <IconButton
                      icon={<IconCloudDownload />}
                      size="small"
                      styles="text"
                      onClick={() => handleDownload(file)}
                    />
                    <IconButton
                      icon={<IconTrashAlt />}
                      styles="text"
                      size="small"
                      onClick={() => handleDelete(index)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DragAndDrop
          className="w-full"
          onUpload={onUpload}
          acceptedFileTypes={['image/*']}
          text={text}
        />
      )}
    </div>
  );
}
