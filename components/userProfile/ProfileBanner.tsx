import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { School, Mail, MapPin, Edit, GraduationCap } from "lucide-react";
import { UserProps } from "@/store/api/types/userTypes";

const ProfileBanner = ({ userProps }: { userProps: UserProps }) => {
  return (
    <Card className="bg-gradient-to-r from-primary-purple/5 to-primary-blue/5 border-primary-grey-200">
      <div className="flex justify-between items-start p-6">
        <div className="flex gap-6">
          <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
            <AvatarImage />
            <AvatarFallback className="text-2xl bg-gradient-to-r from-primary-purple to-primary-blue text-white">
              {userProps.currentUser?.first_name}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-semibold text-primary-black">{`${userProps.currentUser?.first_name} ${userProps.currentUser?.last_name}`}</h1>
            </div>
            <div className="flex gap-6 text-primary-grey-300">
              <div className="flex items-center gap-2 hover:text-primary-purple text-primary-black transition-colors">
                <div className="p-1.5 bg-white  rounded-md shadow-sm">
                  <School className="h-4 w-4" />
                </div>
                {userProps.currentUser?.schools[0].name}
              </div>
              <div className="flex items-center gap-2 hover:text-primary-purple transition-colors text-primary-black">
                <div className="p-1.5 bg-white rounded-md shadow-sm">
                  <Mail className="h-4 w-4" />
                </div>
                {userProps.currentUser?.email}
              </div>
            </div>
          </div>
        </div>

        {/* <Button
          variant="outline"
          size="sm"
          className="gap-2 border-primary-grey-200 hover:border-primary-purple/30 hover:bg-gradient-to-r hover:from-primary-purple/5 hover:to-primary-blue/5"
        >
          <Edit className="h-4 w-4 text-primary-purple" />
          Edit Profile
        </Button> */}
      </div>
    </Card>
  );
};

export default ProfileBanner;
