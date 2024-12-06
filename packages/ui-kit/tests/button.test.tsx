import { expect, describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "@/components/button";

describe("<Button />", () => {
  it("renders a button element", () => {
    render(<Button>Hello</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Hello");
  });
});
