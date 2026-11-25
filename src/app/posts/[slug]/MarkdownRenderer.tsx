import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#232946] mt-10 mb-4 tracking-tight leading-tight" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#232946] mt-10 mb-4 tracking-tight leading-snug border-b-2 border-gray-100 pb-2.5" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-xl sm:text-2xl font-bold text-[#232946] mt-8 mb-3 tracking-tight leading-snug" {...props} />
        ),
        h4: ({ node, ...props }) => (
          <h4 className="text-lg sm:text-xl font-bold text-[#232946] mt-6 mb-2" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="text-base sm:text-[17px] text-gray-700 leading-relaxed mb-5 font-normal" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-outside pl-6 space-y-2 my-5 text-gray-700 text-base sm:text-[17px]" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-outside pl-6 space-y-2 my-5 text-gray-700 text-base sm:text-[17px]" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="leading-relaxed pl-1" {...props} />
        ),
        strong: ({ node, ...props }) => (
          <strong className="font-bold text-[#111827]" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="my-6 border-l-4 border-[#3CB371] bg-emerald-50/50 p-4 sm:p-5 rounded-r-xl italic text-gray-800 text-base sm:text-lg" {...props} />
        ),
        hr: ({ node, ...props }) => (
          <hr className="my-8 border-t-2 border-gray-100" {...props} />
        ),
        a: ({ node, ...props }) => {
          const title = props.title || (typeof props.children === 'string' ? props.children : undefined) || props.href || 'Link';
          const isExternal = typeof props.href === 'string' && props.href.startsWith('http');
          return (
            <a 
              title={title} 
              className="text-[#3CB371] hover:text-[#2e945b] font-semibold underline underline-offset-4 decoration-2 transition-colors cursor-pointer" 
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              {...props} 
            />
          );
        },
        code: ({ node, inline, className, children, ...props }: any) => {
          if (inline) {
            return (
              <code className="bg-gray-100 text-[#232946] px-1.5 py-0.5 rounded text-sm font-mono font-semibold border border-gray-200" {...props}>
                {children}
              </code>
            );
          }
          return (
            <div className="my-6 rounded-xl overflow-hidden border border-[#313244] bg-[#1e1e2e] shadow-sm">
              <pre className="p-4 sm:p-5 overflow-x-auto text-sm font-mono text-[#cdd6f4] leading-relaxed">
                <code {...props}>{children}</code>
              </pre>
            </div>
          );
        },
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-6 border border-gray-200 rounded-xl shadow-2xs">
            <table className="w-full text-left text-sm sm:text-base text-gray-700 border-collapse" {...props} />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th className="bg-gray-50 text-[#111827] font-bold p-3.5 border-b-2 border-gray-200" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="p-3.5 border-b border-gray-100" {...props} />
        ),
        img: ({ node, ...props }) => (
          <img className="rounded-xl max-w-full h-auto mx-auto my-6 shadow-sm border border-gray-100" loading="lazy" alt={props.alt || "Post image"} {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
