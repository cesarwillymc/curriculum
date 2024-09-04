import React, { useId } from "react";
import SkillsContent from "./skills";
import { AboutMe as AboutMeType, Skills as SkillsType } from "../../data/types";

interface AboutMeContentProps {
  data: AboutMeType;
  skills: SkillsType;
}

const AboutMeContent: React.FC<AboutMeContentProps> = ({ data, skills }) => {
  const { title, body } = data;
  const id = useId();
  return (
    <section>
      <h2 className='mb-8'>{title}</h2>
      {body?.map((el, i) => (
        <p key={`${id}_${i}`} className='mb-6'>
          {el}
        </p>
      ))}
      <SkillsContent data={skills} />
    </section>
  );
};

export default AboutMeContent;
