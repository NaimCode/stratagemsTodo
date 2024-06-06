import imageUrl from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TodoForm from "../todos/todoForm";
import { MainNav } from "./mainNav";
import { ModeToggle } from "./themeSwitcher";
import { UserNav } from "./userNav";
export default function DashboardSection() {
  const [openInsertDialog, setOpenInsertDialog] = useState(false);
  const pathname = useLocation().pathname;
  const nav = useNavigate();
  return (
    <>
      <div className="flex-col md:flex relative">
        <div className="border-b sticky top-0 left-0 backdrop-blur-xl">
          <div className="flex h-16 items-center px-4 container ">
            <img src={imageUrl} alt="Logo" className="h-8" />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <ModeToggle />
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-3 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-lg md:text-3xl font-bold tracking-tight">
              Dashboard
            </h2>
            <div className="flex items-center space-x-2">
              <Dialog
                open={openInsertDialog}
                onOpenChange={setOpenInsertDialog}
              >
                <DialogTrigger>
                  <Button size={"sm"} className="flex items-center gap-2">
                    <Plus />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add new toDo</DialogTitle>
                    <DialogDescription>
                      <TodoForm
                        onSuccess={() => {
                          if (!pathname.includes("/todos")) {
                            nav("/todos");
                          }
                          setOpenInsertDialog(false);
                        }}
                      />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
}
