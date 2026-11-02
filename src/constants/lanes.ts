// Mesmos ids da API (src/modules/champions/lane.ts), na ordem do lobby do jogo.
export const LANES = ['top', 'jungle', 'mid', 'bot', 'support'] as const

export type Lane = (typeof LANES)[number]

export const LANE_NAMES: Record<Lane, string> = {
  top: 'Topo',
  jungle: 'Selva',
  mid: 'Meio',
  bot: 'Atirador',
  support: 'Suporte',
}
