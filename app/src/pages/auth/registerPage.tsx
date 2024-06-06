import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authService from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";
const RegisterPage = () => {
  const schemaRegister = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const {
    handleSubmit,
    register,
    // formState: { errors },
  } = useForm<z.infer<typeof schemaRegister>>({
    resolver: zodResolver(schemaRegister),
  });

  const { mutate, isLoading } = useMutation(authService.register, {
    onSuccess: () => {
      toast.success("Account created successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const msg = error.response?.data;
      switch (msg) {
        case "USER_ALREADY_EXISTS":
          toast.error("User already exists");
          break;
        default:
          toast.error("An error occurred");
      }
      //get message
      // const message = error.response?.data?.message;
    },
  });
  return (
    <form
      onSubmit={handleSubmit((v) => mutate({ data: v }))}
      className="space-y-6"
    >
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Register</h1>
        <p className="text-balance text-muted-foreground">
          Create an account to get started
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            {...register("name")}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            {...register("email")}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            placeholder="********"
            {...register("password")}
          />
        </div>
        <Button
          id="submit-registration"
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <NavLink id="sign-in-link" to="../login" className="underline">
          Sign in
        </NavLink>
      </div>
    </form>
  );
};

export default RegisterPage;
