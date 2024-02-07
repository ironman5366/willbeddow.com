'use client'
import React from "react";
import {Table} from "@mantine/core";

export default function BlogTable() {
    return <Table c={"wine"}>
        <Table.Tr>
            <Table.Th>
                Title
            </Table.Th>
            <Table.Th>
                Date
            </Table.Th>
            <Table.Th>
                Tags
            </Table.Th>
        </Table.Tr>
        <Table.Tr>
            <Table.Td>
                A blog post
            </Table.Td>
            <Table.Td>
                2022-01-01
            </Table.Td>
            <Table.Td>
                #webdev #css
            </Table.Td>
        </Table.Tr>
    </Table>
}
