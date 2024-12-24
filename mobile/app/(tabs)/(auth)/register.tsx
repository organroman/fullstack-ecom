import { Link, Redirect } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useAuth } from "@/store/authStore";
import { SignUpFormData, UpdatedUser } from "@/types/types";
import { signUpSchema } from "@/utils/schema";

import PasswordInput from "@/components/PasswordInput";
import { useRegister } from "@/api/auth/useRegister";
import { useLogin } from "@/api/auth/useLogin";

export default function RegisterScreen() {
  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const setUser = useAuth((s) => s.setUser);
  const setToken = useAuth((s) => s.setToken);

  const isLoggedIn = useAuth((s) => !!s.token);

  const onRegisterSuccess = async (
    registerData: UpdatedUser,
    variables: SignUpFormData
  ) => {
    if (registerData) {
      loginMutation.mutate({
        email: variables.email,
        password: variables.password,
      });
    }
  };

  const onLoginSuccess = (loginData: UpdatedUser) => {
    if (loginData) {
      setUser(loginData.user);
      setToken(loginData.token);
    }
  };

  const { registerMutation } = useRegister(onRegisterSuccess);
  const { loginMutation } = useLogin(onLoginSuccess);

  const onSubmit = (formData: SignUpFormData) => {
    registerMutation.mutate(formData);
  };

  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <FormControl className="p-4 border rounded-lg border-outline-300 bg-white m-2 max-w-[400px] w-full mx-auto">
      <VStack space="sm">
        <Heading className="text-typography-900 leading-3 py-3">
          Register
        </Heading>
        <VStack space="xs">
          <Text className="text-typography-500 leading-1">Name</Text>
          <Input>
            <InputField
              value={watch("name")}
              onChangeText={(text) => setValue("name", text)}
              type="text"
            />
          </Input>
          {errors.name && (
            <Text className="text-red-600 text-xs">{errors.name.message}</Text>
          )}
        </VStack>
        <VStack space="xs">
          <Text className="text-typography-500 leading-1">Email</Text>
          <Input>
            <InputField
              value={watch("email")}
              onChangeText={(text) => setValue("email", text)}
              type="text"
            />
          </Input>
          {errors.email && (
            <Text className="text-red-600 text-xs">{errors.email.message}</Text>
          )}
        </VStack>
        <PasswordInput
          label="Password"
          value={watch("password")}
          onChange={(text) => setValue("password", text)}
          error={errors.password && errors.password.message}
        />
        <VStack space="md" className="pb-3 pt-6">
          <Button
            isDisabled={registerMutation.isPending}
            size="md"
            onPress={handleSubmit(onSubmit)}
          >
            {registerMutation.isPending && <ButtonSpinner />}
            <ButtonText>
              {registerMutation.isPending ? "Please wait" : "Register"}
            </ButtonText>
          </Button>
          <Text className="text-sm text-gray-600">
            Alredy have an account?{" "}
            <Link href="/login" className="text-blue-600 font-bold">
              Sign in
            </Link>
          </Text>
        </VStack>
      </VStack>
    </FormControl>
  );
}
