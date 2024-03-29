"use client";

import React from "react";
import { Button } from "../ui/button";
import { deleteNotes } from "@/server/notes";

interface Props {
    docId: number;
}

const DeleteDocButton: React.FunctionComponent<Props> = ({ docId }) => {
    return <Button onClick={() => deleteNotes(docId)}>Delete</Button>;
};

export default DeleteDocButton;
