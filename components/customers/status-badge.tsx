import { STATUS_COLORS, PRIORITY_COLORS, type Priority } from "@/constants/enums";
import { cn } from "@/lib/utils/cn";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_COLORS[status] ?? "bg-neutral-100 text-neutral-600"
      )}
    >
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const icon = priority === "A" ? "🔥 " : "";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        PRIORITY_COLORS[priority]
      )}
    >
      {icon}Priority {priority}
    </span>
  );
}
