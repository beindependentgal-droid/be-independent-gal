import {
  type LucideIcon,
  PlayCircle,
  Users,
  Compass,
  Award,
} from "lucide-react";

export type AcademyCourse = {
  slug: string;
  title: string;
  track: string;
  level: string;
  duration: string;
  lessons: number;
  description: string;
  image: string;
  price?: string;
  featured?: boolean;
  idealFor?: string;
  audience?: string[];
  mentorName?: string;
  mentorTitle?: string;
  mentorBlurb?: string;
  outcomes?: string[];
  modules?: { module: string; title: string; lessons: number }[];
};

export type AcademyTrack = {
  icon: string;
  title: string;
  description: string;
  courses: number;
};

export const academyTracks: AcademyTrack[] = [
  {
    icon: "Wallet",
    title: "Financial Independence",
    description:
      "Budgeting, saving, investing, and building wealth with confidence.",
    courses: 8,
  },
  {
    icon: "Briefcase",
    title: "Career Growth",
    description:
      "CVs, interviews, leadership, and navigating the workplace with purpose.",
    courses: 6,
  },
  {
    icon: "Lightbulb",
    title: "Entrepreneurship",
    description:
      "Turn ideas into businesses, from validation to sales and scaling.",
    courses: 7,
  },
  {
    icon: "Laptop",
    title: "Digital Skills",
    description:
      "Social media, personal branding, and the digital tools that grow income.",
    courses: 5,
  },
  {
    icon: "Heart",
    title: "Wellbeing & Mindset",
    description:
      "Confidence, resilience, boundaries, and caring for your whole self.",
    courses: 4,
  },
];

export type AcademyFormat = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const academyFormats: AcademyFormat[] = [
  {
    icon: PlayCircle,
    title: "Self-paced courses",
    description: "Learn anytime, on any device, at a pace that fits your life.",
  },
  {
    icon: Users,
    title: "Live cohorts",
    description: "Join guided group classes and grow alongside other women.",
  },
  {
    icon: Compass,
    title: "1:1 mentorship",
    description:
      "Get matched with mentors who have walked the path before you.",
  },
  {
    icon: Award,
    title: "Certificates",
    description: "Earn recognition you can share with employers and clients.",
  },
];

export const academyStats = [
  { value: "30+", label: "Courses & growing" },
  { value: "5", label: "Learning tracks" },
  { value: "2,400+", label: "Women learning" },
  { value: "Free & paid options", label: "Flexible pricing" },
];

