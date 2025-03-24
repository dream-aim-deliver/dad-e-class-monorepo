import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Superscript,
    Subscript,
    Highlighter,
    Code,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link,
  } from "lucide-react";
  
  export enum RichTextAction {
    Bold = "bold",
    Italics = "italic",
    Underline = "underline",
    Strikethrough = "strikethrough",
    Superscript = "superscript",
    link="link",
    Subscript = "subscript",
    Highlight = "highlight",
    Code = "code",
    LeftAlign = "left",
    CenterAlign = "center",
    RightAlign = "right",
    JustifyAlign = "justify",
    Divider = "divider",
    BlockQuote = "block-quote",
    NumberedList = "numbered-list",
    BulletedList = "bulleted-list",
    Undo = "undo",
    Redo = "redo",
    unlink="unlink"

  }
  
  export const TEXT_FORMAT_OPTIONS = [
    { id: RichTextAction.Bold, icon: <Bold  size={24}/>, label: "Bold(Ctrl+B)"},
    { id: RichTextAction.Italics, icon: <Italic  size={24}/>, label: "Italics(Ctrl+I)"},
    { id: RichTextAction.Underline, icon: <Underline size={24} />, label: "Underline(Ctrl+U)" },
    {id: RichTextAction.link, icon: <Link size={24} />, label: "Link"},
    {
      id: RichTextAction.Highlight,
      icon: <Highlighter size={24}/>,
      label: "Highlight",
      fontSize: 10,
    },
    {
      id: RichTextAction.Strikethrough,
      icon: <Strikethrough />,
      label: "Strikethrough",
    },
    {
      id: RichTextAction.Superscript,
      icon: <Superscript />,
      label: "Superscript",
    },
    {
      id: RichTextAction.Subscript,
      icon: <Subscript />,
      label: "Subscript",
    },
    {
      id: RichTextAction.Code,
      icon: <Code />,
      label: "Code",
    },
  ];
  
  export const TEXT_BLOCK_OPTIONS = [
    {
      id: RichTextAction.LeftAlign,
      icon: <AlignLeft  size={24}/>,
      label: "Align Left",
      
    },
    {
      id: RichTextAction.CenterAlign,
      icon: <AlignCenter size={24}  />,
      label: "Align Center",
    },
    {
      id: RichTextAction.RightAlign,
      icon: <AlignRight size={24} />,
      label: "Align Right",
    },
    {
      id: RichTextAction.JustifyAlign,
      icon: <AlignJustify size={24} />,
      label: "Align Justify",
    },
    {
      id: RichTextAction.BlockQuote,
      icon: <Quote  size={24}/>,
      label: "Block Quote",
    },
    {
      id: RichTextAction.BulletedList,
      icon: <List size={24}/>,
      label: "Bulleted List",
    },
    {
      id: RichTextAction.NumberedList,
      icon: <ListOrdered size={24} />,
      label: "Numbered List",
    },
  ];
  
  export const HEADINGS = ["h1","h2","h3","h4","h5","h6"];
  
  export const LIST_TYPES = ["numbered-list", "bulleted-list"];
  export const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];
  export const TEXT_ACTION_OPTIONS = [
    {
      id: "undo", // You may need to define these actions in your Slate commands
      icon: <Undo size={24} />,
      label: "Undo(Ctrl+Z)"
     
    },
    {
      id: "redo",
      icon: <Redo size={24} />,
      label: "Redo(Ctrl+Y)",
      
    },
  ];