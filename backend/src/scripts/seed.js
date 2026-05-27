/* ════════════════════════════════════════════════════════════════════
   NgadaLearn — Seed inicial: cria o utilizador admin
   Executar com: npm run seed
   ════════════════════════════════════════════════════════════════════ */

require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const {
  ensureDataDir,
  findUserByEmail,
  createUser,
  updateUser,
} = require("../utils/dataStore");

async function seed() {
  ensureDataDir();

  const email    = process.env.ADMIN_EMAIL    || "Fbarata03@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "marias66s3";
  const name     = "Administrador NgadaLearn";

  console.log("🌱 A inicializar base de dados...");

  const existing = findUserByEmail(email);

  if (existing) {
    // Actualizar password e garantir role admin
    const hash = await bcrypt.hash(password, 12);
    updateUser(existing.id, {
      passwordHash:    hash,
      role:            "admin",
      accessExpiresAt: null, // admin não precisa de acesso por tempo
    });
    console.log(`✅ Admin actualizado: ${email}`);
  } else {
    const hash = await bcrypt.hash(password, 12);
    createUser({
      id:              uuidv4(),
      name,
      email:           email.toLowerCase(),
      passwordHash:    hash,
      role:            "admin",
      accessExpiresAt: null,
      createdAt:       new Date().toISOString(),
      updatedAt:       new Date().toISOString(),
    });
    console.log(`✅ Admin criado: ${email}`);
  }

  console.log("🎉 Seed concluído!");
}

seed().catch((err) => {
  console.error("Erro no seed:", err);
  process.exit(1);
});
