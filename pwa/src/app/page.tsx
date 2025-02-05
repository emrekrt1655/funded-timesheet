import fs from 'fs';
import path from 'path';
import { FC } from 'react';
import Markdown from 'react-markdown';

const markdown = fs.readFileSync(
  path.join(process.cwd(), '/../README.md'),
  'utf8',
);

const Page: FC = () => {
  return <Markdown className="prose prose-sm">{markdown}</Markdown>;
};

export default Page;
