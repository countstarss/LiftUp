"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
// @ts-expect-error 没有用到ThemeProviderProps，但是必须添加
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
