'use client';

import { motion } from 'framer-motion';
import Tooltip from '@/components/ui/Tooltip';

interface ExperienceItem {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  highlights: string[];
  technologies?: string[];
}

const experiences: ExperienceItem[] = [
  {
    id: 'education',
    title: 'SoftUni JavaScript Roadmap',
    organization: 'Software University',
    period: '2022 - 2023',
    description:
      'Studied computer science fundamentals, programming languages, and software development methodologies.',
    highlights: [
      'Learned the basics of JavaScript',
      'Built my first websites using HTML and CSS',
      'Implemented javascript logic to make my websites interactive',
      'Learned React in depth, so I can build complex web applications faster',
      'Studied Node.js and MongoDB, so I can build backend services, authentication, and more',
      'Used Git and GitHub to manage my code and collaborate with other developers',
    ],
    technologies: [
      'JavaScript',
      'HTML',
      'CSS',
      'React',
      'Node.js',
      'Git',
      'GitHub',
    ],
  },
  {
    id: 'freelancing',
    title: 'Freelance Web Developer',
    organization: 'Independent',
    period: '2023 - Present',
    description:
      'Provided web development services to various clients, building custom websites and web applications.',
    highlights: [
      'Built 10+ custom websites and web applications',
      'Maintained and updated existing websites and web applications',
      'Developed e-commerce platforms and solutions',
      'Met and exceeded client expectations on every project',
      'Created beautiful andresponsive designs',
    ],
    technologies: [
      'React',
      'Next.js',
      'JavaScript',
      'TypeScript',
      'Node.js',
      'Express',
      'Tailwind CSS',
      'Git',
      'GitHub',
      'MongoDB',
      'OpenAI api',
      'Stripe',
      'Mailgun',
      'Nodemailer',
    ],
  },
  {
    id: 'current-job',
    title: 'Fullstack Developer',
    organization: 'Vention',
    period: '2024 - Present',
    description:
      'Worked in a production enviroment alongside other developers, designers, and QA engineers.',
    highlights: [
      'Worked on a variety of projects with a variety of technologies',
      'Stayed up to date with the latest technologies and trends, by taking internal exams and courses. ',
      'Thrived in a fast-paced environment',
      'Worked in a team of over 10 developers',
      'Successfully replicated existing designs and requested features',
    ],
    technologies: [
      'React',
      'TypeScript',
      'Next.js',
      'React Query',
      'Redux',
      'Zod',
      'Formik',
      'Docker',
      'MongoDB',
    ],
  },
];

function ExperienceCard({
  experience,
  index,
}: {
  experience: ExperienceItem;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Timeline dot */}
      <div className="border-background absolute top-6 -left-0.5 size-5 rounded-full border-4 bg-purple-500"></div>

      {/* Content */}
      <div className="ml-8 pb-12">
        <div className="bg-card/30 border-border/50 rounded-lg border p-6">
          {/* Header */}
          <div className="mb-4">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-foreground text-xl font-bold">
                {experience.title}
              </h3>
              <span className="ml-4 text-sm whitespace-nowrap text-purple-400">
                {experience.period}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {experience.organization}
            </p>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {experience.description}
          </p>

          {/* Highlights */}
          <div className="mb-6">
            <h4 className="text-foreground mb-3 text-sm font-medium">
              Key Highlights
            </h4>
            <ul className="space-y-2">
              {experience.highlights.slice(0, 3).map((highlight, idx) => (
                <li
                  key={idx}
                  className="text-muted-foreground flex items-center text-sm"
                >
                  <span className="mr-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                  {highlight}
                </li>
              ))}
              {experience.highlights.length > 3 && (
                <li className="text-sm text-purple-400">
                  <Tooltip
                    content={
                      <div className="text-left">
                        {experience.highlights
                          .slice(3)
                          .map((highlight, idx) => (
                            <div key={idx} className="flex items-center py-1">
                              <span className="mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                              {highlight}
                            </div>
                          ))}
                      </div>
                    }
                    delay={300}
                  >
                    +{experience.highlights.length - 3} more highlights
                  </Tooltip>
                </li>
              )}
            </ul>
          </div>

          {/* Technologies */}
          {experience.technologies && (
            <div>
              <h4 className="text-foreground mb-3 text-sm font-medium">
                Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="bg-muted/50 border-border rounded border px-2 py-1 text-xs text-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
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
            Experience
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            My journey from student to professional developer.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-3xl">
          {/* Vertical line */}
          <div className="bg-border absolute top-0 bottom-12 left-2 w-px"></div>

          {/* Experience items */}
          <div className="space-y-0">
            {experiences.map((experience, index) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
