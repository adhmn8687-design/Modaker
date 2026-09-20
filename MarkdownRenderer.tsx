import React, { useEffect, useRef } from 'react';

interface MarkdownRendererProps {
  content: string;
}

declare global {
  interface Window {
    katex?: {
      renderToString: (text: string, options?: object) => string;
    };
  }
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const renderMathContent = (rawText: string) => {
    if (!window.katex) return rawText;

    // معالجة المعادلات الكبيرة $$...$$
    let processed = rawText.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
      try {
        return window.katex!.renderToString(math, { displayMode: true });
      } catch (e) {
        return `$$${math}$$`;
      }
    });

    // معالجة المعادلات المدمجة $...$
    processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
      try {
        return window.katex!.renderToString(math, { displayMode: false });
      } catch (e) {
        return `$${math}$`;
      }
    });

    return processed;
  };

  return (
    <div 
      ref={containerRef}
      className="prose dark:prose-invert max-w-none text-right rtl"
      dangerouslySetInnerHTML={{ __html: renderMathContent(content) }}
    />
  );
};

export default MarkdownRenderer;
