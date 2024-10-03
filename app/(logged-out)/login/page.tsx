"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Loading from "@/components/ui/Loading";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { passwordSchema } from "@/validation/passwordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginWithCredential, preLoginCheck } from "./action";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const formSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

type formData = z.infer<typeof formSchema>;

const LoginPage = () => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const router = useRouter();
  const form = useForm<formData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: formData) => {
    const preLoginCheckRes = await preLoginCheck({
      email: data.email,
      password: data.password,
    });
    console.log(preLoginCheckRes.TwoFactorAuthActivated);

    if (preLoginCheckRes.error) {
      form.setError("root", { message: preLoginCheckRes.message });
      return;
    }

    if (preLoginCheckRes.TwoFactorAuthActivated) {
      setStep(2);
    } else {
      const res = await loginWithCredential({
        email: data.email,
        password: data.password,
      });
      // if there no error, push user to dashboard account
      if (res?.error) {
        form.setError("root", { message: res.message });
      } else {
        router.push("/account");
      }
    }
  };
  //for forgetpassword
  const email = form.getValues("email");

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await loginWithCredential({
      email: form.getValues("email"),
      password: form.getValues("password"),
      token: otp,
    });
    if (res?.error) {
      form.setError("root", { message: res.message });
    } else {
      router.push("/account");
    }
  };
  return (
    <main className="flex justify-center items-center min-h-screen">
      {step === 1 && (
        <Card className="w-[350px] ">
          <CardHeader className="">
            <CardTitle>Login</CardTitle>
            <CardDescription>Login to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <fieldset
                  className="flex flex-col gap-4"
                  disabled={form.formState.isSubmitting}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!!form.formState.errors.root?.message && (
                    <FormMessage>
                      {form.formState.errors.root?.message}
                    </FormMessage>
                  )}
                  <Button type="submit">
                    {form.formState.isSubmitting ? <Loading /> : "Login"}
                  </Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col">
            <div className="text-muted-foreground text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline">
                Register
              </Link>
            </div>
            <div className="text-muted-foreground text-sm">
              Forget password?{" "}
              <Link
                href={`/password-reset${
                  email ? `?email=${encodeURIComponent(email)}` : ""
                }`}
                className="underline"
              >
                Reset my passowrd
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
      {step === 2 && (
        <Card className="w-[350px] ">
          <CardHeader className="">
            <CardTitle>One-Time Passcode</CardTitle>
            <CardDescription>
              Enter the one-time passcode for web displayed in your Google
              Authenticator app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOTPSubmit} className="flex flex-col gap-2">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button disabled={otp.length !== 6} type="submit">
                Verify OTP
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </main>
  );
};

export default LoginPage;
