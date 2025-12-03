"use client";

interface BeautifulLoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function BeautifulLoading({
  size = "md",
  text,
}: BeautifulLoadingProps = {}) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const innerSizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <div className="relative">
        {/* Outer rotating ring */}
        <div
          className={`${sizeClasses[size]} border-4 border-primary/20 rounded-full animate-spin border-t-primary`}
          style={{
            animation: "spin 1s linear infinite",
          }}
        ></div>

        {/* Inner pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`${innerSizeClasses[size]} bg-primary rounded-full`}
            style={{
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          ></div>
        </div>

        {/* Accent dots with staggered animation */}
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent rounded-full"
          style={{
            animation: "ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite",
          }}
        ></div>
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent rounded-full"
          style={{
            animation: "ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite 0.7s",
          }}
        ></div>
      </div>

      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
}
