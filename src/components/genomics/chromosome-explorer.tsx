"use client";

import React from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const chromosomes = Array.from({ length: 23 }, (_, i) => i + 1);

export const ChromosomeExplorer = () => {
  const handleChromosomeClick = (chrNumber: number) => {
    toast.info(`You clicked on chromosome ${chrNumber}.`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chromosome Explorer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12 gap-2">
          {chromosomes.map((chr) => (
            <button
              key={chr}
              onClick={() => handleChromosomeClick(chr)}
              className="flex h-16 items-center justify-center rounded-md border bg-muted/50 text-sm font-semibold transition-all hover:bg-primary/10 hover:scale-105 active:scale-95"
            >
              {chr}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
