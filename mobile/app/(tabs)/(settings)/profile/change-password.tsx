import { SafeAreaView, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { HStack } from "@/components/ui/hstack";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

import { FormControl } from "@/components/ui/form-control";
import { ChangePasswordSchema } from "@/types/types";
import { changePasswordSchema } from "@/utils/schema";
import { changePassword } from "@/api/users";
import { useAuth } from "@/store/authStore";
import PasswordInput from "@/components/PasswordInput";

const ChangePasswordScreen = () => {
  const router = useRouter();

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

  const changePasswordMutation = useMutation({
    mutationFn: async ({ oldPassword, password }: ChangePasswordSchema) => {
      const data = await changePassword(oldPassword, password);
      return data;
    },
    onSuccess: (data) => {
      if (data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
      }
      reset();
    },
    onError: (error) => console.log(error.message),
  });

  const onSubmit = (formData: ChangePasswordSchema) => {
    changePasswordMutation.mutate(formData);
  };
  return (
    <SafeAreaView className="bg-zinc-100 dark:bg-zinc-900 flex-1">
      <View className="h-full bg-white dark:bg-black">
        <HStack className="p-4 border-b-[0.5px] border-blue-500 w-full items-center">
          <Button onPress={() => router.back()} variant="link">
            <ButtonIcon as={ChevronLeft} size="lg" className="w-6 h-6" />
          </Button>
          <Heading className="mx-auto">Change password</Heading>
        </HStack>
        <FormControl className="p-4 flex gap-4 border rounded-lg m-2 max-w-[400px] w-full mx-auto">
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
            className="dark:bg-zinc-900 dark:border-slate-600 dark:shadow-sm"
          >
            {changePasswordMutation.isPending && <ButtonSpinner />}
            <ButtonText className="dark:text-slate-100">
              {changePasswordMutation.isPending ? "Please wait..." : "Save"}
            </ButtonText>
          </Button>
        </FormControl>
      </View>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
