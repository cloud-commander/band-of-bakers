"use client";

import { Instagram } from "lucide-react";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import Image from "next/image";

interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  link: string;
}

// Mock Instagram posts - using local images as permanent fixtures
const mockInstagramPosts: InstagramPost[] = [
  {
    id: "1",
    imageUrl: "/instagram/instagram-1.jpg",
    caption: "Fresh sourdough ready for collection",
    likes: 245,
    link: "#",
  },
  {
    id: "2",
    imageUrl: "/instagram/instagram-2.jpg",
    caption: "Almond croissants - weekend special",
    likes: 189,
    link: "#",
  },
  {
    id: "3",
    imageUrl: "/instagram/instagram-3.jpg",
    caption: "Behind the scenes at the bakery",
    likes: 312,
    link: "#",
  },
  {
    id: "4",
    imageUrl: "/instagram/instagram-4.jpg",
    caption: "Chocolate brownies - customer favorite",
    likes: 276,
    link: "#",
  },
  {
    id: "5",
    imageUrl: "/instagram/instagram-5.jpg",
    caption: "Artisan bread selection",
    likes: 198,
    link: "#",
  },
  {
    id: "6",
    imageUrl: "/instagram/instagram-6.jpg",
    caption: "Fresh from the oven",
    likes: 234,
    link: "#",
  },
];

export function InstagramFeed() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Instagram className="h-6 w-6 text-primary" />
          <h2
            className={`${DESIGN_TOKENS.typography.h3.size} ${DESIGN_TOKENS.typography.h3.weight}`}
            style={{
              fontFamily: DESIGN_TOKENS.typography.h3.family,
              color: DESIGN_TOKENS.colors.text.main,
            }}
          >
            Follow Us on Instagram
          </h2>
        </div>
        <p
          className={`${DESIGN_TOKENS.typography.body.base.size} max-w-2xl mx-auto`}
          style={{
            color: DESIGN_TOKENS.colors.text.muted,
          }}
        >
          See what&apos;s fresh from our ovens @band_of_bakers
        </p>
      </div>

      {/* Instagram Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {mockInstagramPosts.map((post) => (
          <a
            key={post.id}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={post.imageUrl}
              alt={post.caption}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-white text-center p-4">
                <Instagram className="h-6 w-6 mx-auto mb-2" />
                <p className="text-xs line-clamp-2">{post.caption}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Follow Button */}
      <div className="text-center mt-8">
        <a
          href="https://www.instagram.com/band_of_bakers/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Instagram className="h-5 w-5" />
          Follow @band_of_bakers
        </a>
      </div>
    </div>
  );
}
