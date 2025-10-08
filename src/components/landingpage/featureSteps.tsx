'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Rocket, Code, Paintbrush } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    step: 'Step 1',
    title: 'Select all the fields you need',
    content:
        'Choose from Jira fields or custom non-Jira tracked fields to build your customer-facing form.',
    icon: <Rocket className="text-primary h-6 w-6" />,
    image:
      '/images/features/drag_and_drop.png',
  },
  {
    step: 'Step 2',
    title: 'Customize your form',
    content:
      'Customize your form layout, styling, and behavior to match your service requirements.',
    icon: <Paintbrush className="text-primary h-6 w-6" />,
    image:
      '/images/features/customize.png',
  },
  {
    step: 'Step 3',
    title: 'Attach form to your request type',
    content:
      'Seamlessly integrate your custom form with your Jira Service Management request types.',
    icon: <Code className="text-primary h-6 w-6" />,
    image:
      '/images/features/code.png',
  },
];

export default function FeatureSteps() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (4000 / 100));
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [progress]);

  return (
    <section className="w-full py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="relative mx-auto mb-16 max-w-3xl text-center">
          <div className="relative z-10">
            <h1 className="font-geist text-4xl font-medium tracking-tighter md:text-5xl lg:text-6xl xl:text-7xl">
              Build Forms in Three Steps
            </h1>
            <p className="font-geist text-foreground/60 mt-6 text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto">
              Create customer-facing forms for Jira Service Management with drag-and-drop simplicity
            </p>
          </div>
        </div>
        <div className="mx-auto mb-12 w-24 h-px bg-foreground/20"></div>

        <div className="flex flex-col items-center gap-12 lg:grid lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1 space-y-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-6 md:gap-8"
                initial={{ opacity: 0.5, x: -20 }}
                animate={{
                  opacity: index === currentFeature ? 1 : 0.5,
                  x: 0,
                  scale: index === currentFeature ? 1.02 : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border-2 md:h-14 md:w-14 font-semibold text-sm md:text-base flex-shrink-0',
                    index === currentFeature
                      ? 'border-primary bg-black text-white'
                      : 'border-foreground/20 bg-background text-foreground/70',
                  )}
                >
                  {index + 1}
                </motion.div>

                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-semibold md:text-2xl mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                    {feature.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div
            className={cn(
              'relative order-1 lg:order-2 w-full max-w-2xl mx-auto lg:max-w-none',
            )}
          >
            <div className="relative h-[320px] md:h-[400px] lg:h-[480px] overflow-hidden rounded-2xl border border-foreground/10 bg-dotted shadow-2xl">
              <AnimatePresence mode="wait">
                {features.map(
                  (feature, index) =>
                    index === currentFeature && (
                      <motion.div
                        key={index}
                        className="absolute inset-0 overflow-hidden rounded-2xl"
                        initial={{ y: 100, opacity: 0, rotateX: -15 }}
                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                        exit={{ y: -100, opacity: 0, rotateX: 15 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                      >
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                          width={1000}
                          height={500}
                        />
                      </motion.div>
                    ),
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
