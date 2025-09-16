import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormControl } from "./ui/form-control";
import { VStack } from "./ui/vstack";
import { Input, InputField } from "./ui/input";

import { updateUserSchema } from "@/utils/schema";
import { User, UpdateUserSchema } from "@/types/types";
import { Text } from "./ui/text";
import { useEffect } from "react";
import { UseMutationResult } from "@tanstack/react-query";

interface UserUpdateFormProps {
  currentInfo: User;
  onFormSubmit: (submit: () => void) => void;
  updateUserMutation: UseMutationResult<any, Error, UpdateUserSchema, unknown>;
  handleOnSuccess: (data: User) => void;
}

const UserUpdateForm = ({
  currentInfo,
  onFormSubmit,
  updateUserMutation,
  handleOnSuccess,
}: UserUpdateFormProps) => {
  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: currentInfo?.name || "",
      email: currentInfo?.email || "",
      phone: currentInfo?.phone || "",
      address: currentInfo?.address || "",
    },
  });

  const onSubmit = (data: UpdateUserSchema) => {
    updateUserMutation.mutate(data, {
      onSuccess: (data) => handleOnSuccess(data),
    });
  };

  useEffect(() => {
    onFormSubmit(handleSubmit(onSubmit));
  }, [handleSubmit, onSubmit, onFormSubmit]);

  return (
    <FormControl className="py-4 max-w-[400px] w-full mx-auto flex flex-col gap-2">
      <VStack space="xs">
        <Text className="text-zinc-700 dark:text-zinc-300 text-xs">Name</Text>
        <Input>
          <InputField
            value={watch("name")}
            onChangeText={(text) => setValue("name", text)}
            defaultValue={currentInfo?.name}
          />
        </Input>
        {errors.name && (
          <Text className="text-red-600 text-xs">{errors.name.message}</Text>
        )}
      </VStack>
      <VStack space="xs">
        <Text className="text-zinc-700 dark:text-zinc-300 text-xs">Email</Text>
        <Input>
          <InputField
            value={watch("email")}
            onChangeText={(text) => setValue("email", text)}
            defaultValue={currentInfo.email}
          />
        </Input>
        {errors.email && (
          <Text className="text-red-600 text-xs">{errors.email.message}</Text>
        )}
      </VStack>
      <VStack space="xs">
        <Text className="text-zinc-700 dark:text-zinc-300 text-xs">Phone</Text>
        <Input>
          <InputField
            value={watch("phone")}
            onChangeText={(text) => setValue("phone", text)}
            defaultValue={currentInfo.phone || "-"}
          />
        </Input>
        {errors.phone && (
          <Text className="text-red-600 text-xs">{errors.phone.message}</Text>
        )}
      </VStack>
      <VStack space="xs">
        <Text className="text-zinc-700 dark:text-zinc-300 text-xs">Address</Text>
        <Input>
          <InputField
            value={watch("address")}
            onChangeText={(text) => setValue("address", text)}
            defaultValue={currentInfo.address || "-"}
          />
        </Input>
        {errors.address && (
          <Text className="text-red-600 text-xs">{errors.address.message}</Text>
        )}
      </VStack>
    </FormControl>
  );
};

export default UserUpdateForm;
