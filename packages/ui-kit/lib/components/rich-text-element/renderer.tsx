import { Descendant } from 'slate';
import { deserialize } from './serializer';
import { cn } from '../../utils/style-utils';


/**
 * SlateRenderer Component
 * 
 * Renders Slate content in a read-only format.
 * Supports both string and Descendant array as input.
 * 
 * @param {Object} props - Component properties
 * @param {string | Descendant[]} props.content - The Slate content, either as a string (which is parsed) or as a Descendant array.
 */
function RichTextRenderer({ content, className }: { content: string | Descendant[], className?: string }) {

  // Deserialize the content to Slate format
  const deserializedContent = deserialize(content);

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

  switch (element.type) {
    case "link":
      return (
        <a
          {...attributes}
          href={element.url}
          className="text-button-text-text underline"
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
        <blockquote {...attributes} style={style} className="border-l-2 border-gray-300 pl-2 text-gray-500 italic">
          {children}
        </blockquote>
      );
    case "numbered-list":
      return <ol {...attributes} style={style} className="list-decimal pl-5">{children}</ol>;
    case "bulleted-list":
      return <ul {...attributes} style={style} className="list-disc pl-5">{children}</ul>;
    case "list-item":
      return <li {...attributes} style={style}>{children}</li>;
    case "h1":
      return <h1 {...attributes} style={style} className="text-2xl font-bold">{children}</h1>;
    case "h2":
      return <h2 {...attributes} style={style} className="text-xl font-bold">{children}</h2>;
    default:
      return <p {...attributes} style={style} className="text-base">{children}</p>;
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
  if (leaf.highlight) content = <mark>{content}</mark>;
  if (leaf.superscript) content = <sup>{content}</sup>;
  if (leaf.subscript) content = <sub>{content}</sub>;

  return <span>{content}</span>;
};

export default RichTextRenderer;