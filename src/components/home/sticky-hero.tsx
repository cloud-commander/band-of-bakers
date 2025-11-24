import Image from "next/image";

export function StickyHero() {
  return (
    <section className="relative w-full min-h-[150vh] flex flex-col items-center">
      {/* Sticky Text Layer */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center z-10 pointer-events-none mix-blend-difference text-white">
        <h1 className="font-serif text-[15vw] leading-none tracking-tighter">ARTISAN</h1>
        <div className="h-[40vh]" /> {/* Spacer for image visibility */}
        <h1 className="font-serif text-[15vw] leading-none tracking-tighter">ALCHEMY</h1>
      </div>

      {/* Scrolling Image Layer */}
      <div className="absolute top-[30vh] w-full max-w-4xl px-4 z-0">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-2xl">
          <Image
            src="/artisan-bread.jpg"
            alt="Artisan Sourdough Bread"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
          {/* Overlay for text contrast */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>
    </section>
  );
}
