import { User } from "@/types/types";

import { useQueryClient } from "@tanstack/react-query";

import DropdownActionsMenu from "@/components/DropdownActionsMenu";
import { Dialog } from "@/components/ui/dialog";

import UsersFormModal from "./UsersFormModal";
import { useDialog } from "@/hooks/use-modal";
import { useEditUser } from "@/api/users/useEditUser";
import { useToken } from "@/components/providers/token-provider";
import ErrorPage from "@/app/error";

const UserActionsMenu = ({ user }: { user: User }) => {
  const { dialogOpen, setDialogOpen, closeDialog } = useDialog();
  const queryClient = useQueryClient();
  const token = useToken();

  if (!token) {
    return <ErrorPage error="Unauthorized" />;
  }

  const { editUserMutation } = useEditUser({ closeDialog, queryClient, token });

  return (
    <>
      <DropdownActionsMenu
        viewItemLink={`/dashboard/users/${user.id}`}
        viewItemTitle="View user"
        editItemDialogOpen={() => setDialogOpen(true)}
        editItemTitle="Edit user"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <UsersFormModal
          user={user}
          userMutation={editUserMutation}
        />
      </Dialog>
    </>
  );
};

export default UserActionsMenu;
