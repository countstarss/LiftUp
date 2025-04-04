"use client";
// AppProviders.tsx
import React, { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { ConvexProvider } from 'convex/react';
import { ConvexClient } from 'convex/browser';
import { ConvexClientProvider } from './ConvexProvider';
// 添加其他的 Context Provider
interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  const [queryClient] = useState(() => new QueryClient());
  const [convex] = useState(() => new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!));

  return (
    <ConvexClientProvider>
      <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryClientProvider>
    </ConvexClientProvider>
  );
}