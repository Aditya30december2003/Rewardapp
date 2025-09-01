import Button from "@/components/common/Button";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useFormState, useFormStatus } from "react-dom";

const initialState = { message: "", type: "" };

// Re-usable submit button with pending state
function SubmitBtn({ children, className }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className={`flex items-center justify-center gap-2 ${pending ? "opacity-80 cursor-not-allowed" : ""} ${className}`}
    >
      {pending && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
          <path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" strokeWidth="4" />
        </svg>
      )}
      {children}
    </Button>
  );
}

// Popup for creating new entries
const PopupForm = ({
  title,
  fields = [],
  selectInputs = [],
  onSubmit,
  onClose,
  secrets = [],
  textareas = [],
}) => {
  const [state, formAction] = useFormState(onSubmit, initialState);

  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const firstFocusableRef = useRef(null);

  // Toast + auto-close on success
  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message);
      onClose?.();
    } else if (state.type === "error") {
      toast.error(state.message);
    }
  }, [state, onClose]);

  // Close on ESC key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Auto focus the first input/select/textarea
  useEffect(() => {
    firstFocusableRef.current?.focus();
  }, []);

  // Click on backdrop to close
  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  // Helper to merge classes
  const cx = (...cls) => cls.filter(Boolean).join(" ");

  return (
    <div
      ref={overlayRef}
      onMouseDown={handleBackdropClick}
      className={cx(
        "fixed inset-0 z-50",
        "flex items-end sm:items-center justify-center",
        "bg-black/40 backdrop-blur-[2px]"
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      {/* Panel */}
      <div
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
        className={cx(
          "relative w-full sm:w-[92%] max-w-lg",
          "rounded-2xl border border-gray-200 bg-white shadow-xl",
          "dark:border-neutral-800 dark:bg-neutral-900",
          // entrance animation
          "translate-y-2 opacity-0 animate-[fadeInUp_200ms_ease-out_forwards]",
          "mx-3 my-4 sm:my-0"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-4 sm:p-5 border-b border-gray-200 dark:border-neutral-800">
          <h2 id="popup-title" className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-400 dark:hover:bg-neutral-800"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M18.3 5.71L12 12.01l-6.3-6.3-1.4 1.41 6.29 6.29-6.3 6.3 1.42 1.41 6.29-6.29 6.3 6.3 1.41-1.42-6.29-6.29 6.3-6.3z"
              />
            </svg>
          </button>
        </div>

        {/* Content (scrollable on small screens) */}
        <div className="max-h-[70vh] overflow-y-auto px-4 sm:px-5 py-4">
          <form action={formAction} className="space-y-3 sm:space-y-4">
            {/* Text Inputs */}
            {fields.map((field, idx) => (
              <div key={field.fieldname} className="space-y-1">
                {field.label && (
                  <label
                    htmlFor={field.fieldname}
                    className="block text-sm font-medium text-gray-800 dark:text-gray-200"
                  >
                    {field.label}
                  </label>
                )}
                <input
                  id={field.fieldname}
                  ref={idx === 0 ? firstFocusableRef : undefined}
                  type={field.type || "text"}
                  name={field.fieldname}
                  placeholder={field.placeholder}
                  required={field.required ?? true}
                  defaultValue={field.default}
                  className={cx(
                    "w-full rounded-lg border bg-white px-3 py-2 text-sm",
                    "border-gray-300 text-gray-900 placeholder:text-gray-400",
                    "focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500",
                    "dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-100 dark:focus:ring-indigo-400"
                  )}
                />
                {field.hint && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{field.hint}</p>
                )}
              </div>
            ))}

            {/* Textareas */}
            {textareas.map((textarea) => (
              <div key={textarea.fieldname} className="space-y-1">
                {textarea.label && (
                  <label
                    htmlFor={textarea.fieldname}
                    className="block text-sm font-medium text-gray-800 dark:text-gray-200"
                  >
                    {textarea.label}
                  </label>
                )}
                <textarea
                  id={textarea.fieldname}
                  name={textarea.fieldname}
                  placeholder={textarea.placeholder}
                  defaultValue={textarea.default}
                  rows={textarea.rows || 5}
                  required={textarea.required ?? true}
                  className={cx(
                    "w-full rounded-lg border bg-white px-3 py-2 text-sm",
                    "border-gray-300 text-gray-900 placeholder:text-gray-400",
                    "focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500",
                    "dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-100 dark:focus:ring-indigo-400"
                  )}
                />
                {textarea.hint && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{textarea.hint}</p>
                )}
              </div>
            ))}

            {/* Hidden fields */}
            {secrets.map((secret) => (
              <input
                key={secret.fieldname}
                type="hidden"
                name={secret.fieldname}
                value={secret.value}
              />
            ))}

            {/* Selects */}
            {selectInputs.map((selectInput) => (
              <div key={selectInput.fieldname} className="space-y-1">
                {selectInput.label && (
                  <label
                    htmlFor={selectInput.fieldname}
                    className="block text-sm font-medium text-gray-800 dark:text-gray-200"
                  >
                    {selectInput.label}
                  </label>
                )}
                <select
                  id={selectInput.fieldname}
                  name={selectInput.fieldname}
                  required={selectInput.required ?? true}
                  defaultValue=""
                  className={cx(
                    "w-full cursor-pointer rounded-lg border bg-white px-3 py-2 text-sm",
                    "border-gray-300 text-gray-900",
                    "focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500",
                    "dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-100 dark:focus:ring-indigo-400"
                  )}
                >
                  <option value="" disabled>
                    {selectInput.placeholder || "Select an option"}
                  </option>
                  {selectInput.options?.map((option) =>
                    typeof option === "string" ? (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ) : (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    )
                  )}
                </select>
                {selectInput.hint && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectInput.hint}</p>
                )}
              </div>
            ))}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className={cx(
                  "h-10 rounded-lg border px-4 text-sm font-medium",
                  "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500",
                  "dark:border-neutral-800 dark:bg-neutral-800 dark:text-gray-200"
                )}
              >
                Cancel
              </button>
              <SubmitBtn className="h-10 !w-fit rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                Submit
              </SubmitBtn>
            </div>
          </form>
        </div>
      </div>

      {/* Simple keyframes for entrance */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PopupForm;
