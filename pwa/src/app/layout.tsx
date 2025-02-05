import '@/styles/globals.css';

import { Metadata } from 'next';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: 'FUNDED',
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html className="h-full bg-white" lang="en">
      <body className="h-full">
        <main className="mx-auto mt-8 max-w-7xl">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
