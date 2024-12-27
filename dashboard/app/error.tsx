"use client";
import { AlertCircleIcon } from "lucide-react";

const ErrorPage = ({ error }: { error: string }) => {
  return (
    <div className="h-screen flex flex-col  items-center justify-center">
      <AlertCircleIcon className="size-6" />
      <p className="font-bold text-lg text-zinc-700 dark:text-zinc-300">
        {error}
      </p>
    </div>
  );
};

export default ErrorPage;
