import type { ChartMeta, MetaData } from '../types/view-model'

/**
 * 譜面メタデータJSONから譜面キーで引けるメタデータマップを構築する
 * @param meta - 譜面メタデータJSON
 * @returns 「楽曲名::難易度キー」をキー、譜面メタデータを値とするMap
 */
export function buildChartMetaMap(meta: MetaData): Map<string, ChartMeta> {
  const map = new Map<string, ChartMeta>()

  if (!meta.charts || typeof meta.charts !== 'object' || Array.isArray(meta.charts)) {
    return map
  }

  for (const [songName, songCharts] of Object.entries(meta.charts)) {
    if (!songName || !isObjectRecord(songCharts)) {
      continue
    }

    for (const [difficultyKey, rawMeta] of Object.entries(songCharts)) {
      if (!difficultyKey) {
        continue
      }

      const normalizedMeta = normalizeChartMeta(rawMeta)
      if (!normalizedMeta) {
        continue
      }

      map.set(`${songName}::${difficultyKey}`, normalizedMeta)
    }
  }

  return map
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function normalizeChartMeta(rawMeta: unknown): ChartMeta | null {
  if (!isObjectRecord(rawMeta)) {
    return null
  }

  const normalized: ChartMeta = {}

  for (const [key, value] of Object.entries(rawMeta as Record<string, unknown>)) {
    if (key === 'constValue') {
      const normalizedConst = normalizeConstValue(value)
      if (normalizedConst !== undefined) {
        normalized.constValue = normalizedConst
      }
      continue
    }

    if (key === 'taskDirector') {
      if (typeof value === 'string' && value.trim()) {
        normalized.taskDirector = value.trim()
      }
      continue
    }

    normalized[key] = value
  }

  return Object.keys(normalized).length > 0 ? normalized : null
}

function normalizeConstValue(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  return undefined
}