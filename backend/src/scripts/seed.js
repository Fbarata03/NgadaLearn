/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Seed: criar/garantir utilizador admin na Neon
   Chamado automaticamente ao arrancar o servidor em produção
   Pode também ser executado manualmente: node src/scripts/seed.js
   ════════════════════════════════════════════════════════════════════ */

require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const {
  initDB,
  findUserByEmail,
  createUser,
  updateUser,
  pool,
} = require("../utils/dataStore");

async function seed() {
  /* Garantir que a tabela existe */
  await initDB();

  const email    = process.env.ADMIN_EMAIL    || "Fbarata03@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "marias66s3";
  const name     = "Administrador NgadaLearn";

  console.log("🌱 A verificar utilizador admin na Neon…");

  const existing = await findUserByEmail(email);
  const hash     = await bcrypt.hash(password, 12);

  if (existing) {
    await updateUser(existing.id, {
      passwordHash:    hash,
      role:            "admin",
      plan:            "lifetime",
      accessExpiresAt: null,
    });
    console.log(`✅ Admin actualizado: ${email}`);
  } else {
    await createUser({
      id:              uuidv4(),
      name,
      email:           email.toLowerCase(),
      passwordHash:    hash,
      role:            "admin",
      plan:            "lifetime",
      accessExpiresAt: null,
      createdAt:       new Date().toISOString(),
      updatedAt:       new Date().toISOString(),
    });
    console.log(`✅ Admin criado: ${email}`);
  }

  console.log("🎉 Seed Neon concluído!");
}

/* Quando executado directamente (node seed.js) fecha o pool no fim */
if (require.main === module) {
  seed()
    .catch((err) => { console.error("Erro no seed:", err); process.exit(1); })
    .finally(() => pool.end());
}

module.exports = { seed };
