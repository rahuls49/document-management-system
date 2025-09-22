import UserCreationForm from "@/components/users/user-creation-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage users and their permissions efficiently.",
};

export default function UsersPage() {
  return (
    <div className="flex flex-col my-4 mx-0 sm:mx-4 md:mx-8 space-y-8 p-4 md:p-0">
      {/* Header */}
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-xl font-bold">User Management</h1>
          <p className="text-sm text-muted-foreground">Manage users and their permissions efficiently.</p>
        </div>
        <div className="flex justify-center">
          <UserCreationForm />
        </div>
      </div>
    </div>
  );
}