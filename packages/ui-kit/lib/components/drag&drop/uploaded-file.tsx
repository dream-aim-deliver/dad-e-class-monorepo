import { Badge } from '../badge';
import clsx from 'clsx';
import { DragAndDrop } from './drag&drop';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { IconCloudDownload } from '../icons/icon-cloud-download';
import { IconTrashAlt } from '../icons/icon-trash-alt';
import { IconFile } from '../icons/icon-file';
import { IconLoaderSpinner } from '../icons/icon-loader-spinner';
import { dictionaries } from '@maany_shr/e-class-translations';

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
export function UploadedFile({
  files,
  onUpload,
  handleDelete,
  className,
  text,
}: UploadFileProps) {
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
