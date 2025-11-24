export interface Testimonial {
  id: string;
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
    name: "Sarah Mitchell",
    role: "Regular Customer",
    rating: 5,
    quote:
      "The sourdough from Band of Bakers is absolutely incredible! It's become a weekly staple in our household. The crust is perfect and the flavour is unmatched.",
    date: "2024-03-15",
  },
  {
    id: "test-2",
    name: "James Thompson",
    role: "Local Resident",
    rating: 5,
    quote:
      "I've tried many bakeries in Shropshire, but Band of Bakers stands out. Their attention to detail and quality ingredients really show in every bite.",
    date: "2024-03-10",
  },
  {
    id: "test-3",
    name: "Emma Davies",
    role: "Food Enthusiast",
    rating: 5,
    quote:
      "The almond croissants are to die for! Flaky, buttery, and with just the right amount of almond filling. I order them every weekend without fail.",
    date: "2024-03-08",
  },
  {
    id: "test-4",
    name: "Michael Roberts",
    role: "Chef",
    rating: 5,
    quote:
      "As a professional chef, I'm very particular about bread quality. Band of Bakers delivers exceptional artisan bread that I'm proud to serve to my family.",
    date: "2024-03-05",
  },
  {
    id: "test-5",
    name: "Lucy Anderson",
    role: "Busy Mum",
    rating: 5,
    quote:
      "The convenience of ordering online and the quality of the bakes make Band of Bakers perfect for our family. My kids love the brownies!",
    date: "2024-02-28",
  },
  {
    id: "test-6",
    name: "David Wilson",
    role: "Coffee Shop Owner",
    rating: 5,
    quote:
      "We've partnered with Band of Bakers to supply our café, and our customers rave about the quality. Highly professional and consistently excellent.",
    date: "2024-02-25",
  },
];
