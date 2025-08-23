import { Uploader } from './drag-and-drop-uploader/uploader';
import RichTextEditor from './rich-text-element/editor';
import { SectionHeading } from './text';

export function IntroOutlineForm() {
    return (
        <div className="flex flex-col gap-4">
            <SectionHeading text="Introduction" />
            <label htmlFor="introduction" className="text-sm text-text-secondary">
                Course introduction (600 characters max)
            </label>
            <RichTextEditor
                name="introduction"
                placeholder="Write course introduction"
                initialValue={undefined}
                locale="en"
                onLoseFocus={() => {}}
                onDeserializationError={() => {}}
            />
            <label className="text-sm text-text-secondary">
                Introduction video
            </label>
            <Uploader
                onDownload={() => {}}
                onDelete={() => {}}
                variant="video"
                onFilesChange={() => {
                    throw Error("File upload failed");
                }}
                onUploadComplete={() => {}}
                locale="en"
                type="single"
                maxSize={15}
                file={null}
            />
        </div>
    );
}
