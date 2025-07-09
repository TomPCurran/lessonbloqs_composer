"use client";

import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AddDocumentBtnProps } from "@/types";

const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
  const router = useRouter();

  const addDocumentHandler = async () => {
    try {
      const room = "1234";
      console.log("document created");
      if (room) {
        router.push(`/documents/${room.id}`);
      }
    } catch (error) {
      console.error("Failed to create document:", error);
    }
  };

  return (
    <Button
      type="button"
      onClick={addDocumentHandler}
      size="md"
      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-colors"
    >
      <Image
        src="/assets/icons/add.svg"
        alt="Add document"
        width={20}
        height={20}
        className="h-5 w-5"
      />
      <span className="font-medium">Start a blank document</span>
    </Button>
  );
};

export default AddDocumentBtn;
