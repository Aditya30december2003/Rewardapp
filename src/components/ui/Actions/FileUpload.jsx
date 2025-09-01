"use client";
import React, { useRef, useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import { uploadDocument } from "@/lib/actions";
import Button from "@/components/common/Button";
import { IoIosArrowDropdown } from "react-icons/io";

const initialState = {
  message: "",
  type: "",
};

const FileUpload = ({ caseId }) => {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useFormState(uploadDocument, initialState);
const [submitting, setSubmitting] = useState(false)
  const formRef = useRef(null); // Reference to the form element

  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message);
      formRef.current.reset(); // Resets the form fields
      setSubmitting(false)
    } else if (state.type === "error") {
      toast.error(state.message);
      setSubmitting(false)
    }
  }, [state]);

  const handleSubmit = async (e) => {
    setSubmitting(true)
    e.preventDefault();
    
    // Initialize FormData
    const formData = new FormData(formRef.current);

    // Add caseId if needed as FormData doesn't automatically include hidden inputs
    formData.append("caseId", caseId);

    // Call form action with FormData
    await formAction(formData);
  
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* <h1 className="text-center py-3 bg-light text-accent font-bold">
        Upload Document
      </h1> */}

<div onClick={() => setOpen(!open)} className={`flex cursor-pointer  items-center justify-between py-3 px-3 font-bold  ${open ? "bg-light" : "bg-white"}`}>
        <h3 className={`subheading ${open ? "text-gray-900" : "text-gray-500"}`}>  Upload Document</h3>
        <IoIosArrowDropdown className={`cursor-pointer text-2xl hover:text-primary ${open && "rotate-180"}`} />
      </div>

     {open && <form onSubmit={handleSubmit} ref={formRef} className="px-8 py-4">
        <div className="mb-4">
          <label
            htmlFor="file_input"
            className="mb-2 block text-sm font-medium"
          >
            Choose File
          </label>
          <input
            className="block border-dashed text-sm text-gray-900 border border-gray-300 p-6 cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
            required
            id="file_input"
            name="file_input"
            type="file"
          />
          <div className="flex items-center justify-start gap-2">
            <input type="checkbox" name="docPermissions" id="docPermissions" />
            <label htmlFor="docPermissions">Make this visible to client</label>
          </div>
        </div>


        <button
         type="submit"
      className={`flex gap-2 items-center justify-center bg-secondary rounded-md px-4 py-2 w-full text-white ${
        submitting ? "!justify-center" : "justify-start"
      }`}
    >
      {submitting ? (
        <Oval
          visible={true}
          height="25"
          width="25"
          strokeWidth="4"
          color="#fff"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      ) : "Upload"}
    </button>
      </form>}
    </div>
  );
};

export default FileUpload;
