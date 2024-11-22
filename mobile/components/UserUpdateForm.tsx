import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormControl } from "./ui/form-control";
import { VStack } from "./ui/vstack";
import { Input, InputField } from "./ui/input";

import { updateUserSchema } from "@/utils/schema";
import { IUser, UpdateUserSchema } from "@/types/types";
import { Text } from "./ui/text";
import { useEffect } from "react";
import { UseMutationResult } from "@tanstack/react-query";

interface UserUpdateFormProps {
  currentInfo: IUser;
  onFormSubmit: (submit: () => void) => void;
  updateUserMutation: UseMutationResult<any, Error, UpdateUserSchema, unknown>;
}

const UserUpdateForm = ({
  currentInfo,
  onFormSubmit,
  updateUserMutation,
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
    updateUserMutation.mutate(data);
  };

  useEffect(() => {
    onFormSubmit(handleSubmit(onSubmit));
  }, [handleSubmit, onSubmit, onFormSubmit]);
  //   useEffect(() => {
  //     onFormSubmit(() => {
  //       if (formSubmitRef.current) {
  //         handleSubmit(onSubmit)();
  //       }
  //     });
  //   }, [handleSubmit, onSubmit, onFormSubmit]);

  return (
    <FormControl className="p-4 border rounded-lg border-outline-300 bg-white m-2 max-w-[400px] w-full mx-auto">
      <VStack space="xs">
        <Text className="text-typography-900">Name</Text>
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
        <Text className="text-typography-900">Email</Text>
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
        <Text className="text-typography-900">Phone</Text>
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
        <Text className="text-typography-900">Address</Text>
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
