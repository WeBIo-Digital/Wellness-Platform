"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TraitCardProps {
  trait: {
    name: string;
    result: string;
    description: string;
    icon: React.ElementType;
    color: string;
  };
}

export const TraitCard: React.FC<TraitCardProps> = ({ trait }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = trait.icon;

  return (
    <div className="perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="relative h-48 w-full transform-style-preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden">
          <Card className="flex h-full flex-col items-center justify-center text-center p-4">
            <Icon className={cn('h-12 w-12 mb-2', trait.color)} />
            <CardTitle className="text-md">{trait.name}</CardTitle>
          </Card>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)]">
          <Card className="flex h-full flex-col p-4">
            <CardHeader className="p-2">
              <CardTitle className="text-md">{trait.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-2 text-sm">
              <p className="font-semibold text-primary mb-2">{trait.result}</p>
              <p className="text-muted-foreground">{trait.description}</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};
