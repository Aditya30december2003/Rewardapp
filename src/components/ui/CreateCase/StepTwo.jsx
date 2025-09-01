import { useState } from "react";
import PopupForm from "./PopupForm";
import {
  createNewPlatform,
  createNewPosting,
  createNewProfileHandle,
} from "@/lib/actions";
import { type } from "os";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

// Step 2: Post Creation Form
const StepTwo = ({ platforms, profileHandles, prevStep, nextStep }) => {
  const [isPlatformPopupOpen, setPlatformPopupOpen] = useState(false);
  const [isProfilePopupOpen, setProfilePopupOpen] = useState(false);
  const [newPlatform, setNewPlatform] = useState("");
  const [newProfileHandle, setNewProfileHandle] = useState("");
  const [postText, setPostText] = useState("");
  const [postDesc, setPostDesc] = useState("");
  const caseId = localStorage.getItem("NewCaseID");
  const [loading, setloading] = useState(false);

  const handleAddPlatform = (e) => {
    localStorage.setItem("NewPlatformID", e.target.value);
    setNewPlatform(e.target.value);
  };

  const handleAddProfileHandle = (e) => {
    localStorage.setItem("NewProfileID", e.target.value);
    setNewProfileHandle(e.target.value);
  };

  const handleNext = async () => {
    setloading(true);
    const victimId = localStorage.getItem("NewVictimID");
    if (newPlatform && newProfileHandle && postText && postDesc) {
      const resp = await createNewPosting(
        postText,
        postDesc,
        newPlatform,
        victimId,
        newProfileHandle,
        caseId
      );
      if (resp) {
        nextStep();
      } else {
        toast.error("Error Creating Posting");
      }
    } else {
      toast.error("Please Fill All the Fields");
    }
    setloading(false);
  };

  return (
    <div className="p-6 bg-white rounded-xl border">
      <h2 className="text-lg font-medium text-gray-700 mb-4">
        Step 2: Create Posting
      </h2>
      <div className="flex gap-4">
        <select
          className="border border-gray-300 rounded-md w-full p-2 mb-4"
          onChange={handleAddPlatform}
        >
          <option value="">Select Platform</option>
          {platforms.map((platform) => (
            <option key={platform.$id} value={platform.$id}>
              {platform.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setPlatformPopupOpen(true)}
          className="mb-4 px-4 py-2 bg-gray-50 border text-gray-600 rounded-md hover:bg-gray-100 md:whitespace-nowrap"
        >
          Create Platform
        </button>
      </div>
      <div className="flex gap-4">
        <select
          onChange={handleAddProfileHandle}
          className="border border-gray-300 rounded-md w-full p-2 mb-4"
        >
          <option value="">Select Profile Handle</option>
          {profileHandles.map((profileHandle) => (
            <option key={profileHandle.$id} value={profileHandle.$id}>
              {profileHandle.profileHandle}
            </option>
          ))}
        </select>
        <button
          onClick={() => setProfilePopupOpen(true)}
          className="mb-4 px-4 py-2 bg-gray-50 border text-gray-600 rounded-md hover:bg-gray-100 md:whitespace-nowrap"
        >
          Create Profile Handle
        </button>
      </div>

      {isPlatformPopupOpen && (
        <PopupForm
          title="Create New Platform"
          fields={[
            {
              placeholder: "Platform Name",
              fieldname: "name",
              type: "text",
            },
            {
              placeholder: "Platform Email",
              fieldname: "email",
              type: "email",
            },
            {
              placeholder: "Platform Url",
              fieldname: "url",
              type: "url",
            },
            {
              placeholder: "Platform Address",
              fieldname: "address",
              type: "string",
            },
          ]}
          onSubmit={createNewPlatform}
          onClose={() => setPlatformPopupOpen(false)}
        />
      )}

      {isProfilePopupOpen && (
        <PopupForm
          title="Create New Profile Handle"
          fields={[
            {
              placeholder: "Profile Handle",
              fieldname: "profileHandle",
              type: "text",
            },
            {
              placeholder: "Profile Id",
              fieldname: "profileId",
              type: "text",
            },
            {
              placeholder: "Profile Url",
              fieldname: "profileUrl",
              type: "url",
            },
          ]}
          selectInputs={[
            {
              placeholder: "Select Platform",
              fieldname: "platform",
              options: platforms,
            },
          ]}
          onSubmit={createNewProfileHandle}
          onClose={() => setProfilePopupOpen(false)}
        />
      )}

      <input
        type="text"
        placeholder="Post Title"
        onChange={(e) => setPostText(e.target.value)}
        className="border border-gray-300 rounded-md w-full p-2 mb-4"
      />
      <textarea
        placeholder="Post Description"
        className="border border-gray-300 rounded-md w-full p-2 mb-4"
        onChange={(e) => setPostDesc(e.target.value)}
      />
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

export default StepTwo;
