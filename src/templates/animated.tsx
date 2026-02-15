"use client"

import { CardTemplateProps } from "@/types"

export function AnimatedTemplate({
  senderName,
  recipientName,
  message,
  fontFamily,
  primaryColor,
  imageUrl,
  className = "",
}: CardTemplateProps) {
  const fontMap: Record<string, string> = {
    "sans-serif": "ui-sans-serif, system-ui, sans-serif",
    serif: "ui-serif, Georgia, serif",
    cursive: "cursive",
    monospace: "ui-monospace, monospace",
    handwriting: "cursive",
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl min-h-[500px] ${className}`}
      style={{
        background: `linear-gradient(45deg, ${primaryColor}22 0%, ${primaryColor}44 50%, ${primaryColor}22 100%)`,
        fontFamily: fontMap[fontFamily],
      }}
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 25%, ${primaryColor}88 50%, ${primaryColor}cc 75%, ${primaryColor} 100%)`,
          backgroundSize: "400% 400%",
          animation: "gradient-shift 15s ease infinite",
        }}
      />

      {/* Floating animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Pulsing border effect */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          boxShadow: `inset 0 0 60px ${primaryColor}88, 0 0 60px ${primaryColor}44`,
          animation: "pulse-glow 3s ease-in-out infinite",
        }}
      />

      {/* Main content with staggered entrance animations */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[500px] p-8 text-white">
        {/* Animated "Happy New Year" header */}
        <div
          className="mb-6 text-center"
          style={{
            animation: "fade-in-up 1s ease-out forwards",
            opacity: 0,
          }}
        >
          <div className="text-6xl font-black tracking-tight mb-2">
            Happy
          </div>
          <div
            className="text-7xl font-black tracking-tight"
            style={{
              background: `linear-gradient(45deg, white, ${primaryColor}22, white)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% auto",
              animation: "shine 3s linear infinite, fade-in-up 1s ease-out 0.2s forwards",
              opacity: 0,
            }}
          >
            New Year
          </div>
        </div>

        {/* Recipient name with delayed animation */}
        <div
          className="mb-8 text-center"
          style={{
            animation: "fade-in-up 1s ease-out 0.4s forwards",
            opacity: 0,
          }}
        >
          <div className="text-sm font-semibold tracking-widest uppercase mb-2 text-white/80">
            To
          </div>
          <div className="text-4xl font-bold">{recipientName}</div>
        </div>

        {/* Image with scale animation if provided */}
        {imageUrl && (
          <div
            className="mb-8"
            style={{
              animation: "scale-in 1s ease-out 0.6s forwards",
              opacity: 0,
            }}
          >
            <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30">
              <img
                src={imageUrl}
                alt="Card image"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Message with emphasis animation */}
        <div
          className="mb-8 max-w-xl"
          style={{
            animation: "fade-in-up 1s ease-out 0.8s forwards",
            opacity: 0,
          }}
        >
          <div className="px-8 py-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
            <p
              className="text-center text-xl leading-relaxed whitespace-pre-wrap"
              style={{
                animation: "text-glow 2s ease-in-out infinite",
              }}
            >
              {message}
            </p>
          </div>
        </div>

        {/* Sender name with final animation */}
        <div
          className="mt-6 text-center"
          style={{
            animation: "fade-in-up 1s ease-out 1s forwards",
            opacity: 0,
          }}
        >
          <div className="text-sm font-semibold tracking-widest uppercase mb-2 text-white/80">
            With love from
          </div>
          <div className="text-3xl font-bold">{senderName}</div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-30px) translateX(15px);
            opacity: 0.3;
          }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shine {
          to { background-position: 200% center; }
        }

        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.3); }
          50% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.6); }
        }
      `}</style>
    </div>
  )
}
