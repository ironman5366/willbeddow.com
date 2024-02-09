import React from "react";

interface Props {
  isoString: string | null | undefined;
}

export default function FormattedDate({ isoString }: Props) {
  if (isoString) {
    const date = new Date(isoString);
    return (
      <time dateTime={date.toISOString()}>{date.toLocaleDateString()}</time>
    );
  } else {
    return "Unknown";
  }
}
