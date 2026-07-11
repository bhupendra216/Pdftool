import * as LucideIcons from "lucide-react";
import React from "react";

export type IconName = keyof typeof LucideIcons;

interface IconProps extends React.ComponentProps<"svg"> {
  name: string;
}

export function Icon({ name, ...props }: IconProps) {
  // Convert generic names to title case to match lucide-react exports
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  const LucideIcon = (LucideIcons as any)[formattedName];
  
  if (!LucideIcon) {
    return <LucideIcons.HelpCircle {...props} />;
  }

  return <LucideIcon {...props} />;
}
