'use client';

import { motion } from 'framer-motion';
import CTAButton from '@/components/ui/CTAButton';
import Tooltip from '@/components/ui/Tooltip';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  technologies: string[];
  liveUrl?: string;
  image?: string;
}

const projects: Project[] = [
  {
    id: 'bite-code',
    title: 'Bite Code',
    category: 'SaaS Platform',
    description:
      'Multi-language menu management platform that allows restaurants to create digital menus with automatic translation, calorie calculation, and QR code generation.',
    features: [
      'Auto-translation in 6 languages',
      'Calorie calculation system',
      'QR code generation',
      'Language detection & switcher',
      'Real-time menu management',
    ],
    technologies: [
      'React',
      'Node.js',
      'TypeScript',
      'MongoDB',
      'Translation API',
    ],
    liveUrl: 'https://www.bite-code.com',
  },
  {
    id: 'alcona-solutions',
    title: 'Alcona Solutions',
    category: 'E-commerce CMS Platform',
    description:
      'Custom content management system and e-commerce platform for a construction materials company specializing in fences, decking, and portals.',
    features: [
      'Complete admin dashboard',
      'Product & category management',
      'Blog & content system',
      'Discount management',
      'Analytics & statistics',
      'Banner management',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Stripe'],
    liveUrl: 'https://www.alcona-solutions.com',
  },
  {
    id: 'melko',
    title: 'Melko (In Progress)',
    category: 'E-commerce CMS Platform',
    description:
      'Collaborated with a designer to develop a comprehensive website for one of the largest flour distributors in Bulgaria, featuring a full online store, general information, and a CMS for recipes linked to specific flours.',
    features: [
      'Full e-commerce functionality',
      'Recipe CMS with flour linking',
      'Company information sections',
      'Product catalog management',
      'Email integration',
      'Admin dashboard',
    ],
    technologies: [
      'Next.js',
      'JavaScript',
      'Tailwind CSS',
      'Mailgun',
      'Express',
      'MongoDB',
    ],
  },
  {
    id: 'webdiv',
    title: 'Webdiv',
    category: 'Web Design Agency',
    description:
      'Partnered up with a designer and marketing expert to create a fully SEO-optimized web design agency website featuring detailed case studies for each project and a comprehensive CMS for blog posts to boost search rankings.',
    features: [
      'SEO optimization',
      'Project case studies',
      'Blog CMS system',
      'Portfolio showcase',
      'Contact forms',
      'Performance optimization',
    ],
    technologies: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Gray-matter',
      'Remark',
    ],
    liveUrl: 'https://www.webdiv.studio',
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-card/30 border-border/50 flex h-full flex-col rounded-lg border p-6"
    >
      <header className="flex flex-1 flex-col">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-foreground mb-1 text-xl font-bold">
            {project.title}
          </h3>
          <span className="text-sm text-purple-400">{project.category}</span>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {project.description}
        </p>

        {/* Key Features */}
        <section className="mb-6">
          <h4 className="text-foreground mb-3 text-sm font-medium">
            Key Features
          </h4>
          <ul className="space-y-2" role="list">
            {project.features.slice(0, 3).map((feature, idx) => (
              <li
                key={idx}
                className="text-muted-foreground flex items-center text-sm"
              >
                <span
                  className="mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
            {project.features.length > 3 && (
              <li className="text-sm text-purple-400">
                <Tooltip
                  content={
                    <div className="text-left">
                      {project.features.slice(3).map((feature, idx) => (
                        <div key={idx} className="flex items-center py-1">
                          <span className="mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  }
                  delay={300}
                >
                  +{project.features.length - 3} more features
                </Tooltip>
              </li>
            )}
          </ul>
        </section>

        {/* Technologies */}
        <section className="mb-6 flex-1">
          <h4 className="text-foreground mb-3 text-sm font-medium">
            Technologies
          </h4>
          <div
            className="flex flex-wrap gap-2"
            role="list"
            aria-label="Technologies used"
          >
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="bg-muted/50 border-border rounded border px-2 py-1 text-xs text-white"
                role="listitem"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </header>

      {/* Action Buttons */}
      <footer className="mt-auto">
        {project.liveUrl ? (
          <CTAButton
            isAnchor={true}
            url={project.liveUrl}
            text="View Live"
            variant="outlined"
            aria-label={`View live project: ${project.title}`}
          />
        ) : (
          <CTAButton text="Coming Soon" variant="outlined" disabled={true} />
        )}
      </footer>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="bg-background py-20"
      aria-label="Portfolio projects"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-foreground mb-4 text-4xl font-black md:text-5xl">
            Some of my{' '}
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Find out more about my expertise from the projects I have worked on.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div
          className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2"
          role="list"
          aria-label="Project portfolio"
        >
          {projects.map((project, index) => (
            <article
              key={project.id}
              role="listitem"
              aria-label={`Project: ${project.title}`}
            >
              <ProjectCard project={project} index={index} />
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Interested in working together on your next project?
          </p>
          <CTAButton
            text="Start a Project"
            variant="filled"
            onClick={() => {
              document
                .querySelector('#contact')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
