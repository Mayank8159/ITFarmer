"use client";

import React, { useEffect, useRef, useState } from "react";

interface DistortedTextProps {
  text: string;
}

class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  ease: number;
  friction: number;
  dx: number;
  dy: number;
  distance: number;
  force: number;
  angle: number;

  constructor(x: number, y: number, size: number, color: string) {
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.vx = 0;
    this.vy = 0;
    this.size = size;
    this.color = color;
    this.ease = 0.1;
    this.friction = 0.85;
    this.dx = 0;
    this.dy = 0;
    this.distance = 0;
    this.force = 0;
    this.angle = 0;
  }

  update(mouse: { x: number; y: number; radius: number }) {
    this.dx = mouse.x - this.x;
    this.dy = mouse.y - this.y;
    this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    this.force = -mouse.radius / this.distance;

    if (this.distance < mouse.radius) {
      this.angle = Math.atan2(this.dy, this.dx);
      this.vx += this.force * Math.cos(this.angle);
      this.vy += this.force * Math.sin(this.angle);
    }

    // Spring back to origin
    this.vx += (this.originX - this.x) * this.ease;
    this.vy += (this.originY - this.y) * this.ease;
    
    // Apply friction
    this.vx *= this.friction;
    this.vy *= this.friction;
    
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

export default function DistortedText({ text }: DistortedTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>(0);
  
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 100 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let width = container.clientWidth;
    // Set a fixed height that fits the huge text
    let height = window.innerWidth < 768 ? 200 : 400; 

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;

    const init = () => {
      width = container.clientWidth;
      height = window.innerWidth < 768 ? 150 : 350;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr, dpr);

      // Create text
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "black";
      
      // Responsive font size
      const fontSize = width * 0.22;
      ctx.font = `900 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Draw text in center
      ctx.fillText(text, width / 2, height / 2);

      // Read pixel data
      const textCoordinates = ctx.getImageData(0, 0, width * dpr, height * dpr);
      particlesRef.current = [];
      
      // Optimization: sample every N pixels depending on screen width
      const gap = window.innerWidth < 768 ? 3 : 5;
      
      // We read from the unscaled imageData array
      // So we have to step by gap * dpr. Use Math.floor to ensure integer steps.
      const step = Math.floor(gap * dpr);

      for (let y = 0; y < textCoordinates.height; y += step) {
        for (let x = 0; x < textCoordinates.width; x += step) {
          const index = (y * textCoordinates.width + x) * 4;
          const alpha = textCoordinates.data[index + 3];
          
          if (alpha > 128) {
            // Found a non-transparent pixel
            // Map it back to CSS pixels
            const cssX = x / dpr;
            const cssY = y / dpr;
            particlesRef.current.push(new Particle(cssX, cssY, gap - 1, "black"));
          }
        }
      }
      
      setIsReady(true);
    };

    document.fonts.ready.then(() => {
      init();
    });

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particlesRef.current.length; i++) {
        particlesRef.current[i].update(mouseRef.current);
        particlesRef.current[i].draw(ctx);
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      cancelAnimationFrame(requestRef.current!);
      init();
      animate();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [text]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 120 // Radius of mouse interaction
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && e.touches.length > 0) {
      mouseRef.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
        radius: 100
      };
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000, radius: 100 };
  };

  return (
    <div className="relative w-full overflow-hidden py-10">
      <div 
        ref={containerRef}
        className="relative w-full flex items-center justify-between px-6 border-y border-black/10 touch-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchMove}
        onTouchEnd={handleMouseLeave}
      >
        <div className="w-2 h-2 bg-[#ff6b00]" />
        
        {/* We use a wrapper to match the previous structure */}
        <div className="flex-1 flex justify-center w-full">
          <canvas 
            ref={canvasRef}
            className={`cursor-crosshair transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>

        <div className="w-2 h-2 bg-[#ff6b00]" />
      </div>
    </div>
  );
}
