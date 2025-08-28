import '@/styles/globals.css';

import { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import ReactQueryProvider from '@/lib/ReactQueryProvider';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: 'FUNDED',
};

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html className="h-full bg-white" lang="en">
      <body className="h-full">
        <ReactQueryProvider>
          <main className="mx-auto mt-8 max-w-7xl">{children}</main>
        </ReactQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
