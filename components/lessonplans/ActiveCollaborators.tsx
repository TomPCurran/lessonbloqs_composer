import { useOthers } from "@liveblocks/react/suspense";
import Image from "next/image";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

const ActiveCollaborators = () => {
  const others = useOthers();

  return (
    <div className="flex items-center gap-grid-2">
      {/* Collaborators label */}
      <div className="flex items-center gap-grid-1 text-body-small text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>Active:</span>
      </div>

      {/* Collaborators list */}
      <ul className="flex items-center gap-grid-1">
        {others.map((other, index) => {
          const info = other.info;
          if (!info) return null;

          return (
            <li
              key={other.connectionId}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <Image
                  src={info.avatar || "/default-avatar.png"}
                  alt={info.name || "Unknown"}
                  width={32}
                  height={32}
                  className={cn(
                    "w-8 h-8 rounded-full ring-2 ring-background",
                    "elevation-1 hover:elevation-2 transition-all duration-200",
                    "hover:scale-110"
                  )}
                  style={{
                    border: `2px solid ${info.color || "#6B4CE6"}`,
                    backgroundColor: info.color || "#6B4CE6",
                  }}
                />

                {/* Active indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full ring-2 ring-background animate-pulse" />
              </div>
            </li>
          );
        })}

        {/* Show message when no other collaborators */}
        {others.length === 0 && (
          <li className="text-body-small text-muted-foreground">
            No other users online
          </li>
        )}
      </ul>
    </div>
  );
};

export default ActiveCollaborators;
