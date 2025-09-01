import { useState } from "react";
import PopupForm from "./PopupForm";
import { type } from "os";
import { createNewCase, createNewVictim } from "@/lib/actions";
import next from "next";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

// Step 1: Victim Selection or Creation
const StepOne = ({ victims, nextStep }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newVictimID, setNewVictimID] = useState("");
  const [loading, setloading] = useState(false);

  const handleSelection = (e) => {
    localStorage.setItem("NewVictimID", e.target.value);
    setNewVictimID(e.target.value);
  };

  // const handleNext = async() => {
  //   if(newVictimID){
  //     const NewCaseID=await createNewCase.bind(null,newVictimID)
  //     if(NewCaseID){
  //       localStorage.setItem("NewCaseID", NewCaseID);
  //       nextStep()
  //     }else{
  //       toast.error("Error Creating Case for the Selected Victim")
  //     }
  //   }else{
  //     toast.error("Please Select Victim")
  //   }
  // };

  const handleNext = async () => {
    setloading(true);
    if (newVictimID) {
      try {
        const NewCaseID = await createNewCase(newVictimID); // Call the server action directly

        if (NewCaseID) {
          localStorage.setItem("NewCaseID", NewCaseID); // Store NewCaseID in localStorage
          nextStep(); // Move to the next step
        } else {
          toast.error("Error Creating Case for the Selected Victim");
          setloading(false);
        }
      } catch (error) {
        toast.error("An error occurred while creating the case.");
        console.error("Error in createNewCase:", error);
        setloading(false);
      }
    } else {
      toast.error("Please Select Victim");
      setloading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl border ">
      <h2 className="text-lg font-medium text-gray-700 mb-4">
        Step 1: Choose or Create Victim
      </h2>

      <div className="flex gap-4">
        <select
          onChange={handleSelection}
          name="NewVictimID"
          className="border border-gray-300 rounded-md w-full p-2 mb-4 cursor-pointer outline-none"
          required
        >
          <option value="">Choose a Victim</option>
          {victims.map((victim) => (
            <option key={victim.$id} value={victim.$id}>
              {victim.name}
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
          title="Create New Victim"
          fields={[
            {
              fieldname: "name",
              placeholder: "Name",
              type: "text",
            },
            {
              fieldname: "email",
              placeholder: "Email",
              type: "email",
            },
          ]}
          onSubmit={createNewVictim}
          onClose={() => setIsPopupOpen(false)}
        />
      )}

      <div className="flex justify-between pt-5 mt-5 border-t border-t-gray-200">
        <button className="px-4 py-2 border-gray-200 rounded-md text-gray-300 border cursor-not-allowed">
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

export default StepOne;
