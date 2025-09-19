ALTER TABLE `blog_article_translations`
  ADD COLUMN `quick_facts` JSON NULL,
  ADD COLUMN `highlights` JSON NULL,
  ADD COLUMN `tags` JSON NULL;
