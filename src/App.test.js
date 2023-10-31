import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders location", () => {
  render(<App />);
  const location = screen.getByText(/Location/i);
  expect(location).toBeInTheDocument();
});
