import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFileName = (name: string) => {
  const splittedName = name.split('.');
  const fileType = splittedName.pop()

  return `${splittedName.join('.')}-${Date.now()}.${fileType}`
}
