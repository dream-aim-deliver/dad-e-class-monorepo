// components/SlateRenderer.tsx
'use client';

import { useMemo } from 'react';
import { Descendant } from 'slate';
import { RenderElement } from './editor';
import React from 'react';

function SlateRenderer({ content }: { content: Descendant[] }) {
  
  return (
    <div className="slate-content text-white">
      {content.map((element, index) => (
        <ElementNode key={index} element={element} />
      ))}
    </div>
  );
};

const ElementNode = ({ element }: { element: any }) => {
  // Simulate Slate's attributes prop
  const attributes = { 'data-slate-node': 'element' };

  // Recursively render children
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
      // Add empty string for editor prop if required
      children={children}
    />
  );
};

const LeafNode = ({ leaf }: { leaf: any }) => {
  let content = leaf.text;
  if (leaf.bold) content = <strong>{content}</strong>;
  if (leaf.italic) content = <em>{content}</em>;
  if (leaf.underline) content = <u>{content}</u>;
  
  return <span>{content}</span>;
};



export default SlateRenderer;