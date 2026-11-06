import {
  Cog,
  Fuel,
  Settings,
  Disc3,
  Zap,
  CircleDot,
  Car,
  Bike,
  Sparkles,
  Thermometer,
  Navigation,
  Layers,
  Droplets,
  Wind,
  Package,
  Wrench,
  ShieldCheck,
  Hammer,
  type LucideIcon,
} from "lucide-react";

// Categorias principais (nomes iguais ao banco, para o filtro da loja funcionar), na ordem da home.
export const CATEGORIAS: Array<{ nome: string; curto: string; icon: LucideIcon }> = [
  { nome: "Motor", curto: "Motor", icon: Cog },
  { nome: "Frenos", curto: "Frenos", icon: Disc3 },
  { nome: "Suspensión", curto: "Suspensión", icon: Car },
  { nome: "Inyección y Combustible", curto: "Inyección", icon: Fuel },
  { nome: "Transmisión", curto: "Transmisión", icon: Settings },
  { nome: "Eléctrica", curto: "Eléctrica", icon: Zap },
  { nome: "Embrague", curto: "Embrague", icon: Layers },
  { nome: "Dirección", curto: "Dirección", icon: Navigation },
  { nome: "Refrigeración", curto: "Refrigeración", icon: Thermometer },
  { nome: "Rodamientos", curto: "Rodamientos", icon: CircleDot },
  { nome: "Gomas y Soportes", curto: "Gomas", icon: Package },
  { nome: "Accesorios", curto: "Accesorios", icon: Sparkles },
  { nome: "Motos", curto: "Motos", icon: Bike },
  { nome: "Lubricación", curto: "Lubricación", icon: Droplets },
  { nome: "Escape", curto: "Escape", icon: Wind },
  { nome: "Seguridad", curto: "Seguridad", icon: ShieldCheck },
  { nome: "Herramientas", curto: "Herramientas", icon: Hammer },
  { nome: "Varios", curto: "Varios", icon: Wrench },
];

export function iconeCategoria(nome: string): LucideIcon {
  const principal = nome.split(" > ")[0];
  return CATEGORIAS.find((c) => c.nome === principal)?.icon ?? Package;
}

// Marcas de vehículos más buscadas en Uruguay (valor = campo `montadora` de pecas_aplicacao)
export const MARCAS_VEICULO: Array<{ valor: string; nome: string }> = [
  { valor: "VOLKSWAGEN", nome: "Volkswagen" },
  { valor: "CHEVROLET", nome: "Chevrolet" },
  { valor: "FIAT", nome: "Fiat" },
  { valor: "FORD", nome: "Ford" },
  { valor: "RENAULT", nome: "Renault" },
  { valor: "PEUGEOT", nome: "Peugeot" },
  { valor: "TOYOTA", nome: "Toyota" },
  { valor: "CITROEN", nome: "Citroën" },
  { valor: "HYUNDAI", nome: "Hyundai" },
  { valor: "NISSAN", nome: "Nissan" },
  { valor: "HONDA", nome: "Honda" },
  { valor: "MITSUBISHI", nome: "Mitsubishi" },
  { valor: "KIA", nome: "Kia" },
  { valor: "MERCEDES BENZ", nome: "Mercedes-Benz" },
  { valor: "SCANIA", nome: "Scania" },
  { valor: "VOLVO", nome: "Volvo" },
];

// Fabricantes de repuestos destacados (valor = campo `marca` da tabela pecas)
export const MARCAS_PECAS = [
  "Bosch",
  "Metal Leve",
  "Eaton",
  "Nakata",
  "Sabó",
  "Mahle",
  "Skf",
  "Sampel",
  "Cofap",
  "Monroe",
  "Fras-le",
  "Valeo",
];
// Nome antigo (filtros e listas de marca da peça no admin e na loja)
export const MONTADORAS = MARCAS_PECAS;

// Redes sociais: preencha com os endereços reais. Ícones e botões só aparecem quando preenchidos.
export const INSTAGRAM_URL = "";
export const INSTAGRAM_USUARIO = "";
export const FACEBOOK_URL = "";

// Sigla da marca no círculo (sem usar logotipos de terceiros): "VW", "CH", "MB"...
const SIGLAS: Record<string, string> = { VOLKSWAGEN: "VW", "MERCEDES BENZ": "MB", CITROEN: "CI" };
export const siglaMarca = (m: { valor: string; nome: string }) =>
  SIGLAS[m.valor] ??
  (/[\s-]/.test(m.nome)
    ? m.nome
        .split(/[\s-]/)
        .map((p) => p[0])
        .join("")
    : m.nome.slice(0, 2)
  )
    .slice(0, 2)
    .toUpperCase();
