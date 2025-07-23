import React from "react";
import { Card } from "@/components/ui/card";
import { GraduationCap, Users, Archive } from "lucide-react";
import ClassroomCard from "./classroomCard";

interface Classroom {
  id: string;
  school_id: string;
  name: string;
  ay_start: number;
  ay_end: number;
  subject: string;
  level: string | null;
  is_active: boolean;
  created_by: string;
  google_classroom_sync: boolean;
  coteachers: string[];
  section: string | null;
  source: string | null;
  external_id: string | null;
}

interface ClassroomListProps {
  classrooms: Classroom[];
}

const ClassroomList = ({ classrooms = [] }: ClassroomListProps) => {
  const activeClassrooms = React.useMemo(
    () => classrooms.filter((c) => c.is_active),
    [classrooms]
  );

  const archivedClassrooms = React.useMemo(
    () => classrooms.filter((c) => !c.is_active),
    [classrooms]
  );

  if (classrooms.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-primary-purple/10 rounded-full">
              <GraduationCap className="h-6 w-6 text-primary-purple" />
            </div>
            <h3 className="text-lg font-medium text-primary-black">
              No Classes Found
            </h3>
            <p className="text-primary-grey-300">
              Create a new class or connect your Google Classroom account to
              import classes.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {activeClassrooms.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-purple" />
            <h2 className="text-xl font-semibold text-primary-black">
              Active Classes ({activeClassrooms.length})
            </h2>
          </div>
          <div className="grid gap-4">
            {activeClassrooms.map((classroom) => (
              <div
                key={classroom.id || classroom.external_id}
                className="w-full"
              >
                <ClassroomCard classroom={classroom} />
              </div>
            ))}
          </div>
        </section>
      )}

      {archivedClassrooms.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-primary-grey-300" />
            <h2 className="text-xl font-semibold text-primary-grey-300">
              Archived Classes ({archivedClassrooms.length})
            </h2>
          </div>
          <div className="grid gap-4">
            {archivedClassrooms.map((classroom) => (
              <div key={classroom.id} className="w-full">
                <ClassroomCard classroom={classroom} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default React.memo(ClassroomList);
