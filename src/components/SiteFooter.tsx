import { Link } from "@tanstack/react-router";
import {
  Mail,
  Instagram,
  Facebook,
  Lock,
  Truck,
  MessageCircle,
  ChevronDown,
  Car,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { whatsappContactUrl, PHONE_DISPLAY } from "@/lib/whatsapp";
import { INSTAGRAM_URL, INSTAGRAM_USUARIO, FACEBOOK_URL } from "@/lib/navegacao";
import { BandeiraUruguay } from "@/components/Bandeiras";
import { MARCAS_SEO, CATEGORIAS_SEO } from "@/lib/seo-paginas";
import { locaisDoIdioma, nomeLocal } from "@/lib/locais-seo";
import { GUIAS } from "@/lib/guias";
import { nomeModeloSeo, urlVeiculo, VEICULOS_UY } from "@/lib/veiculos-seo";
import { useT } from "@/lib/idioma";
import { SeletorIdioma } from "@/components/SeletorIdioma";
import { CartaoApp } from "@/components/AppInstalavel";

const AYUDA = [
  { label: ["Cómo comprar", "Como comprar"], hash: "como-comprar" },
  { label: ["Envíos a Uruguay", "Envios"], hash: "envios" },
  { label: ["Formas de pago", "Formas de pagamento"], hash: "pagos" },
  { label: ["Garantía y devoluciones", "Garantia e trocas"], hash: "garantia" },
  { label: ["Preguntas frecuentes", "Perguntas frequentes"], hash: "preguntas" },
] as const;

const tituloCls = "mb-4 text-xs font-black uppercase tracking-[0.18em] text-amber-400";
const linkCls = "text-slate-300 transition-colors hover:text-white";

// Grupo de links para o Google (marcas, veículos, categorias, departamentos). Fica dentro de um
// <details>: o HTML sempre traz os links (o Google lê), e a pessoa abre só o que quer ver.
function GrupoLinks({
  titulo,
  todos,
  children,
}: {
  titulo: string;
  todos?: { href: string; texto: string };
  children: React.ReactNode;
}) {
  return (
    <details className="group border-b border-white/10 py-1 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-bold text-white">
        {titulo}
        <ChevronDown className="h-4 w-4 text-slate-400 transition group-open:rotate-180" />
      </summary>
      <div className="flex flex-wrap gap-2 pb-4">
        {children}
        {todos && (
          <a
            href={todos.href}
            className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-[#0b1d3a] hover:bg-amber-300"
          >
            {todos.texto} <ArrowRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </details>
  );
}

const chipCls =
  "rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white";

export function SiteFooter() {
  const { t, idioma, href } = useT();
  const zap = whatsappContactUrl(
    t("¡Hola! Quiero consultar por repuestos.", "Olá! Quero consultar sobre peças."),
  );
  return (
    <footer className="mt-auto bg-[#0b1d3a] text-sm">
      {/* Chamada do WhatsApp */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-white">
            <p className="text-xl font-black leading-tight sm:text-2xl">
              {t("¿No encontrás tu repuesto?", "Não achou sua peça?")}
            </p>
            <p className="mt-1 text-white/90">
              {t(
                "Mandanos el código, la foto o tu vehículo y te respondemos con precio.",
                "Mande o código, a foto ou seu veículo e respondemos com o preço.",
              )}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <a
              data-livre="1"
              href={zap}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0b1d3a] px-5 py-3 font-bold text-white shadow-lg transition hover:bg-[#13294f]"
            >
              <MessageCircle className="h-5 w-5 text-emerald-400" />
              WhatsApp {PHONE_DISPLAY}
            </a>
            <Link
              to="/cotizar"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-[#0b1d3a] transition hover:bg-orange-50"
            >
              {t("Pedir cotización", "Pedir orçamento")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Colunas */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <img
              decoding="async"
              loading="lazy"
              src="/logo.svg"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <span className="leading-none">
              <span className="block text-xl font-black tracking-tight text-white">
                AUTO PIEZAS UY
              </span>
              <span className="mt-1 block text-[11px] font-bold tracking-[0.22em] text-amber-400">
                {t("REPUESTOS PARA AUTOS", "AUTOPEÇAS")}
              </span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm leading-relaxed text-slate-400">
            {t(
              "Más de 100.000 repuestos para autos, camionetas y camiones. Buscá por tu vehículo o por código y recibilo en todo Uruguay.",
              "Mais de 100.000 peças para carros, caminhonetes e caminhões, com envio para todo o Uruguai.",
            )}
          </p>
          <Link
            to="/vehiculos"
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 font-bold text-white ring-1 ring-white/10 transition hover:bg-white/10"
          >
            <Car className="h-5 w-5 text-amber-400" />
            {t("Buscar por mi vehículo", "Buscar pelo meu veículo")}
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </Link>
          <CartaoApp />
        </div>

        <div>
          <h3 className={tituloCls}>{t("Tienda", "Loja")}</h3>
          <ul className="space-y-2.5">
            <li>
              <Link to="/loja" className={linkCls}>
                {t("Todos los repuestos", "Todas as peças")}
              </Link>
            </li>
            <li>
              <a href="/vehiculos" className={linkCls}>
                {t("Repuestos por vehículo", "Peças por veículo")}
              </a>
            </li>
            <li>
              <a href={href("/repuestos")} className={linkCls}>
                {t("Marcas de repuestos", "Marcas de peças")}
              </a>
            </li>
            <li>
              <Link to="/pedido-rapido" className={linkCls}>
                {t("Pedido rápido por códigos", "Pedido rápido por códigos")}
              </Link>
            </li>
            <li>
              <Link to="/catalogos" className={linkCls}>
                {t("Catálogos para mecánicos", "Catálogos para mecânicos")}
              </Link>
            </li>
            <li>
              <a href={href("/guias")} className={linkCls}>
                {t("Guías y consejos", "Guias e dicas")}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={tituloCls}>{t("Ayuda", "Ajuda")}</h3>
          <ul className="space-y-2.5">
            {AYUDA.map((a) => (
              <li key={a.hash}>
                <Link to="/ayuda" hash={a.hash} className={linkCls}>
                  {t(a.label[0], a.label[1])}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/cuenta" className={linkCls}>
                {t("Mi cuenta", "Minha conta")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={tituloCls}>{t("Contacto", "Contato")}</h3>
          <ul className="space-y-3">
            <li>
              <a
                data-livre="1"
                href={zap}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 p-3 ring-1 ring-emerald-400/20 transition hover:bg-emerald-500/20"
              >
                <MessageCircle className="h-5 w-5 shrink-0 text-emerald-400" />
                <span className="leading-tight">
                  <span className="block text-xs text-slate-400">WhatsApp</span>
                  <span className="font-bold text-white">{PHONE_DISPLAY}</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href="mailto:contacto@autopiezasuy.com"
                className="flex items-center gap-2 break-all text-slate-300 hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-amber-400" /> contacto@autopiezasuy.com
              </a>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <BandeiraUruguay className="h-3.5 w-5 shrink-0 rounded-[2px]" />
              {t("Envíos a todo Uruguay", "Envio para todo o Uruguai")}
            </li>
          </ul>
          {(INSTAGRAM_URL || FACEBOOK_URL) && (
            <div className="mt-5 flex gap-2">
              {INSTAGRAM_URL && (
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Instagram ${INSTAGRAM_USUARIO}`}
                  className="rounded-xl bg-white/5 p-2.5 text-white ring-1 ring-white/10 hover:bg-white/10"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {FACEBOOK_URL && (
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="rounded-xl bg-white/5 p-2.5 text-white ring-1 ring-white/10 hover:bg-white/10"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Links para o Google: marcas, veículos, categorias, departamentos e guias */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="border-t border-white/10">
          <GrupoLinks
            titulo={t("Repuestos por vehículo", "Peças por veículo")}
            todos={{ href: "/vehiculos", texto: t("Ver todos", "Ver todos") }}
          >
            {VEICULOS_UY.slice(0, 10).flatMap((v) =>
              v.modelos.slice(0, 2).map((m) => (
                <a key={v.valor + m} href={urlVeiculo(v, m)} className={chipCls}>
                  {v.nome} {nomeModeloSeo(m)}
                </a>
              )),
            )}
          </GrupoLinks>
          <GrupoLinks
            titulo={t("Repuestos por marca", "Peças por marca")}
            todos={{ href: href("/repuestos"), texto: t("Ver todas", "Ver todas") }}
          >
            {MARCAS_SEO.map((m) => (
              <a key={m.slug} href={href(`/repuestos/${m.slug}`)} className={chipCls}>
                {m.marca}
              </a>
            ))}
          </GrupoLinks>
          <GrupoLinks titulo={t("Repuestos por categoría", "Peças por categoria")}>
            {CATEGORIAS_SEO.map((c) => (
              <a key={c.slug} href={href(`/repuestos/${c.slug}`)} className={chipCls}>
                {idioma === "pt" ? c.categoria : c.nome}
              </a>
            ))}
          </GrupoLinks>
          <GrupoLinks
            titulo={t("Envíos por departamento", "Envios por departamento")}
            todos={{ href: href("/repuestos-autos"), texto: t("Ver todos", "Ver todos") }}
          >
            {locaisDoIdioma(idioma)
              .filter((l) => l.tipo === "departamento")
              .map((l) => (
                <a key={l.slug} href={href(`/repuestos-autos/${l.slug}`)} className={chipCls}>
                  {nomeLocal(l, idioma)}
                </a>
              ))}
          </GrupoLinks>
          <GrupoLinks
            titulo={t("Guías técnicas", "Guias técnicos")}
            todos={{ href: href("/guias"), texto: t("Ver todas", "Ver todas") }}
          >
            {GUIAS.map((g) => (
              <a key={g.slug} href={href(`/guias/${g.slug}`)} className={chipCls}>
                {g.titulo[idioma]}
              </a>
            ))}
          </GrupoLinks>
        </div>
      </div>

      {/* Rodapé final */}
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-xs text-slate-500 md:flex-row md:justify-between">
        <p>
          &copy; {new Date().getFullYear()} AUTO PIEZAS UY ·{" "}
          {t("Repuestos para autos en Uruguay", "Peças para carros no Uruguai")}
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <li className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-emerald-400" /> {t("Sitio seguro", "Site seguro")}
          </li>
          <li className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />{" "}
            {t("Pago protegido", "Pagamento protegido")}
          </li>
          <li className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-emerald-400" />{" "}
            {t("Envíos a todo el país", "Envio para todo o país")}
          </li>
        </ul>
        <SeletorIdioma variante="escura" />
      </div>
    </footer>
  );
}
