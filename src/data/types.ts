
  
  
  export  interface AboutMe {
    title: string;
    body: string[];
  }
  
  export interface Skill {
    icon: string;
    text: string;
  }
  
  export interface Skills {
    soft: Skill[];
    hard: Skill[];
  }
  
  export interface Experience {
    role: string;
    description: string;
    current: boolean;
  }
  
  export interface ProfessionalData {
    title: string;
    experiences: Experience[];
  }
  
  export  interface PersonalData {
    name: string;
    role: string;
    education: string[];
    contactLinks: string[];
  }
  
  export interface ProfileData {
    personalData: PersonalData;
    aboutMe: AboutMe;
    skills: Skills;
    professionalData: ProfessionalData;
  }
  
  