import Navbar from "@/components/common/navbar";

export default function DocumentManagementLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
    <main>
      <Navbar />
      {children}
    </main>
  </>;
}