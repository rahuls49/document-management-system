import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import UsersPage from "../page";

jest.mock("@/components/users/user-creation-form", () => {
  return function MockUserCreationForm() {
    return <div data-testid="user-creation-form">User Creation Form</div>;
  };
});

describe("UsersPage", () => {
  it("renders the user management page correctly", () => {
    render(<UsersPage />);

    // Check if the title is rendered
    expect(screen.getByText("User Management")).toBeInTheDocument();

    // Check if the description is rendered
    expect(
      screen.getByText("Manage users and their permissions efficiently.")
    ).toBeInTheDocument();

    // Check if the UserCreationForm is rendered
    expect(screen.getByTestId("user-creation-form")).toBeInTheDocument();
  });

  it("has the correct page structure", () => {
    const { container } = render(<UsersPage />);

    // Check if the main container has the correct classes
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass(
      "flex",
      "flex-col",
      "my-4",
      "mx-0",
      "sm:mx-4",
      "md:mx-8",
      "space-y-8",
      "p-4",
      "md:p-0"
    );

    // Check if the header section exists
    const headerDiv = screen.getByText("User Management").parentElement?.parentElement;
    expect(headerDiv).toHaveClass("space-y-8");

    // Check if the form is centered
    const formContainer = screen.getByTestId("user-creation-form").parentElement;
    expect(formContainer).toHaveClass("flex", "justify-center");
  });
});