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

type iconUrl = z.infer<typeof fileMetadata.FileMetadataImageSchema>;
export interface AccordionDataProps {
  title: string;
  content: string;
  iconUrl?: iconUrl;
}

export interface AccordionBuilderProps extends isLocalAware {
  onChange: (data: AccordionDataProps) => void;
  initialData: AccordionDataProps | null;
  onItemDelete: (orderNo: number) => void;
  onItemDown: (orderNo: number) => void;
  onItemUp: (orderNo: number) => void;
  orderNo: number;
  totalItems: number;
  onImageChange: (metadata: fileMetadata.TFileUploadRequest, signal: AbortSignal) => Promise<iconUrl>;
  onIconDelete: (id: string) => void;
  onIconDownload: (id: string) => void;

}

export function AccordionBuilderEdit({ onChange, initialData, onItemDelete, onItemDown, onItemUp, orderNo, totalItems, onImageChange, onIconDelete, onIconDownload, locale }: AccordionBuilderProps) {
  const dictionary = getDictionary(locale);
  const [title, setTitle] = useState<string>(initialData?.title || '');
  const [content, setContent] = useState<Descendant[]>(
    deserialize({
      serializedData: initialData?.content,
      onError: (msg, err) => console.error(msg, err),
    })
  );
  const [iconUrl, setIconUrl] = useState<iconUrl | null>(initialData?.iconUrl || null);

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
        const imageMetadata = await onImageChange(metadata, controller.signal);
        // Mark upload as available so preview shows image instead of loader
        setIconUrl(imageMetadata);
        // Notify parent about updated icon
        onChange(createAccordionData());
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
      <div className="flex items-center justify-between  overflow-x-auto text-button-primary-text ">
        {/* Title and Icon */}
        <div className="flex items-center gap-4 flex-1 text-button-text-text">
          <span className="min-w-0 flex-shrink-0">
            <h4 className="md:text-3xl text-lg font-semibold">{orderNo}.</h4>
          </span>

          {!iconUrl && <><Button

            text={dictionary.components.accordion.uploadIconText}

            variant='text'
            size='small'
            hasIconLeft={true}
            iconLeft={<IconCloudUpload />}
            className='capitalize px-0'
            onClick={() => fileInputRef.current?.click()}
          />
            <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className='hidden' /></>
          }

        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <IconButton
            icon={<IconTrashAlt />}
            onClick={() => onItemDelete(orderNo)}
            size="medium"
            styles="text"
            title={dictionary.components.accordion.deleteText}
          />
          <IconButton
            icon={<IconChevronUp />}
            onClick={() => onItemUp(orderNo)}
            size="medium"
            styles="text"
            title={dictionary.components.accordion.moveUpText}
            disabled={orderNo === 1}
          />
          <IconButton
            icon={<IconChevronDown />}
            onClick={() => onItemDown(orderNo)}
            size="medium"
            styles="text"
            title={dictionary.components.accordion.moveDownText}
            disabled={typeof totalItems === 'number' ? orderNo === totalItems : false}

          />
        </div>
      </div>
      {iconUrl && (
        <FilePreview
          uploadResponse={iconUrl}
          onDelete={() => iconUrl?.id && onIconDelete(iconUrl.id)}
          onDownload={() => iconUrl?.id && onIconDownload(iconUrl.id)}
          onCancel={handleCancelUpload}
          locale={locale}
        />
      )}


      <div className='flex flex-col transition-all duration-300 ease-in-out'>

        <label className='text-text-secondary md:text-xl leading-[150%] capitalize'>
          {dictionary.components.accordion.visibleText}
        </label>
        <InputField
          inputPlaceholder={dictionary.components.accordion.visiblePlaceholderText}
          className="w-full"
          value={title}
          setValue={(newValue) => setTitle(newValue)}
          onBlur={() => onChange(createAccordionData())}
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
            locale={locale}
            name="content"
            onChange={(newValue) => setContent(newValue)}
            onLoseFocus={(value) => onChange(createAccordionData(undefined, value))}
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
          <AccordionItem key={item.title ?? `item-${index}`} value={item.title ?? String(index)} className={cn(
            'py-6',
            data.length - 1 !== index && 'border-b border-divider',
          )}>
            <div className='flex gap-6 items-center'>
            <h4 className="min-w-0 flex-shrink-0 text-button-text-text text-xl md:text-[32px]">{index + 1}.</h4>
              <AccordionTrigger value={item.title ?? String(index)} className="text-lg font-semibold flex items-center gap-6">
              
                <span className="flex items-center gap-3">
                  {item.iconUrl && (
                    <span className="flex items-center justify-center">
                      <img src={item.iconUrl.url} alt="Accordion Icon" className="w-6 h-6" />
                    </span>
                  )}
                  <h5 className='text-text-primary md:text-[24px] text-lg '>{item.title}</h5>
                </span>
              </AccordionTrigger>
            </div>
            <AccordionContent className='ml-12' value={item.title ?? String(index)}>
              <RichTextRenderer
                className='text-text-secondary'
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