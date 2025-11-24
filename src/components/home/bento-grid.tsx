"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ANIMATION_DURATIONS,
  ANIMATION_DELAYS,
} from "@/lib/constants/frontend";

const items = [
  {
    id: 1,
    title: "Sourdough",
    subtitle: "Wild Yeast Culture",
    image:
      "https://images.unsplash.com/photo-1585476263060-b55248f31968?q=80&w=2070&auto=format&fit=crop",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    title: "Croissants",
    subtitle: "French Butter",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2026&auto=format&fit=crop",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: 3,
    title: "Pastries",
    subtitle: "Seasonal Fruit",
    image:
      "https://images.unsplash.com/photo-1612203985729-70726954388c?q=80&w=1964&auto=format&fit=crop",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: 4,
    title: "Cookies",
    subtitle: "Belgian Chocolate",
    image:
      "https://images.unsplash.com/photo-1499636138143-bd630f5cf388?q=80&w=2070&auto=format&fit=crop",
    className: "md:col-span-3 md:row-span-1",
  },
];

export function BentoGrid() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: ANIMATION_DURATIONS.BENTO_GRID,
              delay: index * ANIMATION_DELAYS.STAGGER,
            }}
            viewport={{ once: true }}
            className={cn(
              "relative group overflow-hidden rounded-2xl bg-muted",
              item.className
            )}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

            <div className="absolute bottom-0 left-0 p-6 text-white">
              <p className="text-sm font-medium tracking-widest uppercase opacity-80 mb-1">
                {item.subtitle}
              </p>
              <h3 className="font-serif text-3xl md:text-4xl">{item.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
