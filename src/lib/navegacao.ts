import {
  IconeMotor,
  IconeFrenos,
  IconeSuspension,
  IconeInyeccion,
  IconeTransmision,
  IconeElectrica,
  IconeEmbrague,
  IconeDireccion,
  IconeRefrigeracion,
  IconeRodamientos,
  IconeGomas,
  IconeAccesorios,
  IconeMotos,
  IconeLubricacion,
  IconeEscape,
  IconeSeguridad,
  IconeHerramientas,
  IconeVarios,
  type IconeAuto,
} from "@/components/icones/IconesAuto";

// Categorias principais (nomes iguais ao banco, para o filtro da loja funcionar), na ordem da home.
// Ícones próprios (desenhos de peças): src/components/icones/IconesAuto.tsx
export const CATEGORIAS: Array<{ nome: string; curto: string; icon: IconeAuto }> = [
  { nome: "Motor", curto: "Motor", icon: IconeMotor },
  { nome: "Frenos", curto: "Frenos", icon: IconeFrenos },
  { nome: "Suspensión", curto: "Suspensión", icon: IconeSuspension },
  { nome: "Inyección y Combustible", curto: "Inyección", icon: IconeInyeccion },
  { nome: "Transmisión", curto: "Transmisión", icon: IconeTransmision },
  { nome: "Eléctrica", curto: "Eléctrica", icon: IconeElectrica },
  { nome: "Embrague", curto: "Embrague", icon: IconeEmbrague },
  { nome: "Dirección", curto: "Dirección", icon: IconeDireccion },
  { nome: "Refrigeración", curto: "Refrigeración", icon: IconeRefrigeracion },
  { nome: "Rodamientos", curto: "Rodamientos", icon: IconeRodamientos },
  { nome: "Gomas y Soportes", curto: "Gomas", icon: IconeGomas },
  { nome: "Accesorios", curto: "Accesorios", icon: IconeAccesorios },
  { nome: "Motos", curto: "Motos", icon: IconeMotos },
  { nome: "Lubricación", curto: "Lubricación", icon: IconeLubricacion },
  { nome: "Escape", curto: "Escape", icon: IconeEscape },
  { nome: "Seguridad", curto: "Seguridad", icon: IconeSeguridad },
  { nome: "Herramientas", curto: "Herramientas", icon: IconeHerramientas },
  { nome: "Varios", curto: "Varios", icon: IconeVarios },
];

export function iconeCategoria(nome: string): IconeAuto {
  const principal = nome.split(" > ")[0];
  return CATEGORIAS.find((c) => c.nome === principal)?.icon ?? IconeVarios;
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
