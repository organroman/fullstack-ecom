import { ChangePasswordSchema, User } from "@/types/types";

import { View } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import PasswordInput from "@/components/PasswordInput";

import { changePasswordSchema } from "@/utils/schema";
import { useAuth } from "@/store/authStore";
import { useChangePassword } from "@/api/users/useChangePassword";

type UpdatedUser = {
  user: User;
  token: string;
};

const ChangePasswordScreen = () => {
  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const setUser = useAuth((s) => s.setUser);
  const setToken = useAuth((s) => s.setToken);

  const handleSuccess = (data: UpdatedUser) => {
    if (data.user && data.token) {
      setUser(data.user);
      setToken(data.token);
    }
  };

  const { changePasswordMutation } = useChangePassword(handleSuccess);

  const onSubmit = (formData: ChangePasswordSchema) => {
    changePasswordMutation.mutate(formData);
  };
  return (
    <View className="h-full">
      <FormControl className="py-4 px-2 flex gap-4 border rounded-lg m-2 max-w-[400px] w-full mx-auto">
        <PasswordInput
          label="Old password"
          value={watch("oldPassword")}
          onChange={(text) => setValue("oldPassword", text)}
          placeholder="Enter your old password"
          error={errors.oldPassword && errors.oldPassword.message}
        />
        <PasswordInput
          label="Password"
          value={watch("password")}
          onChange={(text) => setValue("password", text)}
          placeholder="Enter your new password"
          error={errors.password && errors.password.message}
        />
        <PasswordInput
          label="Confirm password"
          value={watch("confirmPassword")}
          onChange={(text) => setValue("confirmPassword", text)}
          placeholder="Confirm your new password"
          error={errors.confirmPassword && errors.confirmPassword.message}
        />
        <Button
          isDisabled={changePasswordMutation.isPending}
          size="md"
          onPress={handleSubmit(onSubmit)}
          className="border"
        >
          {changePasswordMutation.isPending && <ButtonSpinner />}
          <ButtonText className="text-zinc-700 dark:text-zinc-300">
            {changePasswordMutation.isPending ? "Please wait..." : "Save"}
          </ButtonText>
        </Button>
      </FormControl>
    </View>
  );
};

export default ChangePasswordScreen;
