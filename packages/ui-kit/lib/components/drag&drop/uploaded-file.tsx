import { Badge } from '../badge';
import clsx from 'clsx';
import { DragAndDrop } from './drag&drop';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { IconCloudDownload } from '../icons/icon-cloud-download';
import { IconTrashAlt } from '../icons/icon-trash-alt';
import { IconFile } from '../icons/icon-file';
import { IconLoaderSpinner } from '../icons/icon-loader-spinner';

export type UploadFileProps = {
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
 * A reusable component for managing file uploads with support for drag-and-drop, progress indicators, and file deletion.
 *
 * @param files An array of files being uploaded. Each file includes:
 *  - `file`: The actual `File` object being uploaded.
 *  - `isUploading`: A boolean indicating whether the file is currently being uploaded.
 * @param onUpload Callback function triggered when new files are uploaded. Receives an array of `File` objects.
 * @param handleDelete Callback function triggered when a file is deleted. Receives the index of the file to delete.
 * @param className Optional additional CSS class names to customize the component's appearance.
 * @param text Object containing customizable text for various parts of the component:
 *  - `title`: Text displayed when dragging files over the drop area.
 *  - `buttontext`: Text for the button in the drag-and-drop area.
 *  - `dragtext`: Instructional text displayed in the drag-and-drop area when no files are uploaded.
 *  - `filesize`: Label for displaying the maximum file size allowed.
 *  - `uploading`: Text displayed while a file is being uploaded.
 *  - `cancelUpload`: Text for the button to cancel an ongoing upload.
 *
 * @example
 * <UploadedFile
 *   files={[
 *     { file: new File(["content"], "example.pdf"), isUploading: false },
 *   ]}
 *   onUpload={(files) => console.log(files)}
 *   handleDelete={(index) => console.log("Delete file at index", index)}
 *   className="custom-class"
 *   text={{
 *     title: "Drop your files here",
 *     buttontext: "Choose Files",
 *     dragtext: "or drag and drop files here",
 *     filesize: "Max size",
 *     uploading: "Uploading...",
 *     cancelUpload: "Cancel",
 *   }}
 * />
 */

export function UploadedFile({
  files,
  onUpload,
  handleDelete,
  className,
  text,
}: UploadFileProps) {
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
                    <div className="w-12 h-12 flex items-center justify-center rounded-medium bg-base-neutral-800 border-base-neutral-700">
                      <IconLoaderSpinner classNames="w-6 h-6 fill-base-neutral-50" />
                    </div>
                  ) : (
                    <div className="min-w-12 h-12 flex items-center justify-center rounded-medium bg-base-neutral-700 border-base-neutral-600">
                      <IconFile classNames="fill-text-primary" />
                    </div>
                  ))}

                <div className="flex flex-col gap-1 justify-center ">
                  <p className="text-sm text-base-neutral-50 line-clamp-2">
                    {file.name}
                  </p>
                  <p className="text-text-secondary text-xs flex items-start">
                    {isUploading ? (
                      <Badge variant={'info'} text={text?.uploading} />
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
          acceptedFileTypes={['application/pdf']}
          text={text}
        />
      )}
    </div>
  );
}
