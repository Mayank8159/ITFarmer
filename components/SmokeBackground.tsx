"use client";

export default function SmokeBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        /* object-cover is the magic here: 
           It crops the video to fill the screen regardless of aspect ratio 
        */
        className="h-full w-full object-cover opacity-70"
      >
        <source src="/largebg.mp4" type="video/mp4" />
      </video>

      {/* Dark vignette to ensure UI text stays readable over the moving smoke */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
    </div>
  );
}