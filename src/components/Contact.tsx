'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CTAButton from './ui/CTAButton';
import Link from 'next/link';
import { contactFormSchema, type ContactFormData } from '@/lib/contact-schema';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setIsSubmitted(true);
      reset();

      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      // You could add a toast notification here for error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-background py-20">
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
            Contact{' '}
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Me
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Any question or remarks? Just drop me a message!
          </p>
        </motion.div>

        <div className="mx-auto max-w-6xl">
          <div className="bg-card/30 border-border/50 grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border lg:grid-cols-5">
            {/* Contact Information - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800 p-8 md:p-12 lg:col-span-2"
            >
              {/* Decorative elements */}
              <div className="absolute -right-8 -bottom-8 size-36 rounded-full bg-purple-400"></div>
              <div className="absolute right-16 bottom-16 size-16 rounded-full bg-purple-300"></div>

              <div className="relative z-10">
                <h3 className="mb-4 text-3xl font-bold text-white">
                  Contact Information
                </h3>
                <p className="mb-8 text-purple-100">
                  Fill up the form and I will get back to you within 24 hours.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-6 w-6 items-center justify-center">
                      <svg
                        className="h-5 w-5 text-purple-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <Link href="tel:+359879850066" className="text-purple-100">
                      +359 879 850 066
                    </Link>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex h-6 w-6 items-center justify-center">
                      <svg
                        className="h-5 w-5 text-purple-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <Link
                      href="mailto:ivailoatanassov@gmail.com"
                      className="text-purple-100"
                    >
                      ivailoatanassov@gmail.com
                    </Link>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex h-6 w-6 items-center justify-center">
                      <svg
                        className="h-5 w-5 text-purple-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-purple-100">Bulgaria</span>
                  </div>
                </div>

                {/* Social Media Icons */}
                <div className="mt-12 flex space-x-4">
                  <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-purple-500/30 transition-colors hover:bg-purple-500/50">
                    <svg
                      className="h-5 w-5 text-purple-100"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </div>
                  <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-purple-500/30 transition-colors hover:bg-purple-500/50">
                    <svg
                      className="h-5 w-5 text-purple-100"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                  </div>
                  <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-purple-500/30 transition-colors hover:bg-purple-500/50">
                    <svg
                      className="h-5 w-5 text-purple-100"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="p-8 md:p-12 lg:col-span-3"
            >
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
                    <svg
                      className="h-8 w-8 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-foreground mb-2 text-xl font-semibold">
                    Message Sent!
                  </h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. I'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm text-white"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      {...register('fullName')}
                      className={`text-foreground placeholder-muted-foreground w-full rounded-b-md border-0 border-b-2 border-l-2 p-2 transition-colors focus:outline-none ${
                        errors.fullName
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-border focus:border-purple-500'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm text-white"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register('email')}
                        className={`text-foreground placeholder-muted-foreground w-full rounded-b-md border-0 border-b-2 border-l-2 p-2 transition-colors focus:outline-none ${
                          errors.email
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-border focus:border-purple-500'
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-sm text-white"
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        {...register('phone')}
                        className={`text-foreground placeholder-muted-foreground w-full rounded-b-md border-0 border-b-2 border-l-2 p-2 transition-colors focus:outline-none ${
                          errors.phone
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-border focus:border-purple-500'
                        }`}
                        placeholder="+359 123 456 789"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm text-white"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      {...register('message')}
                      rows={4}
                      className={`text-foreground placeholder-muted-foreground w-full rounded-b-md border-0 border-b-2 border-l-2 p-2 transition-colors focus:outline-none ${
                        errors.message
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-border focus:border-purple-500'
                      }`}
                      placeholder="What do you want to discuss?"
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-6">
                    <CTAButton
                      text={isSubmitting ? 'Sending...' : 'Send Message'}
                      variant="filled"
                      disabled={isSubmitting}
                      className="px-12"
                    />
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
