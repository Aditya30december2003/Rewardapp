import { fetchPerpetratorDetails } from "@/lib/data";
import { cookies } from "next/headers";
import React from "react";

const PerpetratorDetails = async ({ userId, show }) => {
  cookies();
  const userdetails = await fetchPerpetratorDetails(userId);

  if (!userdetails) return <>N/A</>;

  return (
    <>
      {show === "name"
        ? userdetails.firstName
        : show === "email"
        ? userdetails.email
        : show === "phone"
        ? userdetails.phone
        : "N/A"}
    </>
  );
};

export default PerpetratorDetails;
