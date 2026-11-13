// Envia as fotos da Pellegrino (pasta local, SKU_n.jpg) para o bucket do Cloudflare R2 do site.
// Mesma estrutura do bucket antigo: fotos/SKU_n.jpg.
// Arquivos que já estão no bucket com o mesmo tamanho são pulados: dá para parar e rodar de novo.
//
// Uso:
//   node --env-file=.env scripts/catalogo/enviar_fotos_r2.cjs testar
//   node --env-file=.env scripts/catalogo/enviar_fotos_r2.cjs enviar [pasta]
// Variáveis no .env (nunca no git): R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
// R2_BUCKET (autoparts) e, opcional, FOTOS_DIR (padrão C:/Users/USER/Desktop/shope/fotos).
const fs = require("fs");
const path = require("path");
const {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  HeadBucketCommand,
} = require("@aws-sdk/client-s3");

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
  console.error("Faltam R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY ou R2_BUCKET no .env");
  process.exit(1);
}
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});
const TIPOS = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
const PASTA = process.argv[3] || process.env.FOTOS_DIR || "C:/Users/USER/Desktop/shope/fotos";
const LOG = path.join(__dirname, "../../dados/envio_fotos_r2.log");

// Mapa chave -> tamanho do que já está no bucket
async function noBucket() {
  const mapa = new Map();
  let token;
  do {
    const r = await s3.send(
      new ListObjectsV2Command({ Bucket: R2_BUCKET, Prefix: "fotos/", ContinuationToken: token }),
    );
    for (const o of r.Contents || []) mapa.set(o.Key, o.Size);
    token = r.NextContinuationToken;
  } while (token);
  return mapa;
}

async function enviar() {
  const arquivos = fs.readdirSync(PASTA).filter((f) => TIPOS[path.extname(f).toLowerCase()]);
  const ja = await noBucket();
  const fila = arquivos.filter((f) => ja.get(`fotos/${f}`) !== fs.statSync(path.join(PASTA, f)).size);
  console.log(
    `${arquivos.length} fotos na pasta, ${arquivos.length - fila.length} já no bucket, ${fila.length} para enviar`,
  );
  fs.mkdirSync(path.dirname(LOG), { recursive: true });
  const log = fs.createWriteStream(LOG, { flags: "a" });
  const total = fila.length;
  let feitos = 0;
  let erros = 0;
  const inicio = Date.now();
  const trabalhador = async () => {
    while (fila.length) {
      const f = fila.shift();
      for (let tentativa = 1; tentativa <= 3; tentativa++) {
        try {
          await s3.send(
            new PutObjectCommand({
              Bucket: R2_BUCKET,
              Key: `fotos/${f}`,
              Body: fs.readFileSync(path.join(PASTA, f)),
              ContentType: TIPOS[path.extname(f).toLowerCase()],
              CacheControl: "public, max-age=31536000, immutable",
            }),
          );
          break;
        } catch (e) {
          if (tentativa === 3) {
            erros++;
            log.write(`ERRO ${f}: ${e.message}\n`);
          } else await new Promise((r) => setTimeout(r, 1000 * tentativa));
        }
      }
      if (++feitos % 1000 === 0 || feitos === total) {
        const seg = (Date.now() - inicio) / 1000;
        const msg = `${feitos}/${total} enviadas (${erros} erros) · ${(feitos / seg).toFixed(0)}/s`;
        console.log(msg);
        log.write(msg + "\n");
      }
    }
  };
  await Promise.all(Array.from({ length: 24 }, trabalhador));
  log.end();
  console.log(`Pronto: ${feitos - erros} enviadas, ${erros} erros (detalhes em dados/envio_fotos_r2.log).`);
}

(async () => {
  const cmd = process.argv[2];
  if (cmd === "testar") {
    await s3.send(new HeadBucketCommand({ Bucket: R2_BUCKET }));
    const teste = `fotos/_teste_${Date.now()}.txt`;
    await s3.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: teste, Body: "ok", ContentType: "text/plain" }));
    console.log(`Bucket ${R2_BUCKET}: acesso e gravação OK (${(await noBucket()).size} arquivos em fotos/)`);
    const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
    await s3.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: teste }));
  } else if (cmd === "enviar") {
    await enviar();
  } else {
    console.log("Uso: node --env-file=.env scripts/catalogo/enviar_fotos_r2.cjs testar | enviar [pasta]");
  }
})().catch((e) => {
  console.error(`${e.name}: ${e.message}`);
  process.exit(1);
});
