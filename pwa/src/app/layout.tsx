import '@/styles/globals.css';

import { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import ReactQueryProvider from '@/lib/ReactQueryProvider';
import Script from 'next/script';

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
        <Script id="sanitize-ext-attrs" strategy="beforeInteractive">{`
          (function () {
            var html = document.documentElement;
            var body = document.body;
            function isBad(name) {
              return /^(__processed_|bis_)/.test(name) || name === 'bis_register';
            }
            function clean(node) {
              if (!node || !node.attributes) return;
              var attrs = Array.prototype.slice.call(node.attributes);
              for (var i = 0; i < attrs.length; i++) {
                var a = attrs[i];
                if (isBad(a.name)) node.removeAttribute(a.name);
              }
            }
            clean(html); clean(body);
            var mo = new MutationObserver(function () {
              clean(html); clean(body);
            });
            mo.observe(document.documentElement, { attributes: true, subtree: false });
          })();
        `}</Script>

        <ReactQueryProvider>
          <main className="mx-auto mt-8 max-w-7xl">{children}</main>
        </ReactQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
