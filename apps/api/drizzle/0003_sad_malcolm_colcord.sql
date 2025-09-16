-- Step 1: Set the default value for the 'role' column
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;

-- Step 2: Create the 'roles' enum type
CREATE TYPE roles AS ENUM('ADMIN', 'CUSTOMER', 'SALES MANAGER');

-- Step 3: Update the 'role' column to use the 'roles' enum type
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE roles USING "role"::roles;

-- Step 5: Set the default value for 'role' column after the type has been updated
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';
