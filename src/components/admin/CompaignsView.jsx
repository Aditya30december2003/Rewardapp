"use client";
import { useEffect, useState } from "react";
import { formatDateToLocal, formatSizeBytes } from "@/lib/utils";
import {
  createCompaign,
  createRewardCoupon,
  deleteCompaign,
  deleteMaterial,
  updateCompaign,
  uploadMaterial,
} from "@/lib/actions";
import Empty from "../ui/Empty";
import PopupForm from "./PopupForm";
import UploadMaterialForm from "./UploadMaterialForm";
import { FiDownload, FiPaperclip } from "react-icons/fi";
import Button from "../common/Button";
import { ClipboardIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FaEye } from "react-icons/fa";
import GenerateQR from "./GenerateQR";
import { toast } from "react-toastify";
import { BiSolidOffer } from "react-icons/bi";

// Memoized rendering of each comment
const renderDocument = (document, setIsUpdatePopupOpen, setSelectedDocId) => (
  <article
    key={document.$id}
    className="px-6 py-3 text-base bg-gray-50 m-1  border border-line rounded-lg"
  >
    <div className="flex max-md:flex-col max-md:items-start items-center justify-between py-4 pl-4 pr-5 text-sm leading-6 border rounded-xl gap-4 ">
      <div className="flex  flex-1 items-center">
        <BiSolidOffer aria-hidden="true" className="text-4xl text-primary" />
        <div className="ml-4 flex min-w-0 flex-1 gap-2">
          <span className=" font-medium">
            {document.title} |{" "}
            <span className="text-gray-600">Reward : {document.reward}</span>
          </span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4">
        <div className="flex-shrink-0 border rounded-md hover:bg-gray-100 bg-gray-50 text-gray-500  text-xl h-10 aspect-square flex items-center justify-center">
          <a
            href={`${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.POSTERS_STORAGE_ID


}/files/${document.poster}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`}
            target="_blank"
          >
            <FaEye />
          </a>
        </div>

        <DeleteMaterial fileID={document.poster} docID={document.$id} />

        <div
          onClick={() => {
            setSelectedDocId(document.$id);
            setIsUpdatePopupOpen(true);
          }}
          className="flex-shrink-0 cursor-pointer border rounded-md hover:bg-gray-100 bg-gray-50 text-gray-500  text-base px-4 py-3 h-10 aspect-square flex items-center justify-center whitespace-nowrap"
        >
          Edit Expiry
        </div>
      </div>
    </div>
    <div className="flex flex-col md:flex-row  md:justify-between gap-1 items-center mb-2">
      <div className="flex flex-col md:flex-row justify-between md:items-center items-center gap-1">
        <p className="inline-flex items-center mr-3 text-sm text-gray-500 font-normal">
          Created On: {formatDateToLocal(document.$createdAt)}
        </p>
      </div>
      <div className="inline-flex items-center text-sm font-normal text-center border-gray-200 text-gray-500 bg-white rounded-lg">
        Expire On:{formatDateToLocal(document.expiry)}
      </div>
    </div>
  </article>
);

function DeleteMaterial({ docID, fileID }) {
  return (
    <form action={deleteCompaign}>
      <input type="hidden" value={docID} name="docID" />
      <input type="hidden" value={fileID} name="fileID" />
      <Button
        type="submit"
        className="rounded-md border h-10 bg-gray-50  hover:bg-gray-100 flex items-center justify-center"
      >
        <TrashIcon className="w-5 text-gray-600" />
      </Button>
    </form>
  );
}

const CompaignsView = ({ Compaigns = [] ,bodyColor}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);

  const [activeTab, setActiveTab] = useState("active");

  const today = new Date();

  const filteredCompaigns = Compaigns.filter((campaign) => {
    const expiryDate = new Date(campaign.expiry);
    return activeTab === "active" ? expiryDate >= today : expiryDate < today;
  });

  useEffect(()=>{
    document.documentElement.style.setProperty("--bodyColor", bodyColor);
    // document.documentElement.style.setProperty("--accentColor", getAccentColor);
  },[])
  return (
    <div className="p-6 bg-white rounded-xl border ">
      <h2 className="text-lg font-medium text-gray-700 mb-4">All Compaigns</h2>

      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "active"
                ? `bg-bodyColor text-white`
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("inactive")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "inactive"
                ? "bg-bodyColor text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Inactive
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIsPopupOpen(true)}
          className="px-4 py-2 bg-gray-50 border text-gray-600 rounded-md hover:bg-gray-100"
        >
          Create Compaign
        </button>
      </div>
      {/* {Compaigns.length === 0 ? (
        <section className="mb-4 mt-6 p-4 border rounded-xl hover:bg-light duration-200 ease-in-out bg-light">
          <div className="flex items-center justify-center">
            <Empty />
          </div>
        </section>
      ) : (
        <div className="space-y-4">{Compaigns.map(renderDocument)}</div>
      )} */}
      {filteredCompaigns.length === 0 ? (
        <section className="mb-4 mt-6 p-4 border rounded-xl hover:bg-light duration-200 ease-in-out bg-light">
          <div className="flex items-center justify-center">
            <Empty />
          </div>
        </section>
      ) : (
        <div className="space-y-4">
          {filteredCompaigns.map((campaign) =>
            renderDocument(campaign, setIsUpdatePopupOpen,setSelectedDocId)
          )}
        </div>
      )}

      {isPopupOpen && (
        <PopupForm
          title="Compaign Form"
          fields={[
            {
              fieldname: "title",
              placeholder: "Choose title",
              type: "text",
            },
            {
              fieldname: "reward",
              placeholder: "Reward points",
              type: "number",
            },
            {
              fieldname: "expiry",
              placeholder: "Date of Expiry",
              type: "date",
            },
            {
              fieldname: "file",
              placeholder: "Choose Poster to Upload",
              type: "file",
            },
          ]}
          onSubmit={createCompaign}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
      {isUpdatePopupOpen && (
        <PopupForm
          title="Change Expiry Date"
          fields={[
            {
              fieldname: "expiry",
              placeholder: "Date of Expiry",
              type: "date",
            },
          ]}
          secrets={[{ fieldname: "docID", value: selectedDocId }]}
          onSubmit={updateCompaign}
          onClose={() => {
            setIsUpdatePopupOpen(false);
            setSelectedDocId(null);
          }}
        />
      )}
    </div>
  );
};

export default CompaignsView;
