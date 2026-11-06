import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Car,
  ChevronDown,
  LogOut,
  MessageCircle,
  ShoppingCart,
  User,
  Camera,
  X,
} from "lucide-react";
import { BarraCampanha, useCampanha } from "@/components/campanha/Campanha";
import { SearchAutocomplete } from "@/components/SearchAutocomplete";
import { IconeLista, IconeTodas } from "@/components/icones/IconesAuto";
import { SinoNotificacoes } from "@/components/SinoNotificacoes";
import { abrirFotoPieza } from "@/components/FotoPieza";
import { useCart } from "@/components/CartContext";
import {
  BuscaVeiculo,
  guardarMeuVeiculo,
  lerMeuVeiculo,
  rotuloVeiculo,
  type MeuVeiculo,
} from "@/components/BuscaVeiculo";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useCategoriasLoja } from "@/hooks/use-categorias-loja";
import { getSessionFn } from "@/lib/user-auth";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// Header do AUTO PIEZAS UY: uma barra branca e limpa (logo, busca, "Mi vehículo", conta e carrinho)
// e uma faixa fina de categorias que se recolhe ao rolar para baixo e volta ao rolar para cima.
// É `fixed` com um espaçador de altura constante: recolher a faixa não empurra a página.
// A altura atual fica em --altura-header (barra de filtros da loja e âncoras usam).
export function SiteHeader() {
  const { scrolled, hidden } = useScrollDirection();
  const categorias = useCategoriasLoja();
  const campanha = useCampanha();
  const black = campanha?.tema === "black";
  const navigate = useNavigate();
  // Categoria aberta na loja (traço laranja na faixa)
  const categoriaAtual = useRouterState({
    select: (s) =>
      s.location.pathname === "/loja"
        ? String((s.location.search as { categoria?: unknown }).categoria ?? "")
        : "",
  });

  // Altura do header na variável --altura-header e no espaçador
  const headerRef = useRef<HTMLElement>(null);
  const [alturaTopo, setAlturaTopo] = useState<number | null>(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let ultima = -1;
    let espera: ReturnType<typeof setTimeout> | undefined;
    const medir = () => {
      const h = el.offsetHeight;
      if (h !== ultima) {
        ultima = h;
        document.documentElement.style.setProperty("--altura-header", `${h}px`);
      }
      if (window.scrollY <= 8) setAlturaTopo((a) => (a === h ? a : h));
    };
    const ro = new ResizeObserver(() => {
      clearTimeout(espera);
      espera = setTimeout(medir, 260);
    });
    ro.observe(el);
    medir();
    return () => {
      ro.disconnect();
      clearTimeout(espera);
    };
  }, []);

  // Atalho "/" foca a busca
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      if (e.key !== "/" || /INPUT|TEXTAREA|SELECT/.test(alvo.tagName) || alvo.isContentEditable)
        return;
      const campo = document.querySelector<HTMLInputElement>("#busca-header input");
      if (campo) {
        e.preventDefault();
        campo.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Vehículo guardado por el cliente (BuscaVeiculo)
  const [veiculo, setVeiculo] = useState<MeuVeiculo | null>(null);
  const [abrirVeiculo, setAbrirVeiculo] = useState(false);
  useEffect(() => {
    const ler = () => setVeiculo(lerMeuVeiculo());
    ler();
    window.addEventListener("storage", ler);
    window.addEventListener("focus", ler);
    return () => {
      window.removeEventListener("storage", ler);
      window.removeEventListener("focus", ler);
    };
  }, [abrirVeiculo]);
  const nomeVeiculo = veiculo ? rotuloVeiculo(veiculo) : "";

  const { data: user } = useQuery({ queryKey: ["auth_session"], queryFn: () => getSessionFn() });
  const { items, setIsCartOpen } = useCart();
  const itens = items.reduce((s, i) => s + i.quantity, 0);

  const botaoIcone =
    "relative flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 transition hover:bg-zinc-100 hover:text-primary active:scale-95";

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full bg-white pt-safe transition-shadow duration-300",
          scrolled
            ? "shadow-[0_6px_24px_-12px_rgba(15,40,80,0.35)]"
            : "border-b border-zinc-200/80",
        )}
      >
        <BarraCampanha />

        {/* Barra principal */}
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center gap-2 px-3 transition-[height] duration-300 md:gap-4 md:px-4",
            scrolled ? "h-14 md:h-16" : "h-16 md:h-[76px]",
          )}
        >
          <Link
            to="/"
            aria-label="AUTO PIEZAS UY — inicio"
            className="flex shrink-0 items-center gap-2.5"
          >
            <img
              src="/logo.svg"
              alt=""
              width={44}
              height={44}
              className={cn(
                "transition-all duration-300",
                scrolled ? "h-9 w-9" : "h-10 w-10 md:h-11 md:w-11",
              )}
            />
            <span className="flex flex-col leading-none">
              <span className="text-[17px] font-extrabold tracking-tight text-primary md:text-lg">
                AUTO PIEZAS <span className="text-accent">UY</span>
              </span>
              <span
                className={cn(
                  "overflow-hidden text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-400 transition-all duration-300",
                  scrolled ? "mt-0 max-h-0 opacity-0" : "mt-1 max-h-4 opacity-100",
                )}
              >
                Repuestos para tu auto
              </span>
            </span>
          </Link>

          {/* Busca (computador) */}
          <div
            id="busca-header"
            className="relative mx-auto hidden min-w-0 max-w-2xl flex-1 md:block"
          >
            <SearchAutocomplete
              segment="AUTOMOTIVA"
              placeholder="Buscá por código, pieza o marca…"
              inputClassName="h-11 rounded-full border-0 bg-zinc-100 pl-11 text-[15px] text-zinc-900 shadow-none placeholder:text-zinc-400 transition focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/30"
            />
          </div>
          <div className="flex-1 md:hidden" />

          {/* Mi vehículo */}
          <Popover open={abrirVeiculo} onOpenChange={setAbrirVeiculo}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex h-10 shrink-0 items-center gap-2 rounded-full px-3 text-sm font-semibold transition active:scale-95",
                  nomeVeiculo
                    ? "bg-accent/10 text-accent ring-1 ring-accent/30 hover:bg-accent/15"
                    : "bg-primary text-white hover:bg-primary/90",
                )}
                aria-label={nomeVeiculo ? `Mi vehículo: ${nomeVeiculo}` : "Elegí tu vehículo"}
              >
                <Car className="h-[18px] w-[18px]" />
                <span className="hidden max-w-[150px] truncate lg:inline">
                  {nomeVeiculo || "Elegí tu vehículo"}
                </span>
                <ChevronDown className="hidden h-3.5 w-3.5 opacity-70 lg:block" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={10}
              className="w-[min(92vw,340px)] rounded-2xl p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-zinc-900">Tu vehículo</p>
                  <p className="text-xs text-zinc-500">
                    Te mostramos solo las piezas que le sirven.
                  </p>
                </div>
                {nomeVeiculo && (
                  <button
                    type="button"
                    onClick={() => {
                      guardarMeuVeiculo(null);
                      setVeiculo(null);
                    }}
                    className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-zinc-500 hover:bg-zinc-100"
                  >
                    <X className="h-3 w-3" /> Quitar
                  </button>
                )}
              </div>
              <BuscaVeiculo
                key={nomeVeiculo}
                variante="compacta"
                inicial={veiculo}
                aoBuscar={(v) => {
                  setAbrirVeiculo(false);
                  setVeiculo(v);
                  navigate({ to: "/loja", search: v as never });
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Ações */}
          <div className="flex shrink-0 items-center">
            <a
              href={whatsappContactUrl("¡Hola! Quiero consultar por repuestos.")}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="WhatsApp"
              className={cn(botaoIcone, "hidden text-[#1fae55] hover:text-[#1fae55] md:flex")}
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(botaoIcone, "hidden md:flex")}
                  aria-label="Mi cuenta"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {user.nome.charAt(0).toUpperCase()}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/cuenta">Mi cuenta</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/catalogos">Catálogos (PDF)</Link>
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/admin">Panel de administración</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={async () => {
                      await fetch("/api/auth/logout", { method: "POST" });
                      window.location.href = "/";
                    }}
                    className="cursor-pointer text-red-600 focus:text-red-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Salir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" aria-label="Ingresar" className={cn(botaoIcone, "hidden md:flex")}>
                <User className="h-5 w-5" />
              </Link>
            )}
            {user && <SinoNotificacoes />}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Carrito con ${itens} ítems`}
              className={botaoIcone}
            >
              <ShoppingCart className="h-[22px] w-[22px]" />
              {itens > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {itens}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Busca (celular) */}
        <div
          className={cn(
            "overflow-hidden px-3 transition-[max-height,padding] duration-300 md:hidden",
            hidden ? "max-h-0 pb-0" : "max-h-16 pb-2.5",
          )}
        >
          <SearchAutocomplete
            segment="AUTOMOTIVA"
            placeholder="Buscá por código o pieza…"
            inputClassName="h-10 rounded-full border-0 bg-zinc-100 pl-11 text-base text-zinc-900 shadow-none placeholder:text-zinc-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/30"
          />
        </div>

        {/* Faixa de categorias (some ao rolar para baixo, volta ao rolar para cima): fundo
            claro, ícones próprios de peças e um traço laranja embaixo da categoria aberta */}
        <nav
          aria-label="Categorías"
          className={cn(
            "overflow-hidden border-t transition-[max-height,opacity] duration-300",
            black ? "border-white/10 bg-zinc-950" : "border-slate-200/80 bg-slate-50",
            hidden ? "max-h-0 opacity-0" : "max-h-14 opacity-100",
          )}
        >
          <div
            className={cn(
              "scrollbar-none mx-auto flex h-12 max-w-7xl items-stretch gap-0.5 overflow-x-auto px-3 text-[13px] font-semibold md:px-4",
              black ? "text-white/80" : "text-slate-600",
            )}
          >
            <DropdownMenu>
              <DropdownMenuTrigger className="my-2 mr-2 flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-orange-500 pl-2.5 pr-3 font-bold text-white shadow-sm shadow-orange-500/30 outline-none transition hover:bg-orange-600">
                <IconeTodas className="h-[18px] w-[18px]" />
                <span className="hidden sm:inline">Todas las categorías</span>
                <span className="sm:hidden">Categorías</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-80" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="grid w-[min(94vw,600px)] grid-cols-2 gap-1 rounded-2xl p-2.5 sm:grid-cols-3"
              >
                {categorias.map((c) => (
                  <DropdownMenuItem
                    key={c.nome}
                    asChild
                    className="cursor-pointer flex-col items-start gap-1.5 rounded-xl p-3 focus:bg-orange-50"
                  >
                    <Link to="/loja" search={{ categoria: c.nome } as never}>
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0b1d3a] text-amber-400">
                        <c.icon className="h-5 w-5" />
                      </span>
                      <span className="text-[13px] font-bold leading-tight text-slate-800">
                        {c.rotulo}
                      </span>
                      {c.total > 0 && (
                        <span className="text-[11px] text-slate-400">
                          {c.total.toLocaleString("es-UY")} piezas
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {categorias.slice(0, 8).map((c, i) => {
              const ativa = categoriaAtual === c.nome;
              return (
                <Link
                  key={c.nome}
                  to="/loja"
                  search={{ categoria: c.nome } as never}
                  className={cn(
                    "group relative shrink-0 items-center gap-2 px-3 transition",
                    // Celular: todas (a faixa rola); computador: 6 até 1536px, 8 acima
                    i < 6 ? "flex" : "flex md:hidden 2xl:flex",
                    ativa
                      ? black
                        ? "text-white"
                        : "text-[#0b1d3a]"
                      : black
                        ? "hover:text-white"
                        : "hover:text-[#0b1d3a]",
                  )}
                >
                  <c.icon
                    className={cn(
                      "h-[18px] w-[18px] transition",
                      ativa ? "text-orange-500" : "text-slate-400 group-hover:text-orange-500",
                    )}
                  />
                  {c.curto}
                  <span
                    className={cn(
                      "absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-orange-500 transition-transform",
                      ativa ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
            <div className="min-w-4 flex-1" />
            <button
              type="button"
              onClick={abrirFotoPieza}
              className="hidden shrink-0 items-center gap-1.5 px-3 transition hover:text-[#0b1d3a] 2xl:flex"
            >
              <Camera className="h-4 w-4 text-slate-400" /> ¿Sin código?
            </button>
            <Link
              to="/pedido-rapido"
              className="my-2 hidden shrink-0 items-center gap-1.5 rounded-xl px-3 ring-1 ring-slate-300 transition hover:bg-white hover:text-[#0b1d3a] hover:ring-[#0b1d3a] lg:flex"
            >
              <IconeLista className="h-4 w-4" /> Pedido rápido
            </Link>
            <Link
              to="/cotizar"
              className="my-2 ml-1.5 flex shrink-0 items-center gap-1.5 rounded-xl bg-[#0b1d3a] px-3.5 font-bold text-white transition hover:bg-[#13294f]"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" /> Cotizar
            </Link>
          </div>
        </nav>
      </header>
      {/* Ocupa o lugar do header no fluxo da página, sempre com a mesma altura */}
      <div
        aria-hidden
        className={alturaTopo ? undefined : "h-[162px] md:h-[121px]"}
        style={alturaTopo ? { height: alturaTopo } : undefined}
      />
    </>
  );
}
