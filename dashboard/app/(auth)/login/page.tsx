import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  const usersToken = cookies().get("auth-token")?.value;

  if (usersToken) {
    redirect("/dashboard");
  }
  return <LoginForm />;
};

export default LoginPage;
