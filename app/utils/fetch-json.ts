/**
 * URLからJSONを取得する共通関数。
 *
 * レスポンスのContent-Typeに依存せず、textで受けてJSON.parseする。
 */
export async function fetchJson<T>(url: string): Promise<T> {
  // 取得失敗時は詳細付きで例外を投げる。
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${url} (${response.status})`)
  }

  // 拡張子がhtmlでもJSON文字列を返すケースに対応する。
  const text = await response.text()

  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(`Invalid JSON payload: ${url}`)
  }
}
