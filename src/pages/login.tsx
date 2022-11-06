import Link from "next/link";
import router, { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import dynamic from "next/dynamic";
import { CreateUserInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

const LoginForm = dynamic(() => import("../components/LoginForm"), {
  ssr: false,
});

// function VerifyToken({ hash }: { hash: string }) {
//   const { data, isLoading } = trpc.user.verifyOtp.useQuery({
//     hash,
//   });
//   if (isLoading) {
//     return <p>Verifying...</p>;
//   }
//   // router.push(data?.redirect.includes("login") ? "/" : data?.redirect || "/");
//   return <p>Redirecting...</p>;
// }

function LoginPage() {
  return (
    <div>
      <LoginForm />
    </div>
  );
  // const { handleSubmit, register } = useForm<CreateUserInput>();
  // const [success, setSuccess] = useState(false);
  // const router = useRouter();
  // const { mutate, error } = trpc.user.requestOtp.useMutation({
  //   // onError: (error) => {},
  //   onSuccess: () => {
  //     setSuccess(true);
  //   },
  // });

  // function onSubmit(values: CreateUserInput) {
  //   mutate(values);
  // }

  // const hash = router.asPath.split("#token=")[1];

  // if (hash) {
  //   return <VerifyToken hash={hash} />;
  // }

  // return (
  //   <>
  //     <form onSubmit={handleSubmit(onSubmit)}>
  //       {error && error.message}
  //       {success && <p>Check your email!</p>}
  //       <h1>Login</h1>
  //       <input
  //         type="email"
  //         placeholder="hello@example.com"
  //         {...register("email")}
  //       />
  //       <button>Login</button>
  //     </form>
  //     <Link href="/register">Register</Link>
  //   </>
  // );
}

export default LoginPage;
