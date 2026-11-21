-- Fichiers du service d'upload : les URL absolues (http://upload-service:8000/…,
-- http://localhost:8000/…, domaine de prod…) deviennent des chemins relatifs
-- servis par l'application (/api/upload/<type>/<nom>), valables quelle que soit
-- l'adresse utilisée pour ouvrir l'application.
-- Les images externes (ex. avatars Google) ne sont pas touchées.

UPDATE "User"
SET "image" = regexp_replace("image", '^https?://[^/]+/avatar/([0-9a-fA-F-]{36}\.[A-Za-z0-9]{2,5})$', '/api/upload/avatar/\1')
WHERE "image" ~ '^https?://[^/]+/avatar/[0-9a-fA-F-]{36}\.[A-Za-z0-9]{2,5}$';

UPDATE "Student"
SET "image" = regexp_replace("image", '^https?://[^/]+/avatar/([0-9a-fA-F-]{36}\.[A-Za-z0-9]{2,5})$', '/api/upload/avatar/\1')
WHERE "image" ~ '^https?://[^/]+/avatar/[0-9a-fA-F-]{36}\.[A-Za-z0-9]{2,5}$';

UPDATE "Lesson"
SET "imageBanner" = regexp_replace("imageBanner", '^https?://[^/]+/lesson/([0-9a-fA-F-]{36}\.[A-Za-z0-9]{2,5})$', '/api/upload/lesson/\1')
WHERE "imageBanner" ~ '^https?://[^/]+/lesson/[0-9a-fA-F-]{36}\.[A-Za-z0-9]{2,5}$';

-- Images insérées dans le contenu des leçons
UPDATE "Lesson"
SET "content" = regexp_replace("content"::text, 'https?://[^/"\s]+/lesson/([0-9a-fA-F-]{36}\.[A-Za-z0-9]{2,5})', '/api/upload/lesson/\1', 'g')::jsonb
WHERE "content"::text ~ 'https?://[^/"\s]+/lesson/[0-9a-fA-F-]{36}\.[A-Za-z0-9]{2,5}';
