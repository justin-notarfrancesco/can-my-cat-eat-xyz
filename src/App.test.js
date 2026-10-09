import { render, screen } from "@testing-library/react";
import App from "./App";

test("shows the legal links and cookie banner", () => {
  render(<App />);
  expect(screen.getByText("terms")).toBeInTheDocument();
  expect(screen.getByText("privacy")).toBeInTheDocument();
  expect(screen.getByRole("dialog", { name: "cookie consent" })).toBeInTheDocument();
});
