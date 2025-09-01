import React from "react";

const Input = ({ label, type = "text", className = "", ...props }) => {
  return (
    <div>
      {label && (
        <label className="inline-block mb-1 pl-1 mt-4 font-semibold capitalize">
          {label}:
        </label>
      )}
      <input
        type={type}
        className={` px-3 py-2 rounded-lg border border-gray-200 outline-none w-full duration-200 focus:bg-gray-50  ${className}`}
        {...props}
      />
    </div>
  );
};

Input.displayName = "Input";

export default Input;
