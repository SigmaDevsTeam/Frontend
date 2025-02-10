import { Button, Separator, TextField } from "@radix-ui/themes";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { SubmitHandler, useForm } from "react-hook-form";
import ErrorFormMessage from "../components/ErrorFormMessage";
import { useLoginMutation } from "../store/auth/auth.api";
import { useAppDispatch } from "../store/store";
import { setUser } from "../store/auth/auth.slice";
import { useNavigate } from "react-router";

const loginScheme = z.object({
   email: z.string().nonempty("Email is not specified").email("Invalid email"),
   password: z
      .string()
      .nonempty("Password is not specified")
      .min(8, "Remember your password — it must be at least 8 characters")
});

export type loginData = z.infer<typeof loginScheme>;

const LoginPage = () => {
   const [login, { isLoading }] = useLoginMutation();
   const dispatch = useAppDispatch();
   const navigate = useNavigate();

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting }
   } = useForm<loginData>({
      resolver: zodResolver(loginScheme)
   });

   const onSubmit: SubmitHandler<loginData> = (data) => {
      if (!isSubmitting && !isLoading) {
         login(data)
            .unwrap()
            .then((user) => {
               dispatch(setUser(user));
               navigate("/", { replace: true });
            })
            .catch(console.log);
      }
   };

   return (
      <section className="container mx-auto p-4">
         <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-[450px] mx-auto p-4 flex flex-col gap-3"
         >
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <label>
               <p className="font-bold">Email:</p>
               <TextField.Root {...register("email")} placeholder="Email" />
            </label>
            {errors.email && (
               <ErrorFormMessage>{errors.email.message}</ErrorFormMessage>
            )}
            <label>
               <p className="font-bold">Password:</p>
               <TextField.Root
                  {...register("password")}
                  placeholder="Password"
                  type="password"
               />
            </label>
            {errors.password && (
               <ErrorFormMessage>{errors.password.message}</ErrorFormMessage>
            )}
            <Button>Submit</Button>
         </form>
         <div className="max-w-[450px] mx-auto px-4 flex flex-col gap-3">
            <Separator className="!w-full" />
            <h3 className="text-center">Sign in with other providers:</h3>
            <div className="flex gap-2 justify-center">
               <Button color="gray" variant="soft">
                  <p className="pi pi-google"></p>
                  Google
               </Button>
               <Button color="gray" variant="soft">
                  <p className="pi pi-github"></p>
                  Github
               </Button>
            </div>
         </div>
      </section>
   );
};

export default LoginPage;
