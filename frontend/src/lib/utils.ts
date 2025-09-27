import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper function to merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}