"use client";

import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import Loading from "@/components/ui/Loading";
import { passworMatchdSchema } from "@/validation/passwordMatchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { updatePassword } from "./action";

const formSchema = passworMatchdSchema

type formData = z.infer<typeof formSchema>;
type Props = {
    token : string;
}
const UpdatePasswordForm = ({token}:Props) => {
  const { toast } = useToast();

  const form = useForm<formData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (values: formData) => {
    const response = await updatePassword({
    token,
      password: values.password,
      passwordConfirm: values.passwordConfirm,
    });
    if (response?.error) {
      form.setError("root", {
        message: response.message,
      })
    }else {
      toast({
        title : "Password Change",
        description : "Your Password has been updated",
        className : "bg-green-500 text-white"
      })
    }
    form.reset()

  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset
            className="flex flex-col gap-4"
            disabled={form.formState.isSubmitting}
          >
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
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Update Password"}
            </Button>
          </fieldset>
        </form>
      </Form>
    </div>
  );
};

export default UpdatePasswordForm;
