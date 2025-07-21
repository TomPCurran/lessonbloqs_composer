"use client";

import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { createDocument } from "@/lib/actions/room.actions";
import { useFormStore } from "@/lib/stores/formStore";

const AddDocumentBtn = () => {
  const router = useRouter();
  const { user } = useUser();
  const { documentCreation, setDocumentCreating } = useFormStore();

  const addDocumentHandler = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    setDocumentCreating(true);

    try {
      const document = await createDocument({
        userId: user.id,
        email: user.emailAddresses[0].emailAddress,
      });

      if (document) {
        router.push(`/lessonplans/${document.id}`);
      } else {
        console.error("Failed to create document");
      }
    } catch (error) {
      console.error("Failed to create document:", error);
    } finally {
      setDocumentCreating(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={addDocumentHandler}
      disabled={documentCreation.isCreating || !user}
      size="default"
      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Image
        src="/assets/icons/add.svg"
        alt="Add document"
        width={20}
        height={20}
        className="h-5 w-5"
      />
      <span className="font-medium">
        {documentCreation.isCreating ? "Creating..." : "Start a blank document"}
      </span>
    </Button>
  );
};

export default AddDocumentBtn;
