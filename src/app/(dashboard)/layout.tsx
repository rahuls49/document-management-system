import { Navbar } from "@/components/common/navbar";

export default function DocumentManagementLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
    <main className="h-screen">
      <Navbar />
      {children}
    </main>
  </>;
}