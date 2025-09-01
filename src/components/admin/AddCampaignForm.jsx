"use client"
import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const AddCampaignForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    rewardPoints: "",
    expiryDate: "",
    content: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setFormData((prevData) => ({ ...prevData, content }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
    // Add your submission logic here
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold text-center">Add Campaign</h2>

      <div className="flex flex-col space-y-2">
        <label htmlFor="title" className="font-medium">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter campaign title"
          className="p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="rewardPoints" className="font-medium">Reward Points</label>
        <input
          type="number"
          id="rewardPoints"
          name="rewardPoints"
          value={formData.rewardPoints}
          onChange={handleInputChange}
          placeholder="Enter reward points"
          className="p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="expiryDate" className="font-medium">Expiry Date</label>
        <input
          type="date"
          id="expiryDate"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-medium">Post Content</label>
        <Editor
          apiKey="y0b2592qlqf63lvd17wctykfvpucbvy7afml991ae8wh4l5r" // Replace with your TinyMCE API key if required
          value={formData.content}
          onEditorChange={handleEditorChange}
        //   init={{
        //     height: 400,
        //     menubar: false,
        //     plugins: [
        //       "advlist autolink lists link image charmap print preview anchor",
        //       "searchreplace visualblocks code fullscreen",
        //       "insertdatetime media table paste code help wordcount",
        //     ],
        //     toolbar:
        //       "undo redo | formatselect | bold italic backcolor | \
        //       alignleft aligncenter alignright alignjustify | \
        //       bullist numlist outdent indent | removeformat | help",
        //     image_title: true,
        //     automatic_uploads: true,
        //     file_picker_types: "image",
        //     file_picker_callback: function (cb, value, meta) {
        //       const input = document.createElement("input");
        //       input.setAttribute("type", "file");
        //       input.setAttribute("accept", "image/*");
        //       input.onchange = function () {
        //         const file = input.files[0];
        //         const reader = new FileReader();
        //         reader.onload = function () {
        //           const id = "blobid" + new Date().getTime();
        //           const blobCache = tinymce.activeEditor.editorUpload.blobCache;
        //           const base64 = reader.result.split(",")[1];
        //           const blobInfo = blobCache.create(id, file, base64);
        //           blobCache.add(blobInfo);
        //           cb(blobInfo.blobUri(), { title: file.name });
        //         };
        //         reader.readAsDataURL(file);
        //       };
        //       input.click();
        //     },
        //   }}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
        height: 500,
        menubar: false,
        plugins: [
           'a11ychecker','advlist','advcode','advtable','autolink','checklist','markdown',
           'lists','link','image','charmap','preview','anchor','searchreplace','visualblocks',
           'powerpaste','fullscreen','formatpainter','insertdatetime','media','table','help','wordcount'
        ],
        toolbar: 'undo redo | casechange blocks | bold italic backcolor | ' +
           'alignleft aligncenter alignright alignjustify | ' +
           'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        />
      </div>

      <button
        type="submit"
        className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Submit Campaign
      </button>
    </form>
  );
};

export default AddCampaignForm;
