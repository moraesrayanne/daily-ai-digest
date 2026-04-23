-- Articles sent in past digests
CREATE TABLE IF NOT EXISTS articles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url         text NOT NULL UNIQUE,
  title       text NOT NULL,
  source      text NOT NULL,
  summary     text,
  score       numeric,
  published_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- One record per digest run
CREATE TABLE IF NOT EXISTS digests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date          date NOT NULL UNIQUE,
  sent_at       timestamptz NOT NULL DEFAULT now(),
  article_count int NOT NULL DEFAULT 0
);

-- Join table: which articles appeared in which digest
CREATE TABLE IF NOT EXISTS digest_articles (
  digest_id  uuid NOT NULL REFERENCES digests(id) ON DELETE CASCADE,
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  position   int NOT NULL,
  PRIMARY KEY (digest_id, article_id)
);

-- Enable RLS on all tables
ALTER TABLE articles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE digests        ENABLE ROW LEVEL SECURITY;
ALTER TABLE digest_articles ENABLE ROW LEVEL SECURITY;

-- Public read, no public write
CREATE POLICY "public read articles"        ON articles        FOR SELECT USING (true);
CREATE POLICY "public read digests"         ON digests         FOR SELECT USING (true);
CREATE POLICY "public read digest_articles" ON digest_articles FOR SELECT USING (true);
