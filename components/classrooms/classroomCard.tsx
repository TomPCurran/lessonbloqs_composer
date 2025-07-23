import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, ExternalLink, Clock } from "lucide-react";

interface GradeCategory {
  id: string;
  name: string;
  weight: number;
  defaultGradeDenominator: number;
}

interface Classroom {
  id: string;
  name: string;
  section: string;
  room: string;
  descriptionHeading?: string;
  courseState: "ACTIVE" | "ARCHIVED";
  creationTime: string;
  alternateLink: string;
  teacherFolder: {
    alternateLink: string;
  };
  gradebookSettings?: {
    gradeCategories?: GradeCategory[];
  };
}

interface ClassroomCardProps {
  classroom: Classroom;
}

const ClassroomCard = ({ classroom }: ClassroomCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="p-6 hover:border-primary-purple/30 transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary-purple/10 to-primary-blue/10 rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary-purple" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-black">
                {classroom.name}
              </h3>
              <p className="text-sm text-primary-grey-300">
                Section {classroom.section} • Room {classroom.room}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-primary-grey-300">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Created {formatDate(classroom.creationTime)}</span>
            </div>
            <Badge
              variant={
                classroom.courseState === "ACTIVE" ? "default" : "secondary"
              }
              className={
                classroom.courseState === "ACTIVE"
                  ? "bg-primary-success/10 text-primary-success hover:bg-primary-success/20"
                  : "bg-primary-grey-100 text-primary-grey-300"
              }
            >
              {classroom.courseState}
            </Badge>
          </div>

          {classroom.descriptionHeading && (
            <p className="text-sm text-primary-grey-300">
              {classroom.descriptionHeading}
            </p>
          )}

          <div className="flex flex-wrap gap-4">
            {classroom.gradebookSettings?.gradeCategories && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-primary-black">
                  Grade Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {classroom.gradebookSettings.gradeCategories.map(
                    (category) => (
                      <Badge
                        key={category.id}
                        variant="outline"
                        className="bg-primary-purple/5 border-primary-purple/20 text-primary-purple"
                      >
                        {category.name} ({(category.weight / 10000).toFixed(1)}
                        %)
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-purple hover:bg-primary-purple/10"
            onClick={() => window.open(classroom.alternateLink, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Classroom
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-purple hover:bg-primary-purple/10"
            onClick={() =>
              window.open(classroom.teacherFolder.alternateLink, "_blank")
            }
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Drive Folder
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ClassroomCard;
