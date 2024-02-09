export function getDocumentPath(
  doc: { _sys?: { filename?: string } } | null | undefined
) {
  return `/posts/${doc?._sys?.filename}`;
}
