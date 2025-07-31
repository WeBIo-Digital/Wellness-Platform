"use client";

import { useState, useEffect, useCallback } from 'react';

export function useSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const storedState = localStorage.getItem('sidebar-expanded');
    // Default to true (expanded) if nothing is stored
    if (storedState !== null) {
      setIsExpanded(JSON.parse(storedState));
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsExpanded(prevState => {
      const newState = !prevState;
      localStorage.setItem('sidebar-expanded', JSON.stringify(newState));
      return newState;
    });
  }, []);

  return [isExpanded, toggleSidebar] as const;
}