import { Metadata } from "next";
import signupImage from "@/assets/signup-image.jpg";
import Image from "next/image";
import Link from "next/link";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = () => {
  return (
    <div className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[60rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign up to D-Chat</h1>
            <p className="text-muted-foreground">
              Place to connect and forge a long lasting friendship
            </p>
          </div>
          <div className="space-y-5">
            <SignupForm />
            <Link href="/login" className="block text-center hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
        <Image
          src={signupImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </div>
  );
};

export default SignUpPage;
