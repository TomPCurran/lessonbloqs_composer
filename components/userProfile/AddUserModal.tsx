import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, UserCircle } from "lucide-react";

const AddUserModal = ({ teamId, teamName }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className="border-primary-grey-200 hover:border-primary-purple/30 hover:bg-gradient-to-r hover:from-primary-purple/5 hover:to-primary-blue/5"
      >
        <Plus className="h-4 w-4 mr-2 text-primary-purple" />
        Add User
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[625px] p-0 overflow-hidden">
      <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-primary-purple/10 to-primary-blue/10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-primary-purple to-primary-blue rounded-lg">
            <UserCircle className="h-5 w-5 text-white" />
          </div>
          <DialogTitle className="text-2xl font-semibold text-primary-black">
            Add User to {teamName}
          </DialogTitle>
        </div>
      </DialogHeader>

      <div className="p-6 space-y-6">
        <Input
          placeholder="Search by name or email"
          className="bg-white border-primary-grey-200 hover:border-primary-purple/30 focus:border-primary-purple focus:ring-primary-purple/20"
        />
        <Select>
          <SelectTrigger className="w-full bg-white border-primary-grey-200 hover:border-primary-purple/30 focus:border-primary-purple focus:ring-primary-purple/20">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-6 bg-gradient-to-r from-primary-purple/10 to-primary-blue/10 border-t border-primary-grey-200">
        <Button className="w-full bg-primary-purple hover:bg-primary-purple/90 transition-colors">
          Add User
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default AddUserModal;
