import { Descendant } from 'slate';
import { deserialize } from './serializer';
import { cn } from '../../utils/style-utils';


export interface RichTextRendererProps {
  content: string | Descendant[];
  onDeserializationError: (message: string, error: Error) => void;
  className?: string;
}

/**
 * SlateRenderer Component
 *
 * Renders Slate content in a read-only format.
 * Supports both string and Descendant array as input.
 *
 * @param {Object} props - Component properties
 * @param {string | Descendant[]} props.content - The Slate content, either as a string (which is parsed) or as a Descendant array.
 * @param {function} props.onDeserializationError - Callback function to handle deserialization errors.
 * @param {string} [props.className] - Optional additional class names for styling.
 */
function RichTextRenderer({
  content,
  onDeserializationError,
  className
}: RichTextRendererProps) {
  // Deserialize the content to Slate format
  const deserializedContent = deserialize({
    serializedData: content,
    onError: onDeserializationError
  });

  return (
    <div className={cn(className)}>
      {deserializedContent.map((element, index) => (
        <ElementNode key={index} element={element} />
      ))}
    </div>
  );
}

/**
 * ElementNode Component
 *
 * Recursively renders a Slate element node and its children.
 *
 * @param {Object} props - Component properties
 * @param {any} props.element - A Slate element containing children.
 */
const RenderElement = ({ attributes, children, element }: {
  attributes: any;
  children: any;
  element: any;
}) => {
  const style = { textAlign: element.align };

  // Helper to check if element is empty (only contains empty text)
  const isEmpty = element.children?.length === 1 && element.children[0].text === "";

  // For empty elements, insert a non-breaking space to prevent CSS collapse
  const content = isEmpty ? <>&nbsp;</> : children;

  switch (element.type) {
    case "link":
      return (
        <a
          {...attributes}
          href={element.url}
          className="text-button-text-text underline cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => {
            if (!element.url) return;
            event.preventDefault();
            window.open(element.url, "_blank");
          }}
        >
          {children}
        </a>
      );
    case "block-quote":
      return (
        <blockquote {...attributes} style={style} className={`border-l-2 border-base-brand-400 text-base-brand-400 pl-2 italic ${isEmpty ? "h-[1lh]" : ""}`}>
          {content}
        </blockquote>
      );
    case "numbered-list":
      return <ol {...attributes} style={style} className="list-decimal pl-3 pb-4">{children}</ol>;
    case "bulleted-list":
      return <ul {...attributes} style={style} className="list-disc pl-3 pb-4">{children}</ul>;
    case "unordered-list":
      return <ul {...attributes} style={style} className="list-disc pl-3 pb-4">{children}</ul>;
    case "list-item":
      return <li {...attributes} style={style} className="ml-4">{children}</li>;
    case "h1":
      return <h1 {...attributes} style={style} className={`text-3xl font-bold ${isEmpty ? "h-[1lh]" : ""}`}>{content}</h1>;
    case "h2":
      return <h2 {...attributes} style={style} className={`text-2xl font-bold ${isEmpty ? "h-[1lh]" : ""}`}>{content}</h2>;
    case "h3":
      return <h3 {...attributes} style={style} className={`text-xl font-bold ${isEmpty ? "h-[1lh]" : ""}`}>{content}</h3>;
    case "h4":
      return <h4 {...attributes} style={style} className={`text-lg font-bold ${isEmpty ? "h-[1lh]" : ""}`}>{content}</h4>;
    case "h5":
      return <h5 {...attributes} style={style} className={`text-md font-bold ${isEmpty ? "h-[1lh]" : ""}`}>{content}</h5>;
    case "h6":
      return <h6 {...attributes} style={style} className={`text-sm font-bold ${isEmpty ? "h-[1lh]" : ""}`}>{content}</h6>;
    case "horizontal-rule":
      return (
        <div {...attributes} style={style}>
          <hr className="my-4 border-t-2 border-base-neutral-500" />
          {children}
        </div>
      );
    case "paragraph": {
      return (
        <p
          {...attributes}
          style={style}
          className={`text-base whitespace-pre-wrap leading-normal ${isEmpty ? "h-[1lh]" : ""}`}
        >
          {content}
        </p>
      );
    }
    default:
      return <div {...attributes} style={style} className={`text-base whitespace-pre-wrap ${isEmpty ? "h-[1lh]" : ""}`}>{content}</div>;
  }
};

const ElementNode = ({ element }: { element: any }) => {
  // Simulate Slate's attributes prop
  const attributes = { 'data-slate-node': 'element' };

  // Recursively render children elements or leaves
  const children = element.children.map((child: any, index: number) => {
    if (child.children) {
      return <ElementNode key={index} element={child} />;
    }
    return <LeafNode key={index} leaf={child} />;
  });

  return (
    <RenderElement
      attributes={attributes}
      element={element}
      children={children}
    />
  );
};

/**
 * LeafNode Component
 *
 * Renders individual text formatting elements inside a Slate editor.
 * Supports bold, italic, underline, strikethrough, code, highlight, superscript, and subscript.
 *
 * @param {Object} props - Component properties
 * @param {any} props.leaf - A Slate leaf node containing text and formatting.
 */
const LeafNode = ({ leaf }: { leaf: any }) => {
  let content = leaf.text;
  if (leaf.bold) content = <strong>{content}</strong>;
  if (leaf.italic) content = <em>{content}</em>;
  if (leaf.underline) content = <u>{content}</u>;
  if (leaf.strikethrough) content = <del>{content}</del>;
  if (leaf.code) content = <code>{content}</code>;
  if (leaf.highlight) content = <mark className="bg-base-brand-500 text-black border px-1">{content}</mark>;
  if (leaf.superscript) content = <sup>{content}</sup>;
  if (leaf.subscript) content = <sub>{content}</sub>;

  return <span className="whitespace-pre-wrap">{content}</span>;
};

export default RichTextRenderer;
