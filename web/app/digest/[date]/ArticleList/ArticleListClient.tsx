'use client';

import { useState } from 'react';
import { ArticleRow } from '@/components/ArticleRow';
import { ArticleDetail } from '@/types/digest';

export function ArticleListClient({ articles }: { articles: ArticleDetail[] }) {
  const [expandedPos, setExpandedPos] = useState<number | null>(null);

  return (
    <div style={{ marginTop: 4 }}>
      {articles.map((article, i) => (
        <ArticleRow
          key={article.pos}
          article={article}
          index={i}
          expanded={expandedPos === article.pos}
          onToggle={() => setExpandedPos(expandedPos === article.pos ? null : article.pos)}
        />
      ))}
    </div>
  );
}
