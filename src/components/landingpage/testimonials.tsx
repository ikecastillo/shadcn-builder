'use client';

import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const defaultTestimonials = [
  {
    text: 'Building forms is the most tedious thing to do in software development. This tool is very helpful!.',
    imageSrc: 'https://media.daily.dev/image/upload/s--Lhs9VFvX--/f_auto/v1711531445/avatars/avatar_L28cJws79VJWZec5RBvoy',
    name: 'Javier',
    username: '@itsjavi',
  },
  {
    text: 'great job. if you do not have a preview form feature on your roadmap, you should add it',
    imageSrc: 'https://lh3.googleusercontent.com/a/AEdFTp4MBPOheQciyH3zPBr-rEoC7aDcUwKM-kCnuPxB=s64-c',
    name: 'bünyamin erdal',
    username: '@bunyaminerdal',
  },
  {
    text: 'Great job! This will definitely come in hand!',
    imageSrc: 'https://lh3.googleusercontent.com/a/ACg8ocJhQZiOUS0wQBH_OTjaEZzBro3HMmxXrnPn1zq4Dzn0H3Bgznu4=s64-c',
    name: 'Rafael Siqueira',
    username: '@refeals',
  },
  {
    text: 'Its simple and elegant. Awesome product!!',
    imageSrc: 'https://media.daily.dev/image/upload/s--uWVYziJ0--/f_auto/v1746524470/avatars/avatar_KrnvdvFSFwCnP7p8ZeLpb',
    name: 'Rohit Singh',
    username: '@rohitsingh',
  },
  {
    text: 'This is nice. It’d be a killer feature to be able to set validation in it as well. Very nice tool!',
    imageSrc: 'https://lh3.googleusercontent.com/a-/AOh14GgPRc1ibgr_qsVmuINltEx_9tAUADIklkTVbEXu=s100',
    name: 'Paul Salcedo',
    username: '@psalcedo',
  },
  {
    text: 'Incredible !',
    imageSrc: 'https://avatars.githubusercontent.com/u/24997016?v=4&s=64',
    name: 'Patrice MALDI',
    username: '@pmaldi',
  },
  {
    text: 'Ya its really nice… quite seamless.',
    imageSrc: 'https://lh3.googleusercontent.com/a/ACg8ocIj7H481CxOrfrfgpjfgf7PxtvR5doTzjsMYwHY-_RQsRAh9g=s64-c',
    name: 'Anand Bhandari',
    username: '@anandbhandari',
  },
  {
    text: 'Must try it out!',
    imageSrc: 'https://media.daily.dev/image/upload/s--b8d2MTj7--/f_auto/v1741439277/avatars/avatar_NRCZpSSQsL1cvbgI7Fnwd',
    name: 'Arjun Sethi',
    username: '@sethi005',
  }
];

interface TestimonialProps {
  testimonials?: {
    text: string;
    imageSrc: string;
    name: string;
    username: string;
    role?: string;
  }[];
  title?: string;
  subtitle?: string;
  autoplaySpeed?: number;
  className?: string;
}

export default function TestimonialsCarousel({
  testimonials = defaultTestimonials,
  title = 'What developers say',
  subtitle = 'We have over 10.000 visitors who have tryed out our form builder.',
  autoplaySpeed = 3000,
  className,
}: TestimonialProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplaySpeed);

    return () => {
      clearInterval(autoplay);
    };
  }, [emblaApi, autoplaySpeed]);

  const allTestimonials = [...testimonials, ...testimonials];

  return (
    <section
      className={cn('max-w-full overflow-hidden', className)}
    >
      <div className="py-24 bg-dotted border-t overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative mb-12 text-center md:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-medium tracking-tight">
            {title}
          </h2>

          <motion.p
            className="text-muted-foreground mx-auto max-w-2xl text-base md:text-lg"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Testimonials carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {allTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${index}`}
                className="flex justify-center px-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border-border relative h-full rounded-xl border md:w-96 bg-white p-6 backdrop-blur-sm overflow-hidden"
                >
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="text-primary mb-4"
                  >
                    <div className="relative">
                      <Quote className="h-8 w-8 -rotate-180" />
                    </div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="text-foreground/90 relative mb-6 text-base leading-relaxed"
                  >
                    <span className="relative">{testimonial.text}</span>
                  </motion.p>

                  {/* Enhanced user info with animation */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="border-border/40 mt-auto flex items-center gap-3 border-t pt-2"
                  >
                    <Avatar className="border-border ring-primary/10 ring-offset-background h-10 w-10 border ring-2 ring-offset-1">
                      <AvatarImage
                        src={testimonial.imageSrc}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h4 className="text-foreground font-medium whitespace-nowrap">
                        {testimonial.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <p className="text-primary/80 text-sm whitespace-nowrap">
                          {testimonial.username}
                        </p>
                        {testimonial.role && (
                          <>
                            <span className="text-muted-foreground flex-shrink-0">
                              •
                            </span>
                            <p className="text-muted-foreground text-sm whitespace-nowrap">
                              {testimonial.role}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
