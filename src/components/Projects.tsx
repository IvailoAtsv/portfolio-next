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
  liveUrl: string;
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
    liveUrl: 'https://bite-code.com',
  },
  {
    id: 'alcona-solutions',
    title: 'Alcona Solutions',
    category: 'E-commerce CMS',
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
    liveUrl: 'https://alcona-solutions.com',
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-card/30 border-border/50 rounded-lg border p-6"
    >
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
      <div className="mb-6">
        <h4 className="text-foreground mb-3 text-sm font-medium">
          Key Features
        </h4>
        <ul className="space-y-2">
          {project.features.slice(0, 3).map((feature, idx) => (
            <li
              key={idx}
              className="text-muted-foreground flex items-center text-sm"
            >
              <span className="mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
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
      </div>

      {/* Technologies */}
      <div className="mb-6">
        <h4 className="text-foreground mb-3 text-sm font-medium">
          Technologies
        </h4>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="bg-muted/50 border-border rounded border px-2 py-1 text-xs text-white"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <CTAButton
        text="View Live"
        variant="outlined"
        onClick={() => window.open(project.liveUrl, '_blank')}
      />
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section className="bg-background py-20">
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
            Featured{' '}
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Find out more about my expertise from the projects I have worked on.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
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
              // TODO: Add contact form or email link
              console.log('Start project clicked');
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
