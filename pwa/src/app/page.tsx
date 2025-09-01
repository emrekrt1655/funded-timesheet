import fs from 'fs';
import Link from 'next/link';
import path from 'path';
import { FC } from 'react';
import Markdown from 'react-markdown';

const markdown = fs.readFileSync(
  path.join(process.cwd(), '/../README.md'),
  'utf8',
);

const Page: FC = () => {
  return (
    <div className="prose prose-sm">
      <div className="mt-6">
        <Link
          href="/timesheets"
          className="font-medium text-blue-600 hover:underline"
        >
          👉 Please click to go to timesheets page
        </Link>
      </div>
      <hr />
      <hr />
      <Markdown>{markdown}</Markdown>
    </div>
  );
};

export default Page;
