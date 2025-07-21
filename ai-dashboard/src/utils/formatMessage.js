import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

export default function formatMessage(msg) {
  // Regex to match multi-line code blocks
  const multiLineCodeRegex = /```(.*?)```/gs;
  // Regex to match inline code
  const inlineCodeRegex = /`(.*?)`/g;
  // Regex to match URLs in the form of <https://example.com/>
  const urlRegex = /<https?:\/\/[^\s<>]+>/g;

  const formattedMessage = msg.split(multiLineCodeRegex).map((part, index) =>
    index % 2 === 1
      ? <SyntaxHighlighter key={index} language="javascript">{part}</SyntaxHighlighter>
      : <p style={{ whiteSpace: 'pre-line' }} key={index}>{part}</p>
  );

  return formattedMessage.flatMap((part, index) =>
    typeof part === 'string'
      ? part.split(inlineCodeRegex).map((txt, i) =>
          i % 2 === 1
            ? <SyntaxHighlighter key={`${index}-${i}`} language="javascript">{txt}</SyntaxHighlighter>
            : txt.split(urlRegex).map((subPart, j) =>
                j % 2 === 1
                  ? <a key={`${index}-${i}-${j}`} href={subPart.slice(1, -1)} target="_blank" rel="noopener noreferrer">{subPart.slice(1, -1)}</a>
                  : subPart
              )
        )
      : part
  );
}
