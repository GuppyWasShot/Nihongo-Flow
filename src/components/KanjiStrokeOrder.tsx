'use client';

import { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface KanjiStrokeOrderProps {
    character: string;
    size?: number;
}

/**
 * Animated kanji stroke order component using hanzi-writer
 * Shows stroke order animation with play/pause and replay controls
 */
export function KanjiStrokeOrder({ character, size = 200 }: KanjiStrokeOrderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const writerRef = useRef<HanziWriter | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous content
        containerRef.current.innerHTML = '';
        setIsLoaded(false);
        setError(null);

        try {
            writerRef.current = HanziWriter.create(containerRef.current, character, {
                width: size,
                height: size,
                padding: 5,
                showOutline: true,
                strokeAnimationSpeed: 1,
                delayBetweenStrokes: 300,
                strokeColor: '#059669', // emerald-600
                outlineColor: '#e2e8f0', // slate-200
                drawingColor: '#f87171', // red-400
                radicalColor: '#10b981', // emerald-500
                showCharacter: true,
                charDataLoader: (char: string, onComplete: (data: any) => void) => {
                    fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${char}.json`)
                        .then(res => {
                            if (!res.ok) throw new Error('Character not found');
                            return res.json();
                        })
                        .then(data => {
                            setIsLoaded(true);
                            onComplete(data);
                        })
                        .catch(() => {
                            setError('Stroke data not available for this character');
                        });
                },
            });
        } catch (e) {
            setError('Failed to initialize stroke animation');
        }

        return () => {
            writerRef.current = null;
        };
    }, [character, size]);

    const handleAnimate = () => {
        if (!writerRef.current || !isLoaded) return;

        setIsAnimating(true);
        writerRef.current.animateCharacter({
            onComplete: () => setIsAnimating(false),
        });
    };

    const handlePause = () => {
        if (!writerRef.current) return;
        writerRef.current.pauseAnimation();
        setIsAnimating(false);
    };

    const handleReset = () => {
        if (!writerRef.current) return;
        writerRef.current.hideCharacter();
        writerRef.current.showCharacter();
        setIsAnimating(false);
    };

    if (error) {
        return (
            <div className="text-center p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <div
                ref={containerRef}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 mb-4"
                style={{ width: size, height: size }}
            />

            {isLoaded && (
                <div className="flex items-center gap-2">
                    {!isAnimating ? (
                        <button
                            onClick={handleAnimate}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors text-sm"
                        >
                            <Play className="w-4 h-4" />
                            Animate
                        </button>
                    ) : (
                        <button
                            onClick={handlePause}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors text-sm"
                        >
                            <Pause className="w-4 h-4" />
                            Pause
                        </button>
                    )}
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors text-sm"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                </div>
            )}

            {!isLoaded && !error && (
                <div className="animate-pulse flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    Loading stroke data...
                </div>
            )}
        </div>
    );
}
