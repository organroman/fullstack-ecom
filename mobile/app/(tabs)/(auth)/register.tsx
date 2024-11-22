import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, Redirect } from "expo-router";

import { EyeIcon, EyeOffIcon } from "lucide-react-native";

import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { login, register as signUp } from "@/api/auth";
import { useAuth } from "@/store/authStore";
import { useForm } from "react-hook-form";
import { SignUpFormData } from "@/types/types";
import { signUpSchema } from "@/utils/schema";

import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);

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

  const registerMutation = useMutation({
    mutationFn: async ({ name, email, password }: SignUpFormData) => {
      const data = await signUp(name, email, password);
      return data;
    },
    onSuccess: async (data, variables) => {
      if (data) {
        const loginData = await login(variables.email, variables.password);
        if (loginData.user && loginData.token) {
          setUser(loginData.user);
          setToken(loginData.token);
        }
      }
    },
    onError: () => console.log("Error"),
  });

  const onSubmit = (formData: SignUpFormData) => {
    registerMutation.mutate(formData);
  };

  const handleShowPassword = () => {
    setShowPassword((showPassword) => {
      return !showPassword;
    });
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
        <VStack space="xs">
          <Text className="text-typography-500 leading-1">Password</Text>
          <Input className="text-center">
            <InputField
              value={watch("password")}
              onChangeText={(text) => setValue("password", text)}
              type={showPassword ? "text" : "password"}
            />
            <InputSlot className="pr-3" onPress={handleShowPassword}>
              <InputIcon
                as={showPassword ? EyeIcon : EyeOffIcon}
                className="text-darkBlue-500"
              />
            </InputSlot>
          </Input>
          {errors.password && (
            <Text className="text-red-600 text-xs">
              {errors.password.message}
            </Text>
          )}
        </VStack>
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
