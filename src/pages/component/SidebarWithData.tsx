"use client"; // This makes the component a Client Component

import React from 'react';
import { useFetchData } from "../../data/FetchData";
import Sidebar from "./sidebar";
import {PersonalData} from "../../data/types"
const SidebarWithData = () => {
  const { data, loading, error } = useFetchData<PersonalData>("personal" );

  if (loading) return <p>Loading...</p>;
  if (error || data==null) return <p>Error: {error}</p>;

  return <Sidebar data={data} />;
};

export default SidebarWithData;
