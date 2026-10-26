import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Issue } from "@multica/core/types";
import { NavigationProvider, type NavigationAdapter } from "../../navigation";
import { BoardCardContent } from "./board-card";

vi.mock("@tanstack/react-query", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-query")>()),
  useQuery: () => ({ data: [] }),
}));

vi.mock("@multica/core/hooks", () => ({
  useWorkspaceId: () => "ws-1",
}));

vi.mock("@multica/core/properties", () => ({
  propertyListOptions: () => ({ queryKey: ["properties"] }),
}));

vi.mock("@multica/core/paths", () => ({
  useWorkspacePaths: () => ({ issueDetail: (id: string) => `/acme/issues/${id}` }),
}));

vi.mock("@multica/core/issues/stores/view-store-context", () => ({
  useViewStore: (selector: (state: unknown) => unknown) =>
    selector({
      viewMode: "board",
      grouping: "status",
      swimlaneGrouping: "assignee",
      cardProperties: {
        dueDate: true,
      },
      cardPropertyIds: [],
    }),
}));

vi.mock("@multica/core/workspace/hooks", () => ({
  useActorName: () => ({ getActorName: () => "Someone" }),
}));

vi.mock("../../i18n", () => ({
  useLocale: () => "en",
  useT: () => ({ t: () => "Due date" }),
  useTimeAgo: () => () => "now",
}));

vi.mock("../actions", () => ({
  IssueActionsContextMenu: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("./issue-agent-activity-indicator", () => ({
  IssueAgentActivityIndicator: () => null,
}));

vi.mock("./custom-status-chip", () => ({
  CustomStatusChip: () => null,
  useIsCustomStatus: () => false,
}));

const navigation: NavigationAdapter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  pathname: "/acme/issues",
  searchParams: new URLSearchParams(),
  hash: "",
  getShareableUrl: (path) => `https://app.example${path}`,
};

function renderBoardCard(issueOverrides: Partial<Issue>) {
  const issue = {
    id: "issue-1",
    identifier: "MUL-1",
    title: "Test Card",
    description: null,
    status: "todo",
    priority: "none",
    assignee_type: null,
    assignee_id: null,
    labels: [],
    properties: {},
    start_date: null,
    due_date: "2020-01-01",
    updated_at: "2026-09-27T00:00:00Z",
    ...issueOverrides,
  } as unknown as Issue;

  return render(
    <NavigationProvider value={navigation}>
      <BoardCardContent issue={issue} />
    </NavigationProvider>,
  );
}

describe("BoardCardContent due date overdue styling", () => {
  it("renders overdue due date in text-destructive for active tasks", () => {
    renderBoardCard({ status: "todo", status_category: "unstarted" });
    const dateSpan = screen.getByText("Jan 1").closest("span");
    expect(dateSpan?.className).toContain("text-destructive");
  });

  it("does not render overdue due date in text-destructive when task is done", () => {
    renderBoardCard({ status: "done", status_category: "done" });
    const dateSpan = screen.getByText("Jan 1").closest("span");
    expect(dateSpan?.className).not.toContain("text-destructive");
    expect(dateSpan?.className).toContain("text-muted-foreground");
  });

  it("does not render overdue due date in text-destructive when task is cancelled", () => {
    renderBoardCard({ status: "cancelled", status_category: "closed" });
    const dateSpan = screen.getByText("Jan 1").closest("span");
    expect(dateSpan?.className).not.toContain("text-destructive");
    expect(dateSpan?.className).toContain("text-muted-foreground");
  });

  it("does not render overdue due date in text-destructive when custom status maps to closed", () => {
    renderBoardCard({ status: "rejected", status_category: "closed" });
    const dateSpan = screen.getByText("Jan 1").closest("span");
    expect(dateSpan?.className).not.toContain("text-destructive");
    expect(dateSpan?.className).toContain("text-muted-foreground");
  });
});
