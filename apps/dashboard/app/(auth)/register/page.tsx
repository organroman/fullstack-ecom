// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
export const dynamic = "force-static";

import RegisterForm from "@/features/auth/RegisterForm";

const RegisterPage = () => {
  // const usersToken = cookies().get("auth-token")?.value;

  // if (usersToken) {
  //   redirect("/dashboard");
  // }

  return <RegisterForm />;
};

export default RegisterPage;
