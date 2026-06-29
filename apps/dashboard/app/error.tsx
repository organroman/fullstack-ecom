"use client";
import { AlertCircleIcon } from "lucide-react";

const ErrorPage = ({ error }: { error: Error | string }) => {
  const message = typeof error === "string" ? error : error.message;

  return (
    <div className="h-screen flex flex-col  items-center justify-center">
      <AlertCircleIcon className="size-6" />
      <p className="font-bold text-lg text-zinc-700 dark:text-zinc-300">
        {message}
      </p>
    </div>
  );
};

export default ErrorPage;
