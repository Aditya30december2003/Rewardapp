"use client";
import React, { useRef, useState } from "react";
import { ID } from "node-appwrite";
import { createAdminClient } from "@/appwrite/config";
import { toast } from "react-toastify";

const ContentUpdate = ({ prefs, Heading, Title, bodyColor }) => {
  const formRef = useRef(null); // Create a ref for the form
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission status

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const { heading, title } = data;
    try {
      // const { databases } = await createAdminClient();

      // await databases.updateDocument(
      //   process.env.NEXT_PUBLIC_SUBSCRIPTION_DATABASE_ID,
      //   process.env.NEXT_PUBLIC_SUBSCRIBERS_COLLECTION_ID,
      //   prefs.dbId,
      //   {
      //     heading: heading,
      //     title: title,
      //   }
      // );

      const res = await fetch("/api/content-update", {
        method: "POST",
        body: JSON.stringify({ heading, title, dbId: prefs.dbId }),
        headers: { "Content-Type": "application/json" },
      });
      // console.log("res",res)
      if (res.ok) {
        toast.success("content updated successfully!");
      } else {
        toast.error(`Failed to update content `);
      }

      setIsSubmitting(false);
      formRef.current.reset(); // reset file input
    } catch (error) {
      toast.error("Failed to update content. Please try again.");
      console.error("ERROR in updating content", error);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        {/* Heading */}
        <div>
          <label
            htmlFor="heading"
            className="block text-sm font-bold mb-2 text-gray-700"
          >
            Heading Text
          </label>
          <input
            type="text"
            name="heading"
            defaultValue={Heading}
            placeholder="Enter your Heading Text"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500"
          />
        </div>

        {/* Title Update */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-bold mb-2 text-gray-700"
          >
            Title Text
          </label>
          <input
            type="text"
            name="title"
            defaultValue={Title}
            placeholder="Enter Title Text"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm  focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="mt-2 px-4 py-2  text-white text-sm rounded-md transition"
            style={{ backgroundColor: bodyColor || "#ae6af5" }}
          >
            {isSubmitting ? "updating..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentUpdate;
