export interface Testimonial {
  id: string;
  user_id?: string; // Optional for now to support existing mocks
  name: string;
  role?: string;
  avatar?: string;
  rating: number;
  quote: string;
  date: string;
}

export const mockTestimonials: Testimonial[] = [
  {
    id: "test-1",
    user_id: "user-cust-1", // Harry Potter
    name: "Sarah Mitchell",
    role: "Regular Customer",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    quote:
      "The sourdough from Band of Bakers is absolutely incredible! It's become a weekly staple in our household. The crust is perfect and the flavour is unmatched.",
    date: "2024-03-15",
  },
  {
    id: "test-2",
    name: "James Thompson",
    role: "Local Resident",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    quote:
      "I've tried many bakeries in Shropshire, but Band of Bakers stands out. Their attention to detail and quality ingredients really show in every bite.",
    date: "2024-03-10",
  },
  {
    id: "test-3",
    user_id: "user-cust-1", // Harry Potter
    name: "Emma Davies",
    role: "Food Enthusiast",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    quote:
      "The almond croissants are to die for! Flaky, buttery, and with just the right amount of almond filling. I order them every weekend without fail.",
    date: "2024-03-08",
  },
  {
    id: "test-4",
    name: "Michael Roberts",
    role: "Chef",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    quote:
      "As a professional chef, I'm very particular about bread quality. Band of Bakers delivers exceptional artisan bread that I'm proud to serve to my family.",
    date: "2024-03-05",
  },
  {
    id: "test-5",
    name: "Lucy Anderson",
    role: "Busy Mum",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    quote:
      "The convenience of ordering online and the quality of the bakes make Band of Bakers perfect for our family. My kids love the brownies!",
    date: "2024-02-28",
  },
  {
    id: "test-6",
    name: "David Wilson",
    role: "Coffee Shop Owner",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    quote:
      "We've partnered with Band of Bakers to supply our café, and our customers rave about the quality. Highly professional and consistently excellent.",
    date: "2024-02-25",
  },
  {
    id: "test-7",
    name: "Sophie Turner",
    role: "Event Planner",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    quote:
      "Band of Bakers provided the catering for my latest event and the guests were blown away. The presentation and taste were both impeccable.",
    date: "2024-02-20",
  },
  {
    id: "test-8",
    name: "Oliver Smith",
    role: "Student",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    quote:
      "Great place for a quick lunch. The sandwiches are fresh and filling. A bit pricey for a student budget but worth it for a treat.",
    date: "2024-02-18",
  },
  {
    id: "test-9",
    name: "Charlotte Brown",
    role: "Teacher",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
    quote:
      "I bring a box of pastries to the staff room every Friday and they disappear in seconds! The cinnamon swirls are a particular favourite.",
    date: "2024-02-15",
  },
  {
    id: "test-10",
    name: "William Jones",
    role: "Retiree",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    quote:
      "Reminds me of the bakeries from my childhood. Proper bread made the traditional way. Keep up the good work!",
    date: "2024-02-10",
  },
];
