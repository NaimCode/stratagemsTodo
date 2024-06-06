import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Todo, TodoLabel, TodoPriority, TodoStatus } from "@/type";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { labels, priorities, statuses } from "./data";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onEdit: (row: Row<TData>) => void;
  onDuplicate: (row: Row<TData>) => void;
  onDelete: (row: Row<TData>) => void;
  onUpdateLabel: (row: Row<TData>, label: TodoLabel) => void;
  onUpdateStatus: (row: Row<TData>, status: TodoStatus) => void;
  onUpdatePriority: (row: Row<TData>, priority: TodoPriority) => void;
}

export function DataTableRowActions<TData>({
  row,
  onEdit,
  onDelete,
  onDuplicate,
  onUpdateLabel,
  onUpdateStatus,
  onUpdatePriority,
}: DataTableRowActionsProps<TData>) {
  const task = row.original as Todo;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          data-testid={task.title + "-actions"}
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => {
            onEdit(row);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onDuplicate(row);
          }}
        >
          Make a copy
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.status}>
              {statuses.map((label) => (
                <DropdownMenuRadioItem
                  onSelect={() => {
                    onUpdateStatus(row, label.value as TodoStatus);
                  }}
                  key={label.value}
                  value={label.value}
                >
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.label}>
              {labels.map((label) => (
                <DropdownMenuRadioItem
                  onSelect={() => {
                    onUpdateLabel(row, label.value as TodoLabel);
                  }}
                  key={label.value}
                  value={label.value}
                >
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.priority}>
              {priorities.map((label) => (
                <DropdownMenuRadioItem
                  onSelect={() => {
                    onUpdatePriority(row, label.value as TodoPriority);
                  }}
                  key={label.value}
                  value={label.value}
                >
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          data-testid={task.title + "-delete"}
          onClick={() => {
            onDelete(row);
          }}
        >
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
