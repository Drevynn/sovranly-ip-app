import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";
    
    const variants = {
      default: "bg-cyan-500 text-black hover:bg-cyan-400 font-bold shadow-md shadow-cyan-950/40",
      destructive: "bg-red-600 text-white hover:bg-red-500",
      outline: "border border-zinc-800 bg-zinc-950 text-zinc-200 hover:bg-zinc-900 hover:text-white",
      secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
      ghost: "hover:bg-zinc-800 hover:text-zinc-100",
      link: "text-cyan-400 underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-10 px-5 py-2",
      sm: "h-8 px-3 text-xs",
      lg: "h-12 px-8 text-base",
      icon: "h-9 w-9",
    };

    const classes = cn(baseStyles, variants[variant], sizes[size], className);

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn(classes, (children.props as { className?: string }).className),
      });
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
