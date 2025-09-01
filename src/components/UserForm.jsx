"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { createNewUserRegistration } from "@/lib/actions";
import { useFormState } from "react-dom";

const initialState = {
  message: "",
  type: "",
};

export default function UserForm({
  adminId,
  currentUserData,
}) {
  const [state, formAction] = useFormState(
    createNewUserRegistration,
    initialState
  );
  const formRef = useRef(null);
  const { heading, title } = currentUserData;
  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message);
      formRef.current.reset();
    } else if (state.type === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <section className="overflow-hidden  py-8">
      <div className="max-w-4xl md:mx-auto bg-white/[0.4] backdrop-blur-sm p-8 mx-[20px] rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {heading || "Join the Waitlist"}
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          {title || " Sign up now and be the first to know about our launch."}
        </p>
        <form
          className="space-y-4"
          autoComplete="off"
          action={formAction}
          ref={formRef}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              name="firstName"
              placeholder="* First Name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <Input
              label="Last Name"
              type="text"
              name="lastName"
              placeholder="* Last Name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="* Email Address"
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <Input
              label="Company"
              type="text"
              name="company"
              placeholder="*Company"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Country"
              type="text"
              name="country"
              placeholder="* Country"
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <Input
              label="Phone"
              type="tel"
              name="phone"
              placeholder="* Telephone"
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <Input
            label="Referral Code"
            type="text"
            // defaultValue={referCode}
            name="referCode"
            placeholder="Referral Code (Optional)"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input type="hidden" value={adminId} name="adminId" />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              required
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              By clicking this box you agree to our{" "}
              <Link href="/" className="text-blue-500 underline">
                Privacy Policy
              </Link>
              .
            </span>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              type="submit"
              className="px-6 py-3  text-white font-semibold rounded-lg hover:!opacity-90 flex items-center justify-center"
              style={{ backgroundImage: `linear-gradient(to left, ${currentUserData.bodyColor || "#ae6af5"}, ${currentUserData.accentColor || "#eb89a8"})` }}
            >
              {state.loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                "Sign Up"
              )}
            </Button>
          </div>
        </form>

        {state?.message && state?.type === "error" && (
          <p className="mt-4 text-center text-red-500">{state.message}</p>
        )}
        {state?.message && state?.type === "success" && (
          <p className="mt-4 text-center bg-white/40 p-1 max-w-[400px] backdrop-blur-md mx-auto rounded-md text-green-500">{state.message}</p>
        )}
      </div>
    </section>
  );
}
