import { useOthers } from "@liveblocks/react/suspense";
import Image from "next/image";

const ActiveCollaborators = () => {
  const others = useOthers();
  console.log(others);

  return (
    <ul className="flex justify-center items-center gap-2 mt-2">
      {others.map((other) => {
        const info = other.info;
        if (!info) return null;

        return (
          <li key={other.connectionId}>
            <Image
              src={info.avatar || "/default-avatar.png"}
              alt={info.name || "Unknown"}
              width={100}
              height={100}
              className="inline-block size-8 rounded-full ring-2 ring-dark-100"
              style={{ border: `3px solid ${info.color || "#6B4CE6"}` }}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default ActiveCollaborators;
