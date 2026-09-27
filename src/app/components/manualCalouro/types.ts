export interface StepItemData {
  number: number;
  title: string;
  description: string;
}

export interface OptionCardProps {
  icon: string;
  title: string;
  subtitle: string;
  href: string;
  isExternal?: boolean;
  isHighlight?: boolean;
}