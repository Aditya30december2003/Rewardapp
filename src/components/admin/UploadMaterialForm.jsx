import Button from "@/components/common/Button";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";

const initialState = {
  message: "",
  type: "",
};

// Popup for creating new entries
const UploadMaterialForm = ({ title, fields=[],selectInputs=[], onSubmit, onClose,secrets=[],textareas=[] }) => {
  const [state, formAction] = useFormState(onSubmit, initialState);
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef(null); // Reference to the form element

  const handleSubmit = async (e) => {
    setSubmitting(true)
    e.preventDefault();
    
    // Initialize FormData
    const formData = new FormData(formRef.current);

    // Call form action with FormData
    await formAction(formData);
    setSubmitting(false)
  };

  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message);
      onClose()
    } else if (state.type === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-[450px]  w-full">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={handleSubmit} ref={formRef}>
          {fields.map((field) => (
            <input
              key={field.fieldname}
              type={field.type}
              name={field.fieldname}
              placeholder={field.placeholder}
              required
              className="border border-gray-300 rounded-md w-full p-2 mb-2 focus:outline-none focus:border-blue-500"
            />
          ))}{" "}
          {textareas.map((textarea) => (
            <textarea
              key={textarea.fieldname}
              name={textarea.fieldname}
              placeholder={textarea.placeholder}
              defaultValue={textarea.default}
              rows={4}
              required
              className="border border-gray-300 rounded-md w-full p-2 mb-2 focus:outline-none focus:border-blue-500"
            />
          ))}{" "}
          {secrets.map((secret) => (
            <input
              key={secret.fieldname}
              type={"hidden"}
              name={secret.fieldname}
              value={secret.value}
            />
          ))}{" "}

          {
            selectInputs.map((selectInput)=>(

              <select
              key={selectInput.fieldname}
              className="border border-gray-300 rounded-md w-full p-2 mb-4"
              name={selectInput.fieldname}
              required
            >
              <option value="">{selectInput.placeholder}</option>
              {selectInput.options.map((option) => (
                <option key={option.$id} value={option.$id}>
                  {option.name}
                </option>
              ))}
         
            </select>
            )
            )
          }
          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 ">
              Cancel
            </button>
            <Button
              type="submit"
              className="bg-gray-50 border !text-gray-600 rounded-md hover:bg-gray-100 flex justify-center"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMaterialForm;
