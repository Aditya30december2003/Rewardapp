import auth from "@/lib/auth";
import Login from "@/components/auth/Login";
import { redirect } from "next/navigation";
import Verify from "@/components/auth/Verify";
import { IoMdClose } from "react-icons/io";
import { HiOutlineRefresh } from "react-icons/hi";
import { resendOTP } from "@/lib/actions";
import Link from "next/link";
import Recovery from "@/components/auth/Recovery";
import NewPassword from "@/components/auth/NewPassword";

export default async function PasswordResetPage({ searchParams }) {
  const { userId, secret } = searchParams;
  return (
    <main className="flex min-h-screen flex-col  bg-[url('/bg.webp')] bg-cover bg-center">
      <div className="absolute inset-0 ">
        <div className="h-full w-full bg-gradient-to-b from-storekwiltext to-secondary rounded-bl-[50px] opacity-75"></div>
      </div>

      <div className="flex h-30 shrink-0 items-center justify-center md:justify-start  p-6 px-20 z-10">
        <img
          src="/logowhite.png"
          alt="Parkheld-logo"
          className=" w-[120px] md:w-[180px] object-contain"
        />
      </div>

      <div className="md:mt-4 flex grow flex-col gap-0  md:gap-4 md:flex-row z-10">
        <div className="md:flex md:flex-1 flex-col justify-center max-md:text-center gap-2 rounded-lg  px-6 py-10 md:w-2/5 md:px-20">
          <h1
            className={`text-3xl text-white md:text-6xl font-bold md:leading-tight`}
          >
            Welcome to Storekwil Reward
            <br /> Dashboard
          </h1>
          <p
            className={`text-base text-white md:text-xl md:leading-normal capitalize`}
          >
            Reset Your Account Password Here
          </p>
        </div>
        <div className="md:flex-1 flex flex-col items-center justify-center">
          <NewPassword userId={userId} secret={secret} />
          <div className="mx-4 md:max-w-[400px] w-full flex items-center justify-around bg-white/[0.34] backdrop-blur-md rounded-b-lg  ">
            <Link
              href={"/login"}
              className="flex items-center justify-center gap-1 px-4 py-2 text-sm text-gray-700 hover:text-gray-100 dark:hover:bg-gray-600 z-50 "
            >
              Login Here
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
