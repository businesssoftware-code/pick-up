"use client";

import { RequireAuth } from "../context/AuthContext";


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}