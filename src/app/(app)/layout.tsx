import { Layout } from "@/components/layout/Layout";
import { requireUser } from "@/server/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return <Layout>{children}</Layout>;
}
