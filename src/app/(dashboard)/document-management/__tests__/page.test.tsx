import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import DocumentManagementPage from "../page";

jest.mock("@/components/document-management/upload-document", () => {
  return function MockUploadDocument() {
    return <div data-testid="upload-document">Upload Document</div>;
  };
});

jest.mock("@/components/document-management/search-document", () => {
  return function MockSearchDocument() {
    return <div data-testid="search-document">Search Document</div>;
  };
});

describe("DocumentManagementPage", () => {
  it("renders the document management page correctly", () => {
    render(<DocumentManagementPage />);

    // Check if the title is rendered
    expect(screen.getByText("Document Management Page")).toBeInTheDocument();

    // Check if the UploadDocument is rendered
    expect(screen.getByTestId("upload-document")).toBeInTheDocument();

    // Check if the SearchDocument is rendered
    expect(screen.getByTestId("search-document")).toBeInTheDocument();
  });

  it("has the correct page structure", () => {
    const { container } = render(<DocumentManagementPage />);

    // Check if the main container has the correct classes
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass(
      "flex",
      "flex-col",
      "py-6",
      "mx-0",
      "sm:mx-4",
      "md:mx-8",
      "space-y-6"
    );

    // Check if the header has the correct classes
    const header = screen.getByText("Document Management Page").parentElement;
    expect(header).toHaveClass(
      "flex",
      "flex-col",
      "sm:flex-row",
      "justify-between",
      "items-center",
      "gap-2",
      "p-2",
      "md:p-0"
    );

    // Check if the search component container has the correct class
    const searchContainer = screen.getByTestId("search-document").parentElement;
    expect(searchContainer).toHaveClass("w-full");
  });
});