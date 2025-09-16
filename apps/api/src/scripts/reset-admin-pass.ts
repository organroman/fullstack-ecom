import bcrypt from "bcryptjs"; 

async function main() {
  const email = "jhonDoe1@gmail.com";
  const plain = "admin123";

  const hash = await bcrypt.hash(plain, 10);
  console.log("🚀 ~ hash:", hash);

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
