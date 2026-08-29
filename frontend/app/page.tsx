'use client';

import Hero from '@/components/landing/Hero';
import Problem from '@/components/landing/Problem';
import Features from '@/components/landing/Features';
import CTA from '@/components/landing/CTA';

export default function Home() {
  return (
    <div className="landing-page">
      <Hero />
      <Problem />
      <Features />
      <CTA />
    </div>
  );
}
