"use client"

interface BalloonLoaderProps {
  size?: number // Diameter of the balloon
  colors?: string[] // Array of Tailwind color classes or hex codes
}

export function BalloonLoader({
  size = 24,
  colors = ["#003087", "#E03A5F", "#F5F5F5", "#FFD700"],
}: BalloonLoaderProps) {
  const animationDuration = 1.5 // seconds
  const delayStep = 0.1 // seconds

  return (
    <div className="flex justify-center items-center space-x-2" aria-label="Loading...">
      {colors.map((color, index) => (
        <div
          key={index}
          className="relative rounded-full animate-bounce-up"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            animationDelay: `${index * delayStep}s`,
            animationDuration: `${animationDuration}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        >
          {/* String for the balloon knot/tail */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-gray-400"
            style={{
              height: size / 4,
              backgroundColor: color,
              transform: `translateX(-50%) rotate(45deg)`,
              transformOrigin: "bottom center",
              bottom: `-${size / 8}px`,
            }}
          ></div>
        </div>
      ))}
      <style jsx>{`
        @keyframes bounce-up {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-${size / 2}px); /* Bounce up by half the size */
          }
        }
        .animate-bounce-up {
          animation-name: bounce-up;
        }
      `}</style>
    </div>
  )
}
