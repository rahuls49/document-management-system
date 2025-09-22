import UploadDocument from "@/components/document-management/upload-document";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Document Management",
  description: "Manage and organize your documents efficiently.",
};

export default function DocumentManagementPage() {
  return (
    <div className="flex flex-col my-4 mx-0 sm:mx-4 md:mx-8">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-2 p-2 md:p-0">
        <h1 className="font-medium">Document Managemnt Page</h1>
        <UploadDocument />
      </header>
    </div>
  );
}