import React, { useEffect, useState } from 'react';
import { CheckCircle, Star, Sparkles } from 'lucide-react';

interface CelebrationAnimationProps {
  show: boolean;
  onComplete: () => void;
}

export function CelebrationAnimation({ show, onComplete }: CelebrationAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (show) {
      // Generate confetti particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);

      // Auto-hide after animation
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Main celebration icon */}
      <div className="relative">
        <div className="animate-bounce">
          <CheckCircle size={80} className="text-green-500 drop-shadow-lg" />
        </div>
        
        {/* Success message */}
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-6 py-3 animate-fade-in">
          <p className="text-green-600 font-semibold text-lg">Task Completed! 🎉</p>
        </div>
      </div>

      {/* Confetti particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {particle.id % 3 === 0 ? (
            <Star size={16} className="text-yellow-400" />
          ) : particle.id % 3 === 1 ? (
            <Sparkles size={14} className="text-blue-400" />
          ) : (
            <div className="w-3 h-3 bg-green-400 rounded-full" />
          )}
        </div>
      ))}

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        .animate-confetti {
          animation: confetti 2s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}