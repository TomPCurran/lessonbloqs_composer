import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useYjs } from "@/lib/providers/yjsProvider";
import { useLiveblocksConfig } from "@/lib/hooks/useLiveblocksConfig";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import {
  YjsThreadStore,
  DefaultThreadStoreAuth,
} from "@blocknote/core/comments";

interface EditorProps {
  bloqId: string;
  userName: string;
  userColor: string;
  initialContent?: string;
}

interface BlockNoteUser {
  id: string;
  username: string;
  avatarUrl: string;
}

// The type returned by your resolveUsers hook
interface RawUser {
  id: string;
  name: string;
  avatarUrl: string;
}

export function Editor({
  bloqId,
  userName,
  userColor,
  initialContent,
}: EditorProps) {
  const { doc, provider } = useYjs();
  const { resolveUsers } = useLiveblocksConfig();
  const { user, isLoaded } = useUser();

  const threadStore = React.useMemo(() => {
    if (!user || !doc) return undefined;

    return new YjsThreadStore(
      user.id,
      doc.getMap("threads"),
      new DefaultThreadStoreAuth(user.id, "editor")
    );
  }, [user, doc]);

  const editor = useCreateBlockNote({
    collaboration: provider
      ? {
          provider,
          fragment: doc.getXmlFragment(`blocknote-${bloqId}`),
          user: {
            name: userName,
            color: userColor,
          },
        }
      : undefined,
    initialContent:
      !provider && initialContent ? JSON.parse(initialContent) : undefined,
    resolveUsers: async (userIds: string[]): Promise<BlockNoteUser[]> => {
      const users: RawUser[] = await resolveUsers(userIds);
      return users.map((u) => ({
        id: u.id,
        username: u.name,
        avatarUrl: u.avatarUrl,
      }));
    },
    comments: threadStore
      ? {
          threadStore,
        }
      : undefined,
  });

  if (!isLoaded || !user || !threadStore || !editor) {
    return <div>Loading Editor...</div>;
  }

  return (
    <div className="w-full h-full">
      {/* Your custom toolbar is rendered here */}
      <EditorToolbar editor={editor} />
      <BlockNoteView
        editor={editor}
        className="editor w-full h-full"
        formattingToolbar={false}
        // The sideMenu is now disabled to allow your custom toolbar to handle comments
        sideMenu={false}
        slashMenu={false}
        filePanel={false}
        theme="dark"
        data-theming-css
      />
    </div>
  );
}
