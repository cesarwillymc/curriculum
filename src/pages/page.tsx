"use client"; // Ensure this line is at the top for client-side rendering

import React from "react";
import AboutMeContent from "./component/about-me";
import ProfessionalExperienceContent from "./component/professional-experience";
import ContactForm from "./component/contact-form";

import Sidebar from "./component/sidebar";
import { useFetchData } from "../data/FetchData";
import {AboutMe, ProfessionalData,Skills,PersonalData} from "../data/types"

const Page = () => {
  const { data: dataAboutMe, loading: loadingAbout, error: errorAbout } = useFetchData<AboutMe>("aboutme");
  const { data: dataExperience, loading: loadingExperience, error: errorExperience } = useFetchData<ProfessionalData>("professional");
  const { data: dataSkills, loading: loadingSkills, error: errorSkills } = useFetchData<Skills>("skills");
  const { data: sidebarData, loading: loadingSidebar, error: errorSidebar } = useFetchData<PersonalData>("personal");

  if (loadingSidebar || loadingAbout || loadingExperience || loadingSkills) {
    return <p>Loading...</p>;
  }

  if (errorSidebar || errorAbout || errorExperience || errorSkills|| sidebarData ==null|| dataSkills ==null) {
    return <p>Error loading data</p>;
  }

  return (
    <div>
    
      {dataAboutMe && <AboutMeContent data={dataAboutMe} skills={dataSkills} />}
      {dataExperience && <ProfessionalExperienceContent data={dataExperience} />}
      <ContactForm />
    </div>
  );
};

export default Page;
