"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const BANNERS = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&h=400&fit=crop",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&h=400&fit=crop",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&h=400&fit=crop",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&h=400&fit=crop",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&h=400&fit=crop",
];

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;

    Promise.resolve().then(() => {
      if (emblaApi) onSelect();
    });

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderRadius: "8px",
        zIndex: 1,
      }}
      ref={emblaRef}
    >
      <div style={{ display: "flex", touchAction: "pan-y" }}>
        {BANNERS.map((src, index) => (
          <div
            key={index}
            style={{
              flex: "0 0 100%",
              minWidth: 0,
              position: "relative",
              height: "350px",
            }}
          >
            <Image
              src={src}
              alt={`Promotion Banner ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
              style={{
                objectFit: "cover",
                display: "block",
              }}
            />
            {/* Optional gradient overlay to make text more readable if you add any */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "50px",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
                pointerEvents: "none",
              }}
            />
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "15px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          zIndex: 2,
        }}
      >
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            style={{
              width: selectedIndex === index ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background:
                selectedIndex === index ? "#fff" : "rgba(255, 255, 255, 0.5)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
