import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import authService from "@/services/auth.service";
import usersService from "@/services/users.service";
import { OctagonAlert } from "lucide-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";
export function UserNav() {
  const { mutateAsync: logout } = useMutation(authService.logout);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: usersService.me,
  });
  const nav = useNavigate();
  if (isLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }
  if (isError) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-50">
        <OctagonAlert className="text-red-500" />
      </div>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback className="uppercase">
              {data?.name[0]}
              {data?.name[1]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{data?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {data?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              nav("/settings/profile");
            }}
          >
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              toast.info("Coming soon!");
            }}
          >
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              nav("/settings/appearance");
            }}
          >
            Appearance
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              toast.info("Coming soon!");
            }}
          >
            New Team
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            toast.promise(logout, {
              loading: "Logging out...",
              success: () => {
                return "Logged out successfully!";
              },
              error: "Failed to log out",
            });
          }}
        >
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
