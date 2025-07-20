// components/ui/background-gradient.jsx
"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  as: Component = "div",
}) => {
  return (
    <Component
      className={cn(
        "relative p-[1px] bg-white rounded-lg overflow-hidden",
        containerClassName
      )}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-green-100 via-myColorA to-green-100 bg-[length:400%_400%] animate-gradient-xy"
        aria-hidden="true"
      />
      <div className={cn("relative bg-white rounded-lg", className)}>
        {children}
      </div>
    </Component>
  );
};