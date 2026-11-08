export function getDocumentPath(
  doc: { link?: string | null; _sys?: { filename?: string } } | null | undefined
) {
  return doc?.link || `/posts/${doc?._sys?.filename}`;
}
