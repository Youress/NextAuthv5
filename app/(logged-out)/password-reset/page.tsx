"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import Loading from "@/components/ui/Loading";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from 'next/navigation'
import { passwordReset } from "./action";


const formSchema = z.object({
  email: z.string().email(),
});

const PasswordReset = () => {
    const email = useSearchParams().get("email") 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email:decodeURIComponent( email ?? "") ,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await passwordReset(values.email)
  };
  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Passowrd Reset</CardTitle>
          <CardDescription>
            Enter Your email address to reset your password
          </CardDescription>
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
                {!!form.formState.errors.root?.message && (
                  <FormMessage>
                    {form.formState.errors.root?.message}
                  </FormMessage>
                )}
                <Button type="submit">
                  {form.formState.isSubmitting ? <Loading /> : "Submit"}
                </Button>
              </fieldset>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">
            Remember your password? <Link href="/login" className="underline">Login</Link>
          </div>
          <div className="text-muted-foreground text-sm">
            Don&apos;t have an account? <Link href="/register" className="underline">Register</Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
};

export default PasswordReset;