export const academyCourses: AcademyCourse[] = [
  {
    slug: "money-mastery-budget-save-invest",
    title: "Money Mastery: Budget, Save & Invest",
    track: "Financial Independence",
    level: "Beginner",
    duration: "4 weeks",
    lessons: 18,
    description:
      "Build a personal money system, kill debt, and start investing with whatever you have today.",
    image: "/images/hero-women.png",
    featured: true,
    idealFor: "Women who want more control over their money",
    outcomes: [
      "Create a simple weekly budget that actually works",
      "Reduce financial stress with confidence-building systems",
      "Start investing with small, consistent steps",
    ],
    audience: [
      "Women building secure money habits",
      "People ready to manage debt and savings",
      "Learners who want clear investing steps",
    ],
    mentorName: "Amina Yusuf",
    mentorTitle: "Founder & Money Confidence Coach",
    mentorBlurb:
      "Helping women feel more in control of their money with calm, practical steps.",
    modules: [
      { module: "Module 1", title: "Foundations of Budgeting", lessons: 4 },
      {
        module: "Module 2",
        title: "Aggressive Debt Elimination Strategies",
        lessons: 4,
      },
      {
        module: "Module 3",
        title: "Building Your Automated Savings Engine",
        lessons: 5,
      },
      {
        module: "Module 4",
        title: "Introduction to Investing & Wealth Building",
        lessons: 5,
      },
    ],
    rating: 4.9,
    certificate: true,
  },
  {
    slug: "launch-your-side-hustle",
    title: "Launch Your Side Hustle",
    track: "Entrepreneurship",
    level: "Beginner",
    duration: "5 weeks",
    lessons: 22,
    description:
      "Validate your idea, find your first customers, and make your first sales without big capital.",
    image: "/images/event.png",
    price: "$49",
    featured: true,
    idealFor: "Women ready to turn an idea into income",
    outcomes: [
      "Test market demand before spending too much",
      "Build your first offer and customer journey",
      "Turn passion into a practical income stream",
    ],
    audience: [
      "Women validating a business idea",
      "Aspiring founders needing first customers",
      "Makers who want a practical launch plan",
    ],
    mentorName: "Amina Yusuf",
    mentorTitle: "Founder & Business Coach",
    mentorBlurb: "Guiding women to launch offers with confidence and clarity.",
    rating: 4.8,
    certificate: true,
  },
  {
    slug: "own-the-interview-room",
    title: "Own the Interview Room",
    track: "Career Growth",
    level: "Intermediate",
    duration: "3 weeks",
    lessons: 12,
    description:
      "Craft a standout CV, tell your story with confidence, and negotiate the offer you deserve.",
    image: "/images/hero-women3.jpg",
    price: "$39",
    idealFor: "Women preparing for career moves or promotions",
    outcomes: [
      "Write a CV that highlights your value clearly",
      "Answer interview questions with calm confidence",
      "Negotiate offers and next steps with clarity",
    ],
    audience: [
      "Women preparing for career moves",
      "Professionals wanting interview confidence",
      "Job seekers aiming to negotiate better offers",
    ],
    mentorName: "Amina Yusuf",
    mentorTitle: "Founder & Career Confidence Coach",
    mentorBlurb: "Helping women tell their story with clarity and calm.",
    rating: 4.7,
    certificate: true,
  },
  {
    slug: "personal-branding-on-social-media",
    title: "Personal Branding on Social Media",
    track: "Digital Skills",
    level: "Beginner",
    duration: "4 weeks",
    lessons: 16,
    description:
      "Show up online with clarity, grow an audience, and turn attention into opportunity.",
    image: "/images/together.jpg",
    idealFor: "Women building visibility for their work or business",
    outcomes: [
      "Create content that feels aligned and consistent",
      "Grow your online presence with intention",
      "Turn attention into trusted opportunities",
    ],
    audience: [
      "Women growing their online presence",
      "Creatives wanting a consistent personal brand",
      "Professionals ready to share their work with clarity",
    ],
    mentorName: "Amina Yusuf",
    mentorTitle: "Founder & Brand Coach",
    mentorBlurb: "Helping women show up online with confidence and purpose.",
    rating: 4.8,
    certificate: true,
  },
  {
    slug: "confident-and-unstoppable",
    title: "Confident & Unstoppable",
    track: "Wellbeing & Mindset",
    level: "All levels",
    duration: "2 weeks",
    lessons: 9,
    description:
      "Rewire self-doubt, set healthy boundaries, and lead your life with intention.",
    image: "/images/hero-women2.jpg",
    idealFor: "Women rebuilding confidence and momentum",
    outcomes: [
      "Strengthen self-trust and self-worth",
      "Set boundaries without guilt",
      "Create a calmer, more grounded routine",
    ],
    audience: [
      "Women rebuilding confidence",
      "Professionals overcoming self-doubt",
      "Entrepreneurs seeking stronger leadership",
    ],
    mentorName: "Amina Yusuf",
    mentorTitle: "Founder & Brand Builder",
    mentorBlurb:
      "Helping women build confidence, clarity, and practical momentum.",
    rating: 4.9,
    certificate: true,
  },
  {
    slug: "grow-and-scale-your-business",
    title: "Grow & Scale Your Business",
    track: "Entrepreneurship",
    level: "Advanced",
    duration: "6 weeks",
    lessons: 25,
    description:
      "Systems, pricing, team, and marketing strategies to take your business to the next level.",
    image: "/images/hero-women.png",
    price: "$79",
    idealFor: "Women already running a business and ready to grow",
    outcomes: [
      "Improve pricing and profit strategy",
      "Build systems that reduce overwhelm",
      "Create a more sustainable growth plan",
    ],
    audience: [
      "Business owners ready to scale",
      "Founders wanting better systems",
      "Leaders building sustainable growth",
    ],
    mentorName: "Amina Yusuf",
    mentorTitle: "Founder & Growth Coach",
    mentorBlurb:
      "Supporting women to scale their business with clarity and confidence.",
    rating: 4.6,
    certificate: true,
  },
];

export function getCourseBySlug(slug: string) {
  return academyCourses.find((course) => course.slug === slug);
}

export function getAllCourseSlugs() {
  return academyCourses.map((course) => ({ slug: course.slug }));
}
