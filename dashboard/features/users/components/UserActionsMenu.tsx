import DropdownActionsMenu from "@/components/DropdownActionsMenu";
import { Dialog } from "@/components/ui/dialog";
import { IUser } from "@/types/types";

import { useState } from "react";
import UsersFormModal from "./UsersFormModal";

const UserActionsMenu = ({ user }: { user: IUser }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  return (
    <>
      <DropdownActionsMenu
        viewItemLink={`/dashboard/users/${user.id}`}
        viewItemTitle="View user"
        editItemDialogOpen={() => setIsEditDialogOpen(true)}
        editItemTitle="Edit user"
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <UsersFormModal user={user} />
      </Dialog>
    </>
  );
};

export default UserActionsMenu;
