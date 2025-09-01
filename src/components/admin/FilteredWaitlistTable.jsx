import React from 'react'
import UsersTable from './UsersTable'
import { fetchAllUsers, fetchAllWaitlistUsers } from '@/lib/data';
import { cookies } from 'next/headers';
import WaitlistTable from './WaitlistTable';

const FilteredWaitlistTable = async({filters}) => {
    cookies();
    const userList = await fetchAllWaitlistUsers(filters);

  return (
    <WaitlistTable users={userList} />
  )
}

export default FilteredWaitlistTable