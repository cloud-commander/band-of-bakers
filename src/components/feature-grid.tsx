"use client";

import { m } from "framer-motion";
import { Wheat, Clock, Flame, Hand } from "lucide-react";
import { ANIMATION_DURATIONS, ANIMATION_DELAYS } from "@/lib/constants/frontend";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

const features = [
  {
    icon: Wheat,
    title: "Premium Flour",
    description: "Sourced from local mills using traditional stone-grinding methods.",
  },
  {
    icon: Clock,
    title: "Long Fermentation",
    description: "48-hour cold fermentation for complex flavor and digestibility.",
  },
  {
    icon: Flame,
    title: "Stone Fired",
    description: "Baked in our wood-fired oven at 500°C for perfect crust and crumb.",
  },
  {
    icon: Hand,
    title: "Hand Shaped",
    description: "Each loaf is individually shaped by our skilled bakers.",
  },
];

export function FeatureGrid() {
  return (
    <section className="w-full py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className={`${DESIGN_TOKENS.typography.h2.size} ${DESIGN_TOKENS.typography.h2.weight} mb-4`}
            style={{
              fontFamily: DESIGN_TOKENS.typography.h2.family,
              color: DESIGN_TOKENS.colors.text.main,
            }}
          >
            Why We Bake
          </h2>
          <p
            className={`${DESIGN_TOKENS.typography.body.lg.size}`}
            style={{ color: DESIGN_TOKENS.colors.text.muted }}
          >
            Crafted with intention, baked with passion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: ANIMATION_DURATIONS.FEATURE_GRID,
                  delay: index * ANIMATION_DELAYS.STAGGER,
                }}
                viewport={{ once: true }}
                className="p-8 border border-neutral-200 bg-white"
              >
                <Icon className="w-8 h-8 mb-4" style={{ color: DESIGN_TOKENS.colors.text.main }} />
                <h3
                  className={`${DESIGN_TOKENS.typography.h4.size} ${DESIGN_TOKENS.typography.h4.weight} mb-2`}
                  style={{
                    fontFamily: DESIGN_TOKENS.typography.h4.family,
                    color: DESIGN_TOKENS.colors.text.main,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className={`${DESIGN_TOKENS.typography.body.sm.size} leading-relaxed`}
                  style={{ color: DESIGN_TOKENS.colors.text.muted }}
                >
                  {feature.description}
                </p>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
