import { Anchor, AnchorProps, Center, Stack } from "@mantine/core";
import Image from "next/image";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text";

const POST_COMPONENTS = {
  A: (props: Partial<AnchorProps>) => <Anchor {...props} />,
  Video: ({
    src,
    ...props
  }: {
    src: string;
    width?: number;
    height?: number;
  }) => {
    return (
      <Center>
        <video
          src={src}
          controls
          style={{
            maxWidth: "calc(100vw - 75px)",
          }}
          {...props}
        />
      </Center>
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
    // Show captions in italics beneath the image
    return (
      <Stack>
        <Center
          style={{
            maxWidth: "calc(100vw - 75px)",
          }}
        >
          <Image
            src={src}
            alt={alt || ""}
            width={width || 512}
            height={height || 512}
            style={{
              maxWidth: "calc(100vw - 75px)",
            }}
            {...props}
          />
        </Center>
        {caption && (
          <Center
            style={{
              textAlign: "center",
            }}
          >
            <i>{caption}</i>
          </Center>
        )}
      </Stack>
    );
  },
  CodeBlock: ({
    children,
    language,
  }: {
    language?: string;
    children: TinaMarkdownContent;
  }) => {
    // This is a total hack but tina only supports rich text children and we know this should just be a code block
    // @ts-ignore
    const strChildren = children.children[0].value as string;
    return (
      <SyntaxHighlighter language={language}>{strChildren}</SyntaxHighlighter>
    );
  },
};

export default POST_COMPONENTS;
