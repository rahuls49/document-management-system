import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage users and their permissions efficiently.",
};

export default function UsersPage() {
  return (
    <div className="min-h-screen flex flex-col">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        <p className="text-lg text-muted-foreground">Manage users and their permissions efficiently.</p>
    </div>
  );
}