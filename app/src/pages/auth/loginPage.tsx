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
const LoginPage = () => {
  const schemaRegister = z.object({
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

  const { mutate, isLoading } = useMutation(authService.login, {
    onSuccess: () => {
      toast.success("Account created successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      const mg = err.response?.data;
      switch (mg) {
        case "USER_NOT_FOUND":
          toast.error("User not found");
          break;
        case "INVALID_PASSWORD":
          toast.error("Invalid password");
          break;
        default:
          toast.error("An error occurred");
      }
    },
  });
  return (
    <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-4">
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
            {...register("password")}
          />
        </div>
        <Button
          id="submit-login"
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <NavLink id="sign-up-link" to="../register" className="underline">
          Sign up
        </NavLink>
      </div>
    </form>
  );
};

export default LoginPage;
