import Image from "next/image";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { TinaMarkdownContent } from "tinacms/dist/rich-text";
import { DEEP, TEAL } from "@/theme";

const POST_COMPONENTS = {
  A: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      style={{
        color: DEEP,
      }}
      {...props}
    />
  ),
  Video: ({
    src,
    ...props
  }: {
    src: string;
    width?: number;
    height?: number;
  }) => {
    return (
      <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
        <video
          src={src}
          controls
          style={{
            maxWidth: "100%",
            border: `1px solid ${TEAL}`,
          }}
          {...props}
        />
      </div>
    );
  },
  CustomImage: ({
    src,
    caption,
    alt,
    width,
    height,
    ...props
  }: {
    src: string;
    width?: number;
    height?: number;
    alt?: string;
    caption?: string;
  }) => {
    return (
      <figure style={{ margin: "16px 0" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image
            src={src}
            alt={alt || ""}
            width={width || 512}
            height={height || 512}
            style={{
              maxWidth: "100%",
              height: "auto",
              border: `1px solid ${TEAL}`,
            }}
            {...props}
          />
        </div>
        {caption && (
          <figcaption
            style={{
              textAlign: "center",
              fontStyle: "italic",
              fontSize: "0.9em",
              color: TEAL,
              marginTop: "8px",
            }}
          >
            {caption}
          </figcaption>
        )}
      </figure>
    );
  },
  CodeBlock: ({
    children,
    language,
  }: {
    language?: string;
    children: TinaMarkdownContent;
  }) => {
    // @ts-ignore
    const strChildren = children.children[0].value as string;
    return (
      <div style={{ margin: "16px 0", border: `1px solid ${TEAL}` }}>
        <SyntaxHighlighter language={language}>{strChildren}</SyntaxHighlighter>
      </div>
    );
  },
};

export default POST_COMPONENTS;
