import React from "react";

interface Props {
    isoString: string
}


export default function FormattedDate({ isoString }: Props ) {
    const date = new Date(isoString);
    return <time dateTime={date.toISOString()}>{date.toLocaleDateString()}</time>
}
