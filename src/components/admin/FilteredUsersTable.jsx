import React from "react";
import UsersTable from "./UsersTable";
import { fetchAllUsers } from "@/lib/data";
import { cookies } from "next/headers";
import auth from "@/lib/auth";

const FilteredUsersTable = async ({ filters }) => {
  cookies();
  const user = await auth.getUser();
  console.log("user=>", user);
  const userList = await fetchAllUsers(filters);

  return <UsersTable users={userList} userLabel={user.labels[0] === "superadmin"} />;
};

export default FilteredUsersTable;
