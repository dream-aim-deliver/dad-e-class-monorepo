import { useRef, useState } from 'react';
import { InputField } from './input-field';
import RichTextEditor from './rich-text-element/editor';
import RichTextRenderer from './rich-text-element/renderer';
import Accordion from './accordion/accordion';
import AccordionItem from './accordion/accordion-item';
import AccordionTrigger from './accordion/accordion-trigger';
import AccordionContent from './accordion/accordion-content';
import { Button } from './button';
import { cn } from '../utils/style-utils';
import { IconButton } from './icon-button';

import { fileMetadata } from '@maany_shr/e-class-models';
import { FilePreview } from './drag-and-drop-uploader/file-preview';
import { IconChevronDown, IconChevronUp, IconCloudUpload, IconTrashAlt } from './icons';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Descendant } from 'slate';
import { z } from 'zod';
import { deserialize, serialize } from './rich-text-element/serializer';

export interface AccordionDataProps {
  title: string;
  content: string;
  iconUrl?: z.infer<typeof fileMetadata.FileMetadataImageSchema>;
}

export interface AccordionBuilderProps extends isLocalAware {
  onChange: (data: AccordionDataProps) => void;
  initialData: AccordionDataProps | null;
  onItemDelete: (orderNo: number) => void;
  onItemDown: (orderNo: number) => void;
  onItemUp: (orderNo: number) => void;
  orderNo: number;
  onImageChange: (metadata: fileMetadata.TFileUploadRequest, signal: AbortSignal) => Promise<void>;
  onIconDelete: (id: string) => void;
  onIconDownload: (id: string) => void;

}

export function AccordionBuilderEdit({ onChange, initialData, onItemDelete, onItemDown, onItemUp, orderNo, onImageChange, onIconDelete, onIconDownload, locale }: AccordionBuilderProps) {
  const dictionary = getDictionary(locale);
  // Separate state variables for each field to prevent state synchronization issues
  const [title, setTitle] = useState<string>(initialData?.title || '');
  const [content, setContent] = useState<Descendant[]>(
    deserialize({
      serializedData: initialData?.content,
      onError: (msg, err) => console.error(msg, err),
    })
  );
  const [iconUrl, setIconUrl] = useState<fileMetadata.TFileMetadata | null>(initialData?.iconUrl || null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Helper function to create accordion data from current state
  const createAccordionData = (titleValue?: string, contentValue?: string): AccordionDataProps => {
    return {
      title: titleValue ?? title,
      content: contentValue ?? serialize(content),
      iconUrl
    };
  };
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.[0];
    if (newFile) {
      // Create abort controller for this upload
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const metadata: fileMetadata.TFileMetadata = {
        id: new Date().toISOString(),
        name: newFile.name,
        mimeType: newFile.type,
        size: newFile.size,
        category: 'image',
        status: 'processing', // Set to processing initially
        url: URL.createObjectURL(newFile),
        thumbnailUrl: URL.createObjectURL(newFile),
        checksum: "",
      };
      setIconUrl(metadata);

      try {
        await onImageChange(metadata, controller.signal);
      } catch (error) {
        if (error.name === 'AbortError') {
          // Upload was cancelled, clean up
          setIconUrl(null);
        }
      } finally {
        // Clear the abort controller reference
        abortControllerRef.current = null;
      }

      // Reset file input so the same file can be uploaded again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIconUrl(null);
  };

  return (
    <div className=' w-full p-4 text-text-secondary bg-base-neutral-800 border border-base-neutral-700 flex flex-col gap-4 rounded-md'>
      <div className="flex items-center justify-between gap-4 overflow-x-auto text-button-primary-text ">
        {/* Title and Icon */}
        <div className="flex items-center gap-4 flex-1 text-button-text-text">
          <span className="min-w-0 flex-shrink-0">
            <h4 className="md:text-3xl text-lg font-semibold">{orderNo}.</h4>
          </span>

          {!iconUrl && <><Button

            text='upload icon'

            variant='text'
            size='small'
            hasIconLeft={true}
            iconLeft={<IconCloudUpload />}
            className='capitalize px-0'
            onClick={() => fileInputRef.current?.click()}
          />
            <input type="file" onChange={handleFileChange} ref={fileInputRef} className='hidden' /></>
          }

        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <IconButton
            icon={<IconTrashAlt />}
            onClick={() => onItemDelete(orderNo)}
            size="medium"
            styles="text"

          />
          <IconButton
            icon={<IconChevronUp />}
            onClick={() => onItemUp(orderNo - 1)}
            size="medium"
            styles="text"
          />
          <IconButton
            icon={<IconChevronDown />}
            onClick={() => onItemDown(orderNo - 1)}
            size="medium"
            styles="text"
          />
        </div>
      </div>



      <div className='flex flex-col transition-all duration-300 ease-in-out'>
        {iconUrl && <FilePreview
          uploadResponse={iconUrl}
          onDelete={() => onIconDelete(iconUrl?.id)}
          onDownload={() => onIconDownload(iconUrl?.id)}
          onCancel={handleCancelUpload}
          locale={locale}
        />}
        <label className='text-text-secondary md:text-xl leading-[150%] capitalize'>
          {dictionary.components.accordion.visibleText}
        </label>
        <InputField
          inputPlaceholder={dictionary.components.accordion.visiblePlaceholderText}
          className="w-full"
          value={title}
          setValue={(newValue) => {
            // Only update local state, don't trigger parent onChange on every keystroke
            const newData = { ...accordionData, title: newValue };
            setAccordionData(newData);
          }}
          onBlur={() => {
            // Update parent only on blur to match RichTextEditor behavior
            onChange(accordionData);
          }}
          type="text"
          id="visibleText"
        />
      </div>
      <div className='w-full flex flex-col '>
        <label className='text-text-secondary md:text-xl leading-[150%] capitalize'>
          {dictionary.components.accordion.collapsedText}
        </label>
        <div className='w-full'>
          <RichTextEditor
            initialValue={content}

            locale="de"
            name="content"
            onChange={(newValue) => { setContent(newValue) }}
            onLoseFocus={(value) => {
              // Update parent with current state using the serialized content value
              onChange(createAccordionData(undefined, value));
            }}
            placeholder={dictionary.components.accordion.collapsedPlaceholderText}
            onDeserializationError={(message, error) => console.error('Deserialization error:', message)}
          />
        </div>
      </div>
    </div>
  )
}
function AccordionBuilderView({ data }: { data: AccordionDataProps[] }) {
  return (
    <Accordion type='single'>
      {
        data.map((item, index) => (
          <AccordionItem value={item.title} className={cn(
            'py-6',
            data.length - 1 !== index && 'border-b border-divider',
          )}>
            <div className='flex gap-6'>
              <AccordionTrigger value={item.title} className="text-lg font-semibold flex items-center gap-1">
                {item.iconUrl && <img src={item.iconUrl.url} alt="Accordion Icon" className="w-6 h-6 mr-2" />}
                <span>{item.title}</span>
              </AccordionTrigger>
            </div>
            <AccordionContent value={item.title}>
              <RichTextRenderer
                onDeserializationError={(message, error) => console.error('Deserialization error:', message, error)}
                content={item.content}
              />
            </AccordionContent>
          </AccordionItem>
        ))
      }



    </Accordion>
  )

}

export { AccordionBuilderView };