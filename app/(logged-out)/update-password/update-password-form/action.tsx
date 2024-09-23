"use server";
interface Props {
  token: string;
  password: string;
  passwordConfirm: string;
}
export const updatePassword = async ({
  token,
  password,
  passwordConfirm,
}: Props) => {
  return { error: true, message: "flase" };
};
