import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage = () => {
  const usersToken = cookies().get("auth-token")?.value;

  if (usersToken) {
    redirect("/dashboard");
  }

  return <RegisterForm />;
};

export default RegisterPage;
