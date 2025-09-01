import React from "react";

const TextArea = ({ label, className = "", rows = 4, ...props }) => {
  return (
    <div>
      {label && (
        <label className="inline-block mb-1 pl-1 mt-4 font-semibold capitalize">
          {label}:
        </label>
      )}
      <textarea
        rows={rows}
        className={`px-3 py-2 rounded-lg border border-gray-200 outline-none w-full duration-200 focus:bg-gray-50 resize-none ${className}`}
        {...props}
      />
    </div>
  );
};

TextArea.displayName = "TextArea";

export default TextArea;
