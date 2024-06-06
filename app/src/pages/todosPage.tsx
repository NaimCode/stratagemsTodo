import { labels, priorities, statuses } from "@/sections/todos/data";
import { DataTableColumnHeader } from "@/sections/todos/data-table-column-header";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/sections/todos/data-table";
import { DataTableRowActions } from "@/sections/todos/data-table-row-actions";
import TodoForm from "@/sections/todos/todoForm";
import todosService from "@/services/todos.service";
import { Todo } from "@/type";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";

// eslint-disable-next-line react-refresh/only-export-components

// Simulate a database read for tasks.

export default function ToDoPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["todos"],
    queryFn: todosService.get,
  });
  const [editTodoDialog, setEditTodoDialog] = useState<Todo | undefined>(
    undefined
  );
  const columns: ColumnDef<Todo>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "slug",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Task" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("slug")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        const label = labels.find(
          (label) => label.value === row.original.label
        );

        return (
          <div className="flex space-x-2">
            {label && <Badge variant="outline">{label.label}</Badge>}
            <span
              data-testid={row.getValue("title")}
              className="max-w-[500px] truncate font-medium"
            >
              {row.getValue("title")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = statuses.find(
          (status) => status.value === row.getValue("status")
        );

        if (!status) {
          return null;
        }

        return (
          <div className="flex w-[100px] items-center">
            {status.icon && (
              <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span>{status.label}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => {
        const priority = priorities.find(
          (priority) => priority.value === row.getValue("priority")
        );

        if (!priority) {
          return null;
        }

        return (
          <div className="flex items-center">
            {priority.icon && (
              <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span>{priority.label}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onEdit={(v) => setEditTodoDialog(v.original)}
          onDelete={(v) =>
            todosService.remove(v.original.id).then(() => refetch())
          }
          onDuplicate={(v) =>
            todosService.duplicate(v.original.id).then(() => refetch())
          }
          onUpdateLabel={(v, label) =>
            todosService
              .update({ id: v.original.id, data: { label } })
              .then(() => refetch())
          }
          onUpdateStatus={(v, status) =>
            todosService
              .update({ id: v.original.id, data: { status } })
              .then(() => refetch())
          }
          onUpdatePriority={(v, priority) =>
            todosService
              .update({ id: v.original.id, data: { priority } })
              .then(() => refetch())
          }
        />
      ),
    },
  ];
  if (isLoading)
    return (
      <div className="h-[50vh] flex-1 flex-col space-y-8 p-8 md:flex flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  if (isError) {
    return (
      <div className="h-[50vh] flex-1 flex-col space-y-2 p-8 md:flex flex items-center justify-center">
        <span>An error occurred</span>
        <Button onClick={() => refetch()} variant={"destructive"}>
          Retry
        </Button>
      </div>
    );
  }
  return (
    <>
      <div
        data-testid="data-table"
        className="h-full flex-1 flex-col space-y-8 p-1 p:p-8 md:flex"
      >
        <DataTable data={data ?? []} columns={columns} />
      </div>
      <Dialog
        open={!!editTodoDialog}
        onOpenChange={() => setEditTodoDialog(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new toDo</DialogTitle>
            <DialogDescription>
              <TodoForm
                todo={editTodoDialog}
                onSuccess={() => {
                  setEditTodoDialog(undefined);
                }}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
