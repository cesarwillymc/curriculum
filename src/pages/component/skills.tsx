"use client";
import React, { useState } from "react";
import { Skills as SkillsType } from "../../data/types";

interface SkillsProps {
  data: SkillsType;
}

const Skills: React.FC<SkillsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<"soft" | "hard">("soft");

  const setBg = (active: "soft" | "hard") =>
    activeTab === active ? "bg-yellow" : "bg-grey";
  const setTabsAlignment = (tab: "soft" | "hard") =>
    tab === "soft" ? "text-left" : "text-right";

  const tabs = (
    <div className='flex'>
      {["soft", "hard"].map((el) => (
        <button
          key={el}
          type='button'
          className={`btn ${setBg(el as "soft" | "hard")} ${setTabsAlignment(
            el as "soft" | "hard"
          )}`}
          onClick={() => setActiveTab(el as "soft" | "hard")}
        >
          {el} Skills
        </button>
      ))}
    </div>
  );

  const content = (
    <ul
      className={`flex flex-row flex-wrap content-start list-none py-4 gap-2 ${
        activeTab === "soft" ? "justify-start" : "justify-end"
      }`}
    >
      {data[activeTab].map(({ icon, text }) => (
        <li key={text} className='skill'>
          <span>{icon}</span> {text}
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      {tabs}
      {content}
    </div>
  );
};

export default Skills;
