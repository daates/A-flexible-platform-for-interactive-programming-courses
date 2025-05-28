'use client';
import ReactMarkdown from 'react-markdown';

export default function MarkdownViewer({ content }) {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}