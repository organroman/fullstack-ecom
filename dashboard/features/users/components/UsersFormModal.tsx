"use client";
import { IUser, Roles, UserFormModalData } from "@/types/types";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutationResult } from "@tanstack/react-query";

import { Form } from "@/components/ui/form";
import UseFormInput from "@/components/form/UseFormInput";
import UseFormSelect from "@/components/form/UseFormSelect";
import Modal from "@/components/Modal";
import { SelectContent, SelectItem } from "@/components/ui/select";

import { USER_ROLES } from "@/lib/constants";
import { capitalizeFirstLetter, getUserSchema } from "@/lib/utils";

interface UserFormModalProps {
  userMutation: UseMutationResult<void, Error, UserFormModalData>;
  user?: IUser;
}

const UsersFormModal = ({ user, userMutation }: UserFormModalProps) => {
  const form = useForm<UserFormModalData>({
    resolver: zodResolver(getUserSchema(!!user)),
    defaultValues: {
      name: user ? user.name : "",
      role: user ? user.role : Roles.CUSTOMER,
      email: user ? user.email : "",
      phone: user ? user.phone : "",
      address: user ? user.address : "",
      password: "",
    },
  });

  const onSubmit = (formData: IUser) => {
    userMutation.mutate(
      { ...formData, id: String(user?.id) || "" },
      {
        onSuccess: () => form.control._reset(),
      }
    );
  };

  return (
    <Modal
      title={user ? "Edit user" : "Create user"}
      descriptionFirst={
        user
          ? "Update the fields and click 'Save'"
          : "Fill in the fields and click 'Save'"
      }
      buttonActionTitle="Save"
      buttonActionTitleContinuous="Saving"
      submit
      formId="userForm"
      isPending={userMutation.isPending}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
          id="userForm"
        >
          <UseFormSelect
            name="role"
            label="Role"
            control={form.control}
            selectContent={
              <SelectContent>
                {USER_ROLES.filter((role: string) => role !== "All").map(
                  (role: string) => (
                    <SelectItem key={role} value={role}>
                      {capitalizeFirstLetter(role)}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            }
          />
          <UseFormInput
            name="name"
            control={form.control}
            label="Name"
            placeholder="Enter user's name"
          />
          <UseFormInput
            name="email"
            control={form.control}
            label="Email"
            placeholder="Enter user's email"
          />
          {!user && (
            <UseFormInput
              name="password"
              control={form.control}
              label="Password"
              placeholder="Enter user's password"
            />
          )}
          <UseFormInput
            name="phone"
            control={form.control}
            label="Phone"
            placeholder="Enter user's phone"
          />
          <UseFormInput
            name="address"
            control={form.control}
            label="Address"
            placeholder="Enter user's address"
            fieldType="textarea"
            rows={2}
          />
        </form>
      </Form>
    </Modal>
  );
};

export default UsersFormModal;
