import { useState } from "react";
import PopupForm from "./PopupForm";
import { type } from "os";
import { createNewPerpetrator, updateNewCase } from "@/lib/actions";
import next from "next";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

// Step 1: Perpetrator Selection or Creation
const StepThree = ({ perpetrators, prevStep, nextStep }) => {
  const [loading, setloading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newPerpetratorID, setNewPerpetratorID] = useState("");
  const caseId = localStorage.getItem("NewCaseID");
  const handleSelection = (e) => {
    localStorage.setItem("NewPerpetratorID", e.target.value);
    setNewPerpetratorID(e.target.value);
  };

  const handleNext = async () => {
    setloading(true);
    if (newPerpetratorID) {
      try {
        const resp = await updateNewCase(caseId, newPerpetratorID); // Call the server action directly

        if (resp) {
          nextStep(); // Move to the next step
        } else {
          toast.error("Error Creating Case for the Selected Victim");
        }
      } catch (error) {
        toast.error("An error occurred while creating the case.");
        console.error("Error in createNewCase:", error);
      }
    } else {
      toast.error("Please Select Perpetrator");
    }
    setloading(false);
  };

  return (
    <div className="p-6 bg-white rounded-xl border ">
      <h2 className="text-lg font-medium text-gray-700 mb-4">
        Step 3: Choose or Create Perpetrator
      </h2>

      <div className="flex gap-4">
        <select
          onChange={handleSelection}
          name="NewPerpetratorID"
          className="border border-gray-300 rounded-md w-full p-2 mb-4 cursor-pointer outline-none"
          required
        >
          <option value="">Choose a Perpetrator</option>
          {perpetrators.map((Perpetrator) => (
            <option key={Perpetrator.$id} value={Perpetrator.$id}>
              {Perpetrator.firstName}
              {Perpetrator.lastName}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setIsPopupOpen(true)}
          className="mb-4 px-4 py-2 bg-gray-50 border text-gray-600 rounded-md hover:bg-gray-100 md:whitespace-nowrap"
        >
          Create New
        </button>
      </div>

      {isPopupOpen && (
        <PopupForm
          title="Create New Perpetrator"
          fields={[
            {
              fieldname: "firstName",
              placeholder: "firstName",
              type: "text",
            },
            {
              fieldname: "lastName",
              placeholder: "lastName",
              type: "text",
            },
            {
              fieldname: "email",
              placeholder: "Email",
              type: "email",
            },
            {
              fieldname: "birthDate",
              placeholder: "birthDate",
              type: "date",
            },
            {
              fieldname: "address",
              placeholder: "address",
              type: "text",
            },
            {
              fieldname: "additionalInfo",
              placeholder: "additionalInfo",
              type: "text",
            },
          ]}
          onSubmit={createNewPerpetrator}
          onClose={() => setIsPopupOpen(false)}
        />
      )}

      <div className="flex justify-between pt-5 mt-5 border-t border-t-gray-200">
        <button
          onClick={prevStep}
          className="px-4 py-2 border-accent rounded-md text-accent border"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/[0.9] min-w-[100px] flex items-center justify-center"
        >
          {loading ? (
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
            "Next"
          )}
        </button>
      </div>
    </div>
  );
};

export default StepThree;
