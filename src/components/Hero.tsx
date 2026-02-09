import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-kafe-black py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-kafe-gray-800 via-transparent to-transparent"></div>
      </div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-6xl md:text-8xl font-playfair font-black text-kafe-white mb-8 tracking-tighter animate-fade-in uppercase">
          KAFE SIKAD
        </h1>
        <p className="text-lg md:text-xl font-inter text-kafe-gray-400 mb-12 max-w-2xl mx-auto animate-slide-up tracking-widest uppercase border-y border-kafe-gray-800 py-4">
          Fuel Your Passion. Brewed for the Ride.
        </p>
        <div className="flex justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
          <a
            href="#menu"
            className="group relative px-10 py-4 bg-kafe-white text-kafe-black font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:bg-kafe-gray-100 overflow-hidden"
          >
            <span className="relative z-10">Explore Menu</span>
            <div className="absolute inset-0 bg-kafe-gray-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;