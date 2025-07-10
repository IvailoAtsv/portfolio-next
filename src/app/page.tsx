import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="min-h-screen">
      <section id="hero" aria-label="Hero section">
        <Hero />
      </section>
      <section id="experience" aria-label="Work experience">
        <Experience />
      </section>
      <section id="projects" aria-label="Portfolio projects">
        <Projects />
      </section>
      <section id="contact" aria-label="Contact information">
        <Contact />
      </section>
    </main>
  );
}
