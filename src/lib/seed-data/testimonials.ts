import { Testimonial } from "@/db/schema";

export const mockTestimonials: Partial<Testimonial>[] = [
  {
    id: "test_1",
    name: "Sarah Jenkins",
    role: "Regular Customer",
    content:
      "The sourdough bread is absolutely amazing! It reminds me of the bakery I used to visit in Paris. Highly recommend!",
    rating: 5,
    avatar_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
    status: "approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "test_2",
    name: "Mike Thompson",
    role: "Food Blogger",
    content:
      "Best pastries in town. The croissants are flaky and buttery, just perfect. I visit every weekend.",
    rating: 5,
    avatar_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    status: "approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "test_3",
    name: "Emily Chen",
    role: "Local Resident",
    content: "I love the community vibe and the friendly staff. The coffee is great too!",
    rating: 4,
    avatar_url:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
    status: "approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
