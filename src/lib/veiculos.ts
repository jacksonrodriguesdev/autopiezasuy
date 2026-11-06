// Funções do navegador para o buscador por veículo (marca → modelo → año)
import { createServerFn } from "@tanstack/react-start";

export type { OpcaoVeiculo } from "./veiculos.server";

const curto = (v: unknown) => String(v ?? "").slice(0, 80);

export const marcasVeiculoFn = createServerFn({ method: "GET" }).handler(async () => {
  const s = await import("./veiculos.server");
  return s.marcasVeiculo();
});

export const modelosVeiculoFn = createServerFn({ method: "GET" })
  .validator((d: { montadora: string }) => ({ montadora: curto(d?.montadora) }))
  .handler(async ({ data }) => {
    const s = await import("./veiculos.server");
    return data.montadora ? s.modelosVeiculo(data.montadora) : [];
  });

export const anosVeiculoFn = createServerFn({ method: "GET" })
  .validator((d: { montadora: string; modelo: string }) => ({
    montadora: curto(d?.montadora),
    modelo: curto(d?.modelo),
  }))
  .handler(async ({ data }) => {
    const s = await import("./veiculos.server");
    return data.montadora && data.modelo ? s.anosVeiculo(data.montadora, data.modelo) : [];
  });
