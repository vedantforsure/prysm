"use client";

import { LiquidMetal } from "@paper-design/shaders-react";

interface LiquidMetalShaderProps {
  image: string;
  colorTint: string;
  scale: number;
}

export default function LiquidMetalShader({ image, colorTint, scale }: LiquidMetalShaderProps) {
  return (
    <LiquidMetal
      width={300}
      height={400}
      image={image}
      colorBack="#ffffff"
      colorTint={colorTint}
      shape={undefined}
      repetition={1.73}
      softness={0.8}
      shiftRed={1}
      shiftBlue={-1}
      distortion={0.25}
      contour={0.4}
      angle={62}
      speed={0.9}
      scale={scale}
      fit="contain"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
