import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { capitalizeFirstLetter } from "@/lib/utils";
import { USER_ROLES } from "@/lib/constants";

interface UserRolesSelectorProps {
  role: string;
  onChange?: (role: string) => void;
  isDisplaySelectItemAll?: boolean;
  isDisabled?: boolean;
}

const UserRolesSelector = ({
  role,
  onChange,
  isDisplaySelectItemAll,
  isDisabled,
}: UserRolesSelectorProps) => {
  const [selectedRole, setSelectedRole] = useState<string>(role || "All");

  const roles = isDisplaySelectItemAll
    ? USER_ROLES
    : USER_ROLES.filter((item) => item !== "All");

  const handleChange = (newRole: string) => {
    setSelectedRole(newRole);
    onChange && onChange(newRole);
  };

  return (
    <Select
      value={selectedRole}
      onValueChange={handleChange}
      disabled={isDisabled}
    
    >
      <SelectTrigger className="w-[180px]">
        {selectedRole === "All"
          ? "Select a role"
          : capitalizeFirstLetter(selectedRole)}
      </SelectTrigger>

      <SelectContent>
        {roles.map((role) => (
          <SelectItem value={role} key={role}>
            {capitalizeFirstLetter(role)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default UserRolesSelector;
