import { AuthGuard } from "@/components/auth/AuthGuard";
import { Navbar } from "@/components/common/navbar";

export default function DocumentManagementLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-linear-to-br from-cyan-100 via-blue-100 to-indigo-300">
        <Navbar />
        {children}
      </main>
    </AuthGuard>)
}