import React from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownRenderer({ content }: { content: string }) {
  // Render markdown on the server to avoid shipping react-markdown to the client
  return (
    <ReactMarkdown>{content}</ReactMarkdown>
  );
}
