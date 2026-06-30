import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ content }: { content: string }) {
  // Render markdown on the server to avoid shipping react-markdown to the client
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ node, ...props }) => {
          const title = props.title || (typeof props.children === 'string' ? props.children : undefined) || props.href || 'Link';
          return <a title={title} {...props} />;
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
