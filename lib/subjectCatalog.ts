export type SubjectCard = {
  id: string;
  name: string;
  phase?: string;
  description?: string;
  imageUrl?: string;
  imageFileUrl?: string;
  videoUrl?: string;
  videoFileUrl?: string;
  videoPosterUrl?: string;
};

export const DEFAULT_SUBJECTS: SubjectCard[] = [
  {
    id: "art-photography",
    name: "Art and Photography",
    phase: "KS3 & KS4",
    description:
      "Art and Photography allow students to explore ideas and develop creative skills across a range of media and digital processes.",
  },
  {
    id: "business-economics",
    name: "Business and Economics",
    phase: "KS4 & KS5",
    description:
      "Business and Economics help students understand how organisations operate and how economic decisions shape society.",
  },
  {
    id: "careers-programme",
    name: "Careers Programme",
    phase: "Whole school",
    description:
      "Our careers programme supports students to make informed choices about their future education, training and employment.",
  },
  {
    id: "computing-ict",
    name: "Computing and ICT",
    phase: "KS3 & KS4",
    description:
      "Computing and ICT combine digital literacy, programming and understanding how technology shapes our lives.",
  },
  {
    id: "cpshe",
    name: "CPSHE",
    phase: "Whole school",
    description:
      "CPSHE helps students stay safe, healthy and prepared for life and work in modern Britain.",
  },
  {
    id: "design-technology",
    name: "Design and Technology",
    phase: "KS3 & KS4",
    description:
      "At KS3 pupils follow a carousel of Food, Textiles and Product Design, learning to design and make using a wide range of materials, tools and processes.",
  },
  {
    id: "drama",
    name: "Drama",
    phase: "KS3 & KS4",
    description:
      "Drama develops confidence, teamwork and creativity through practical performance work.",
  },
  {
    id: "digital-media",
    name: "Digital Media",
    phase: "KS4 & KS5",
    description:
      "Digital Media develops creative and technical skills in content creation, production and storytelling across modern platforms.",
  },
  {
    id: "english",
    name: "English",
    phase: "KS3 & KS4",
    description:
      "English at Morpeth develops confident readers, writers and speakers through a rich and diverse curriculum.",
  },
  {
    id: "film-studies",
    name: "Film Studies",
    phase: "KS4 & KS5",
    description:
      "Film Studies explores film as an art form, developing analytical, creative and practical production skills.",
  },
  {
    id: "geography",
    name: "Geography",
    phase: "KS3 & KS4",
    description:
      "Geography explores people, places and environments - locally, nationally and globally.",
  },
  {
    id: "gov-politics-citizenship",
    name: "Government, Politics and Citizenship",
    phase: "KS4 & KS5",
    description:
      "Government, Politics and Citizenship help students understand how political systems work and how citizens can influence change.",
  },
  {
    id: "history",
    name: "History",
    phase: "KS3 & KS4",
    description:
      "History helps students understand how past events have shaped the world they live in today.",
  },
  {
    id: "humanities",
    name: "Humanities",
    phase: "KS3",
    description:
      "Humanities brings together elements of History, Geography and RS to help students understand people, places and beliefs.",
  },
  {
    id: "maths",
    name: "Maths",
    phase: "KS3 & KS4",
    description:
      "Mathematics builds problem solving skills and fluency with numbers, algebra, geometry and data.",
  },
  {
    id: "media-studies",
    name: "Media Studies",
    phase: "KS4 & KS5",
    description:
      "Media Studies develops critical understanding of the media and provides opportunities for creative production.",
  },
  {
    id: "mfl",
    name: "Modern Foreign Languages",
    phase: "KS3 & KS4",
    description:
      "Students develop confidence in communicating in another language and understanding other cultures.",
  },
  {
    id: "music",
    name: "Music",
    phase: "KS3 & KS4",
    description:
      "Music provides opportunities for performance, composition and listening across many styles.",
  },
  {
    id: "pe",
    name: "PE",
    phase: "KS3 & KS4",
    description:
      "PE promotes fitness, wellbeing and teamwork through a wide range of sports and activities.",
  },
  {
    id: "psychology",
    name: "Psychology",
    phase: "KS5",
    description:
      "Psychology explores human behaviour and mental processes through scientific study.",
  },
  {
    id: "rs",
    name: "Religious Studies",
    phase: "KS3 & KS4",
    description:
      "Religious Studies supports students to explore beliefs, values and ethics in a respectful and thoughtful way.",
  },
  {
    id: "science",
    name: "Science",
    phase: "KS3 & KS4",
    description:
      "Our science curriculum encourages curiosity about the world through biology, chemistry and physics.",
  },
  {
    id: "sen",
    name: "SEN",
    phase: "Whole school",
    description:
      "SEN support ensures that pupils with additional needs can access learning and make strong progress.",
  },
  {
    id: "sociology-health-social-care",
    name: "Sociology, Health and Social Care",
    phase: "KS4 & KS5",
    description:
      "Sociology, Health and Social Care explore society, social structures and the skills needed for health and care professions.",
  },
];
