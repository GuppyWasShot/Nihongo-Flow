'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ListAnimationProps {
    children: ReactNode[];
    className?: string;
    staggerDelay?: number;
}

/**
 * Animated list container that staggers children entrance
 */
export function ListAnimation({
    children,
    className = '',
    staggerDelay = 0.05
}: ListAnimationProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: 'easeOut' as const,
            },
        },
    };

    return (
        <motion.div
            className={className}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {children.map((child, index) => (
                <motion.div key={index} variants={itemVariants}>
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
}

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

/**
 * Simple fade-in animation wrapper
 */
export function FadeIn({ children, delay = 0, className = '' }: FadeInProps) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.3,
                delay,
                ease: 'easeOut',
            }}
        >
            {children}
        </motion.div>
    );
}

interface ScaleOnHoverProps {
    children: ReactNode;
    scale?: number;
    className?: string;
}

/**
 * Scale animation on hover for interactive elements
 */
export function ScaleOnHover({
    children,
    scale = 1.02,
    className = ''
}: ScaleOnHoverProps) {
    return (
        <motion.div
            className={className}
            whileHover={{ scale }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
        >
            {children}
        </motion.div>
    );
}

interface CountUpProps {
    value: number;
    duration?: number;
    className?: string;
}

/**
 * Animated count-up number
 */
export function CountUp({ value, duration = 1, className = '' }: CountUpProps) {
    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                {value}
            </motion.span>
        </motion.span>
    );
}
