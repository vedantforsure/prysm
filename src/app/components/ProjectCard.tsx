"use client";

import { sounds } from "@/lib/sounds";

interface ProjectCardProps {
  name: string;
  description: string;
  background?: React.ReactNode;
  onClick?: () => void;
}

export default function ProjectCard({ name, description, background, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={sounds.cardHover}
      onMouseDown={sounds.cardPress}
      className="project-card relative flex flex-col justify-end rounded-2xl bg-white cursor-pointer select-none w-full h-[320px] sm:h-[500px] overflow-hidden"
    >
      {background && (
        <div className="absolute inset-0 w-full h-full">{background}</div>
      )}
      <svg className="card-noise absolute inset-0 w-full h-full pointer-events-none opacity-[0.18]" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" filter="url(#card-noise)" />
      </svg>
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 50%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 50%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 50%)",
        }}
      />
      <div className="relative p-5 flex flex-col gap-1">
        <p className="text-body" style={{ color: "#ffffff" }}>{name}</p>
        <p className="text-body" style={{ color: "#bbbbbb" }}>{description}</p>
      </div>
    </div>
  );
}
