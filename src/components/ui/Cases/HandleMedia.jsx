import { deleteMedia, uploadListingImg } from "@/lib/actions";
import Image from "next/image";
import React, { useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa";

const HandleMedia = ({ defaultFiles, listingId }) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Hidden file input
  const fileInputRef = React.createRef();

  // Trigger file input click
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    console.log("File Changed to ", event.target);
    const selectedFiles = event.target.files[0];
    console.log("selectedFiles ", selectedFiles);
    if (selectedFiles) {
      console.log("uploading ", selectedFiles);
      await uploadFiles(selectedFiles);
    }
  };

  const uploadFiles = async (file) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("listingId", listingId);

    try {
      await uploadListingImg(formData); // Assuming uploadMedia accepts FormData
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId, storageId) => {
    setDeletingId(docId);
    setDeleting(true);
    await deleteMedia(docId, storageId, listingId);
    setDeleting(false);
    setDeletingId(null);
  };

  return (
    <div className="flex items-center justify-start gap-8 flex-wrap">
      {defaultFiles && (
        <div className="flex items-center justify-start gap-8 flex-wrap">
          {defaultFiles.map(({ $id, link, mediaId }, index) => (
            <div
              key={mediaId}
              className="relative border rounded-lg p-2 border-line w-36 h-24"
            >
              <Image
                src={link}
                width={120}
                height={100}
                alt={mediaId}
                className="w-full h-full object-cover"
              />

              <button
                className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md hover:bg-gray-200 transition "
                onClick={() => handleDelete($id, mediaId)}
              >
                <FaTrash size={16} color="#FF6F61" />
              </button>
              {deleting && deletingId === $id && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                  <div className="spinner-border animate-spin border-4 border-t-4 border-gray-900 w-8 h-8 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    {defaultFiles.length<5 && <form onSubmit={(e) => e.preventDefault()}>
        <div
          className="upload-box relative w-24 h-24 rounded-lg border-2 border-line border-dashed flex items-center justify-center cursor-pointer"
          onClick={handleClick}
        >
          <FaUpload size={24} color="#6B7280" />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
              <div className="spinner-border animate-spin border-4 border-t-4 border-gray-900 w-8 h-8 rounded-full"></div>
            </div>
          )}
        </div>
      </form>}
    </div>
  );
};

export default HandleMedia;
