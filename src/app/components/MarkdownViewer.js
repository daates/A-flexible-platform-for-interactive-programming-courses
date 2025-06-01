"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MarkdownViewer({ content, className }) {
  if (!content || content.trim() === "") {
    return (
      <div className="prose prose-sm max-w-none text-gray-500 dark:text-gray-400">
        Нет вывода
      </div>
    );
  }

  return (
    <div className={`prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 dark:prose-invert  ${className || ""}`}>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                customStyle={{
                    display: "inline-block",
                    minWidth: "fit-content",
                    padding: "0.5rem",
                    borderRadius: "0.25rem",
                    border: "1px solid #4b5563",
                    backgroundColor: "#1e1e1e", 
                  }}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}