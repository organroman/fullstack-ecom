// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
export const dynamic = "force-static";

import LoginForm from "@/features/auth/LoginForm";

const LoginPage = () => {
  // const usersToken = cookies().get("auth-token")?.value;

  // if (usersToken) {
  //   redirect("/dashboard");
  // }
  return <LoginForm />;
};

export default LoginPage;
