"use client";
import React, { createContext, useContext } from "react";

const TokenContext = createContext<string | null>(null);

export const TokenProvider = ({
  token,
  children,
}: {
  token: string | null;
  children: React.ReactNode;
}) => {
  return (
    <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
  );
};

export const useToken = () => {
  return useContext(TokenContext);
};
