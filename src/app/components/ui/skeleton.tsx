import { cn } from "./utils";

function Skeleton({ className, variant = "light", ...props }: React.ComponentProps<"div"> & { variant?: "light" | "dark" }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-md",
        variant === "light" ? "skeleton-shimmer" : "skeleton-shimmer-dark",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
