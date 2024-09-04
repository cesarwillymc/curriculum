import React from "react";
import { Envelope, Linkedin } from "./icons";
import { PersonalData } from "../../data/types";

export interface SidebarProps {
  data: PersonalData;
}

const Sidebar: React.FC<SidebarProps> = ({ data }) => {
  const { name, role, education, contactLinks } = data;

  return (
    <div className='bg-black flex flex-col content-between w-full h-auto sm:h-screen sm:justify-around sm:w-1/3 sm:fixed'>
      <div className='text-white flex flex-col p-10 items-center'>
        <img
          width={300}
          height={300}
          className='rounded-full h-full mb-6'
          src={process.env.PUBLIC_URL + '/images/profile.jpeg'}
        />
        <h1 className='mb-2'>{name}</h1>
        <h2 className='mb-8'>{role}</h2>
        <p className='mb-2'>{education[0] ?? "No education information available"}</p>
        <p className='mb-2'>{education[1] ?? "No additional education information available"}</p>
        <div className='text-white text-center mb-4 mt-4 sm:mt-8'>
          <h3 className='mb-2'>CONTACT ME</h3>
          <div className='flex flex-row justify-center gap-2'>
            <a
              className='icons-contactme'
              href={contactLinks?.[0] ?? ""}
              aria-label={"email link"}
            >
              <Envelope />
            </a>
            <a
              className='icons-contactme'
              href={contactLinks?.[1] ?? ""}
              aria-label={"linkedin link"}
            >
              <Linkedin />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
