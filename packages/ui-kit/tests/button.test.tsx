import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../lib/components/button";
import { useTranslations } from "next-intl";

vi.mock("next-intl", () => ({
  useTranslations: vi.fn(),
}));

describe("<Button />", () => {
  const mockT = vi.fn((key: string) => key); 

  beforeEach(() => {
    (useTranslations as ReturnType<typeof vi.fn>).mockReturnValue(mockT);
  });

  it("renders a button element", () => {
    render(<Button variant="primary" text="hello" />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("displays the translated text based on the text prop", () => {
    render(<Button variant="primary" text="hello" />);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("hello");
  });
});