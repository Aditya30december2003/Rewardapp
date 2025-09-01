import LogoutForm from "@/components/auth/LogoutForm";

export default async function LoginPage() {
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

      {/* <div className="absolute bottom-0 w-full ">
        <img src="/wave2.svg" alt="Parkheld-logo" className=" " />
      </div> */}

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
            Login to access your account
          </p>
        </div>
        <div className="md:flex-1 flex items-center justify-center">
          <LogoutForm />
        </div>
      </div>
    </main>
  );
}
