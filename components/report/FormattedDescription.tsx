import React from "react";
import { ExternalLink } from "lucide-react";

interface FormattedDescriptionProps {
  text: string;
  className?: string;
  isTruncatedPreview?: boolean;
}

/**
 * Parses Google Lighthouse markdown links like:
 * "Large network payloads cost users real money. [Learn how to reduce payload sizes](https://web.dev/total-byte-weight/)."
 * and renders them as clean, accessible, clickable external links.
 */
export const FormattedDescription: React.FC<FormattedDescriptionProps> = ({
  text,
  className = "text-xs text-text-secondary leading-relaxed",
  isTruncatedPreview = false,
}) => {
  if (!text) return null;

  // Regex pattern matching Markdown links: [Link text](https://url)
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;

  if (isTruncatedPreview) {
    // In one-line collapsed previews, strip the markdown syntax cleanly
    const cleanedText = text.replace(markdownLinkRegex, "$1");
    return <span className={className}>{cleanedText}</span>;
  }

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    // 1. Push plain text before the match
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    const linkText = match[1];
    const linkUrl = match[2];

    // 2. Push styled external link component
    elements.push(
      <a
        key={match.index}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-0.5 text-brand-500 hover:text-brand-600 font-semibold underline underline-offset-2 hover:opacity-90 transition-all mx-0.5"
      >
        <span>{linkText}</span>
        <ExternalLink className="h-3 w-3 inline shrink-0" />
      </a>
    );

    lastIndex = match.index + match[0].length;
  }

  // 3. Push remaining text after the last match
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return <p className={className}>{elements}</p>;
};
