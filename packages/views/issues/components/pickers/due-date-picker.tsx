"use client";

import { CalendarDays } from "lucide-react";
import type { Issue, UpdateIssueRequest } from "@multica/core/types";
import { issueBehavesAsAny } from "@multica/core/issues";
import { DateOnlyPicker } from "../../../common/date-only-picker";
import { useT } from "../../../i18n";

export function DueDatePicker({
  dueDate,
  onUpdate,
  highlightOverdue,
  issue,
  trigger,
  triggerRender,
  tooltip,
  open,
  onOpenChange,
  align = "start",
  defaultOpen = false,
}: {
  dueDate: string | null;
  onUpdate: (updates: Partial<UpdateIssueRequest>) => void;
  highlightOverdue?: boolean;
  issue?: Pick<Issue, "status" | "status_category">;
  trigger?: React.ReactNode;
  triggerRender?: React.ReactElement<Record<string, unknown>>;
  /** Hover tooltip naming the property; hidden while the picker is open. */
  tooltip?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  align?: "start" | "center" | "end";
  /** Open the popover on first mount. Used by progressive-disclosure
   *  sidebars so a newly-added field immediately enters edit state. */
  defaultOpen?: boolean;
}) {
  const { t } = useT("issues");
  const isClosedOrDone = issue
    ? issue.status === "done" ||
      issue.status === "cancelled" ||
      issueBehavesAsAny(issue, ["done", "closed"])
    : false;
  const shouldHighlightOverdue =
    highlightOverdue !== undefined ? highlightOverdue : !isClosedOrDone;

  return (
    <DateOnlyPicker
      value={dueDate}
      onChange={(v) => onUpdate({ due_date: v })}
      icon={<CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />}
      placeholder={t(($) => $.pickers.due_date.trigger_label)}
      emptyLabel={t(($) => $.pickers.due_date.none)}
      highlightOverdue={shouldHighlightOverdue}
      trigger={trigger}
      triggerRender={triggerRender}
      tooltip={tooltip}
      open={open}
      onOpenChange={onOpenChange}
      align={align}
      defaultOpen={defaultOpen}
    />
  );
}
