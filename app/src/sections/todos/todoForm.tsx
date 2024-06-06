import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import query from "@/lib/query";
import todosService from "@/services/todos.service";
import { Todo } from "@/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "sonner";
import z from "zod";

const todoStatus = z.enum([
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "DONE",
  "CANCELED",
]);
const todoLabel = z.enum(["BUG", "FEATURE", "DOCUMENTATION"]);
const todoPriority = z.enum(["LOW", "MEDIUM", "HIGH"]);

const TodoForm = ({ onSuccess, todo }: { todo?: Todo; onSuccess(): void }) => {
  const schema = z.object({
    title: z
      .string()
      .min(3, "Title required to be at least 3 characters")
      .max(255),
    body: z
      .string()
      .min(3, "Body required to be at least 3 characters")
      .max(255),
    reminder: z.date().optional(),
    status: todoStatus,
    label: todoLabel,
    priority: todoPriority,
  });
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      title: todo?.title || "",
      body: todo?.body || "",
      reminder: todo?.reminder ? new Date(todo?.reminder) : undefined,
      status: todo?.status || "BACKLOG",
      label: todo?.label || "FEATURE",
      priority: todo?.priority || "MEDIUM",
    },
    resolver: zodResolver(schema),
  });

  const { mutate, isLoading } = useMutation(todosService.create, {
    onSuccess: () => {
      toast.success("Todo created successfully");
      onSuccess();
      query.invalidateQueries(["todos"]);
    },
    onError: (error) => {
      console.log(error);
      toast.error("An error occurred");
    },
  });

  const { mutate: update, isLoading: isUpdating } = useMutation(
    todosService.update,
    {
      onSuccess: () => {
        toast.success("Todo updated successfully");
        onSuccess();
        query.invalidateQueries(["todos"]);
      },
      onError: (error) => {
        console.log(error);
        toast.error("An error occurred");
      },
    }
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => {
          if (todo) {
            update({ id: todo.id, data: v });
            return;
          }
          mutate(v);
        })}
        className="space-y-2"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>The title of the todo.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea placeholder="" {...field} />
              </FormControl>
              <FormDescription>The body of the todo.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reminder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reminder</FormLabel>
              <FormControl>
                <DatePicker date={field.value} setDate={field.onChange} />
              </FormControl>
              <FormDescription>Set a reminder for the todo.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 md:flex-col md:gap-0 md:items-start">
                <FormLabel className="w-[100px]">Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BACKLOG">Backlog</SelectItem>
                    <SelectItem value="TODO">Todo</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                    <SelectItem value="CANCELED">Canceled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 md:flex-col md:gap-0 md:items-start">
                <FormLabel className="w-[100px]">Label</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BUG">Bug</SelectItem>
                    <SelectItem value="FEATURE">Feature</SelectItem>
                    <SelectItem value="DOCUMENTATION">Documentation</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 md:flex-col md:gap-0 md:items-start">
                <FormLabel className="w-[100px]">Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end w-full pt-5">
          <Button
            disabled={isLoading || isUpdating}
            type="submit"
            className="w-[200px]"
          >
            {(isLoading || isUpdating) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {todo ? "Update toDo" : "Create toDo"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TodoForm;
