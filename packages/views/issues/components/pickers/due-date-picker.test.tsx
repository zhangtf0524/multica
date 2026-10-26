import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithI18n } from "../../../test/i18n";
import { DueDatePicker } from "./due-date-picker";

describe("DueDatePicker", () => {
  const pastDate = "2020-01-01";

  it("shows the placeholder label when no date is set", () => {
    renderWithI18n(<DueDatePicker dueDate={null} onUpdate={vi.fn()} />);
    expect(screen.getByText("Due date")).toBeInTheDocument();
  });

  it("marks past due date as destructive for active tasks by default", () => {
    renderWithI18n(
      <DueDatePicker
        dueDate={pastDate}
        issue={{ status: "todo", status_category: "unstarted" }}
        onUpdate={vi.fn()}
      />,
    );
    const dateElement = screen.getByText("Jan 1");
    expect(dateElement).toHaveClass("text-destructive");
  });

  it("does not mark past due date as destructive when task is done", () => {
    renderWithI18n(
      <DueDatePicker
        dueDate={pastDate}
        issue={{ status: "done", status_category: "done" }}
        onUpdate={vi.fn()}
      />,
    );
    const dateElement = screen.getByText("Jan 1");
    expect(dateElement).not.toHaveClass("text-destructive");
  });

  it("does not mark past due date as destructive when task is cancelled", () => {
    renderWithI18n(
      <DueDatePicker
        dueDate={pastDate}
        issue={{ status: "cancelled", status_category: "closed" }}
        onUpdate={vi.fn()}
      />,
    );
    const dateElement = screen.getByText("Jan 1");
    expect(dateElement).not.toHaveClass("text-destructive");
  });

  it("does not mark past due date as destructive when status category behaves as closed", () => {
    renderWithI18n(
      <DueDatePicker
        dueDate={pastDate}
        issue={{ status: "rejected", status_category: "closed" }}
        onUpdate={vi.fn()}
      />,
    );
    const dateElement = screen.getByText("Jan 1");
    expect(dateElement).not.toHaveClass("text-destructive");
  });

  it("respects explicit highlightOverdue prop override", () => {
    renderWithI18n(
      <DueDatePicker
        dueDate={pastDate}
        issue={{ status: "done", status_category: "done" }}
        highlightOverdue={true}
        onUpdate={vi.fn()}
      />,
    );
    const dateElement = screen.getByText("Jan 1");
    expect(dateElement).toHaveClass("text-destructive");
  });
});
