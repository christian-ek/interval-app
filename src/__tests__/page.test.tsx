import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../app/page";

test("Page", () => {
  render(<Page />);
  expect(screen.getByPlaceholderText("e.g., 1-100, 20-200")).toBeDefined();
  expect(screen.getByPlaceholderText("e.g., 5-50, 60-120")).toBeDefined();
  expect(screen.getByRole("button", { name: /submit/i })).toBeDefined();
});
