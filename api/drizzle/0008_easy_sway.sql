ALTER TABLE "categories" ALTER COLUMN "status" DROP DEFAULT;

CREATE TYPE categoriesStatus AS ENUM ('ACTIVE', 'ARCHIVED');

ALTER TABLE "categories" ALTER COLUMN "status" SET DATA TYPE categoriesStatus USING "status"::categoriesStatus;

ALTER TABLE "categories" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
