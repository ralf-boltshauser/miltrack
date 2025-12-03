"use client";

import { cn } from "@/lib/utils";

interface BeautifulLoadingComponentProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function BeautifulLoadingComponent({
  className,
  size = "md",
  text,
}: BeautifulLoadingComponentProps) {
  const svgSizes = {
    sm: "size-16",
    md: "size-24",
    lg: "size-32",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-8 h-screen",
        className
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-center",
          svgSizes[size]
        )}
      >
        {/* Pulsing border */}
        <div
          className={cn(
            "absolute inset-0 rounded-sm border-2 border-primary/30 animate-swiss-pulse",
            svgSizes[size]
          )}
        />

        {/* Swiss Flag SVG with animated cross */}
        <svg
          className={cn("relative", svgSizes[size])}
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Mask that reveals from bottom to top - starts immediately */}
            <mask id="swiss-cross-mask">
              <rect x="0" y="32" width="32" height="0" fill="white">
                <animate
                  attributeName="height"
                  values="0;32;32;0"
                  dur="3s"
                  repeatCount="indefinite"
                  begin="0s"
                />
                <animate
                  attributeName="y"
                  values="32;0;0;32"
                  dur="3s"
                  repeatCount="indefinite"
                  begin="0s"
                />
              </rect>
            </mask>
          </defs>

          {/* Red background with subtle pulse */}
          <path d="m0 0h32v32h-32z" fill="#da291c" opacity="1">
            <animate
              attributeName="opacity"
              values="1;0.9;1"
              dur="2s"
              repeatCount="indefinite"
              begin="0s"
            />
          </path>

          {/* White cross with fill animation from bottom */}
          <g mask="url(#swiss-cross-mask)">
            <path d="m13 6h6v7h7v6h-7v7h-6v-7h-7v-6h7z" fill="#ffffff" />
          </g>
        </svg>
      </div>

      {text && (
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
