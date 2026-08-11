import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LoginForm from "@/features/auth/LoginForm";
import { getRoleAndUserFromToken } from "@/lib/utils";

const LoginPage = () => {
  const usersToken = cookies().get("auth-token")?.value;

  let userData;

  try {
    if (usersToken) {
      userData = getRoleAndUserFromToken(usersToken);
    }
  } catch {
    userData = null;
  }

  if (userData) {
    redirect("/dashboard");
  }
  return <LoginForm />;
};

export default LoginPage;
