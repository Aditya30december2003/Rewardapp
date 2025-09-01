"use client";
import { useState } from "react";
import { formatDateToLocal, formatSizeBytes } from "@/lib/utils";
import {
  createRewardCoupon,
  deleteMaterial,
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

// Memoized rendering of each comment
const renderDocument = (document) => (
  <article
    key={document.$id}
    className="px-6 py-3 text-base bg-gray-50 m-1  border border-line rounded-lg"
  >
    <div className="flex max-md:flex-col max-md:items-start items-center justify-between py-4 pl-4 pr-5 text-sm leading-6 border rounded-xl gap-4 ">
      <div className="flex  flex-1 items-center">
        <FiPaperclip
          aria-hidden="true"
          className="h-5 w-5 flex-shrink-0 text-gray-400"
        />
        <div className="ml-4 flex min-w-0 flex-1 gap-2">
          <span className=" font-medium">{document.name}</span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4">
        <div className="flex-shrink-0 border rounded-md hover:bg-gray-100 bg-gray-50 text-gray-500  text-xl h-10 aspect-square flex items-center justify-center">
          <a
            href={`${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${document.bucketId}/files/${document.$id}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`}
            target="_blank"
          >
            <FaEye />
          </a>
        </div>
        <GetLink
          link={`${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${document.bucketId}/files/${document.$id}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`}
        />
        <GenerateQR
          link={`${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${document.bucketId}/files/${document.$id}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`}
        />
        <div className="flex-shrink-0 border rounded-md hover:bg-gray-100 bg-gray-50 text-gray-500  text-xl h-10 aspect-square flex items-center justify-center">
          <a
            href={`${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${document.bucketId}/files/${document.$id}/download?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`}
          >
            <FiDownload />
          </a>
        </div>
        <DeleteMaterial fileID={document.$id} />
      </div>
    </div>
    <div className="flex flex-col md:flex-row  md:justify-between gap-1 items-center mb-2">
      <div className="flex flex-col md:flex-row justify-between md:items-center items-center gap-1">
        <p className="text-sm p-1 font-normal text-center   text-gray-500 bg-white rounded-lg">
          File Type : {document.mimeType}
        </p>
        <p className="inline-flex items-center mr-3 text-sm text-gray-500 font-normal">
          File Size: {formatSizeBytes(document.sizeOriginal)}
        </p>
      </div>
      <div className="inline-flex items-center text-sm font-normal text-center border-gray-200 text-gray-500 bg-white rounded-lg">
        {formatDateToLocal(document.$createdAt)}
      </div>
    </div>
  </article>
);

function DeleteMaterial({ fileID }) {
  return (
    <form action={deleteMaterial}>
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
function GetLink({ link }) {
  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy the link.");
      });
  };

  return (
    <button
      onClick={handleCopyToClipboard}
      className="rounded-md border h-10 bg-gray-50 hover:bg-gray-100 flex items-center justify-center px-4"
    >
      <ClipboardIcon className="w-5 text-gray-600 " />
    </button>
  );
}

const MarketingMaterial = ({ files = [] }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="p-6 bg-white rounded-xl border ">
      <h2 className="text-lg font-medium text-gray-700 mb-4">
        Marketing Materials
      </h2>

      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => setIsPopupOpen(true)}
          className="px-4 py-2 bg-gray-50 border text-gray-600 rounded-md hover:bg-gray-100"
        >
          Upload New Material
        </button>
      </div>

      {files.length === 0 ? (
        <section className="mb-4 mt-6 p-4 border rounded-xl hover:bg-light duration-200 ease-in-out bg-light">
          <div className="flex items-center justify-center">
            <Empty />
          </div>
        </section>
      ) : (
        <div className="space-y-4">{files.map(renderDocument)}</div>
      )}

      {isPopupOpen && (
        <PopupForm
          title="Upload New Marketing Material"
          fields={[
            {
              fieldname: "file",
              placeholder: "Choose File",
              type: "file",
            },
          ]}
          onSubmit={uploadMaterial}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default MarketingMaterial;
