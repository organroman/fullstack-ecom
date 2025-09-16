ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT;

CREATE TYPE orderStatus AS ENUM('NEW', 'PROCESSING', 'CANCELLED', 'SHIPPED', 'SENT');--> statement-breakpoint

ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE orderStatus USING "status"::orderStatus;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'NEW';--> statement-breakpoint

