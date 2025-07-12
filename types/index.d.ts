/* eslint-disable no-unused-vars */
import type { LsonObject } from "@liveblocks/client";

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type AccessType = ["room:write"] | ["room:read", "room:presence:write"];

declare type RoomAccesses = Record<string, AccessType>;

declare type UserType = "creator" | "editor" | "viewer";

declare type RoomMetadata = {
  creatorId: string;
  email: string;
  title: string;
};

declare type CreateDocumentParams = {
  userId: string;
  email: string;
};

declare type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  userType?: UserType;
};

declare type ShareDocumentParams = {
  roomId: string;
  email: string;
  userType: UserType;
  updatedBy: User;
};

declare type UserTypeSelectorParams = {
  userType: string;
  setUserType: React.Dispatch<React.SetStateAction<UserType>>;
  onClickHandler?: (value: string) => void;
  disabled?: boolean;
};

declare type SelectedUser = {
  user: User;
  permission: UserType;
};

declare type UserSearchResult = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
};

declare type ShareDocumentDialogProps = {
  roomId: string;
  collaborators: User[];
  creatorId: string;
  currentUserType: UserType;
};

declare type HeaderProps = {
  children: React.ReactNode;
  className?: string;
};

declare type CollaboratorProps = {
  roomId: string;
  email: string;
  creatorId: string;
  collaborator: User;
  user: User;
};

declare type CollaborativeRoomProps = {
  roomId: string;
  roomMetadata: RoomMetadata;
  users: User[];
  currentUserType: UserType;
};

declare type AddDocumentBtnProps = {
  userId: string;
  email: string;
};

declare type DeleteModalProps = { roomId: string };

declare type ThreadWrapperProps = { thread: ThreadData<BaseMetadata> };

export interface Bloq extends LsonObject {
  id: string;
  title: string;
  type: string;
  createdAt: number;
  updatedAt: number;
  order: number;
  content: string;
}

export interface BloqType {
  title: string;
  key: string;
}

export interface BloqProps {
  id: string;
  title: string;
  onUpdate: (updates: { title?: string }) => void;
  onRemove: () => void;
}

interface LessonPlan {
  id: string;
  title: string;
  updatedAt: string;
}

type DocumentData = {
  type?: string;
  id: string;
  tenantId?: string;
  lastConnectionAt?: string;
  createdAt?: string;
  metadata: {
    email: string;
    title: string;
    creatorId: string;
  };
  defaultAccesses?: string[];
  groupsAccesses?: Record<string, never>;
  usersAccesses: Record<string, string[]>;
};

type UserData = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  email: string;
};

type RoomProps = {
  documentId: string;
  initialDocument?: DocumentData;
  collaborators?: User[];
  documentMetadata?: DocumentData["metadata"];
  currentUserType?: UserType;
  user: UserData;
  error?: string | null;
};
