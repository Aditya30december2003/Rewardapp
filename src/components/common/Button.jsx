"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { Oval } from "react-loader-spinner";

const Button = ({
  children,
  type = "button",
  bgColor = "bg-blue-600",
  textColor = "text-white",
  className = "",
  ...props
}) => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className={`${bgColor} ${textColor} ${className} rounded-md px-4 py-2 w-full ${
        pending ? "!justify-center" : "justify-start"
      }`}
      {...props}
      type={type}
    >
      {pending ? (
        <Oval
          visible={true}
          height="25"
          width="25"
          strokeWidth="4"
          color="#fff"
          secondaryColor="gray"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      ) : (
        children
      )}
    </button>
  );
};

Button.displayName = "Button";
export default Button;
