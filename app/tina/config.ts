import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "blurb",
            label: "Blurb",
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
            templates: [
              {
                name: "CodeBlock",
                label: "Code",
                fields: [
                  {
                    type: "rich-text",
                    name: "children",
                    parser: { type: "markdown", skipEscaping: "all" },
                  },
                  {
                    type: "string",
                    name: "language",
                    label: "Language",
                  },
                ],
              },
              {
                name: "A",
                label: "Link",
                fields: [
                  {
                    type: "string",
                    name: "href",
                    label: "href",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "target",
                    label: "target",
                  },
                ],
              },
              {
                name: "Video",
                label: "Video",
                fields: [
                  {
                    type: "string",
                    name: "src",
                    label: "URL Source",
                  },
                  {
                    type: "number",
                    name: "width",
                    label: "Width",
                  },
                  {
                    type: "number",
                    name: "height",
                    label: "Height",
                  },
                ],
              },
              {
                name: "CustomImage",
                label: "Image (Custom)",
                fields: [
                  {
                    type: "string",
                    name: "src",
                    label: "URL Source",
                    required: true,
                  },
                  {
                    type: "number",
                    name: "width",
                    label: "Width",
                  },
                  {
                    type: "number",
                    name: "height",
                    label: "Height",
                  },
                  {
                    type: "string",
                    name: "alt",
                    label: "Alt Text",
                  },
                  {
                    type: "string",
                    name: "caption",
                    label: "Caption",
                  },
                ],
              },
            ],
          },
          {
            type: "datetime",
            name: "created_at",
            label: "Created At",
          },
          {
            type: "datetime",
            name: "updated_at",
            label: "Last Updated At",
          },
        ],
        ui: {
          router: ({ document }) => `/posts/${document?._sys?.filename}`,
        },
      },
    ],
  },
});
