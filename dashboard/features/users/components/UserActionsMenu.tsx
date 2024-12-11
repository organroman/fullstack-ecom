import { IUser } from "@/types/types";

import { useQueryClient } from "@tanstack/react-query";

import DropdownActionsMenu from "@/components/DropdownActionsMenu";
import { Dialog } from "@/components/ui/dialog";

import UsersFormModal from "./UsersFormModal";
import { useDialog } from "@/hooks/use-modal";
import { useEditUser } from "@/api/users/queries/useEditUser";

const UserActionsMenu = ({ user }: { user: IUser }) => {

  const { dialogOpen, setDialogOpen, closeDialog } = useDialog();
  const queryClient = useQueryClient();
  const { editUserMutation } = useEditUser({ closeDialog, queryClient });

  return (
    <>
      <DropdownActionsMenu
        viewItemLink={`/dashboard/users/${user.id}`}
        viewItemTitle="View user"
        editItemDialogOpen={() => setDialogOpen(true)}
        editItemTitle="Edit user"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <UsersFormModal user={user} userMutation={editUserMutation} />
      </Dialog>
    </>
  );
};

export default UserActionsMenu;
