const LABELS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'] as const

export function optionLabel(index: number): string {
  return LABELS[index] ?? String(index + 1)
}

/** Highlight [tags] in explanation text as React-friendly segments. */
export function splitExplanation(text: string): Array<{ type: 'tag' | 'text'; value: string }> {
  const raw = text || '이 문항의 해설이 비어 있습니다.'
  const parts: Array<{ type: 'tag' | 'text'; value: string }> = []
  const re = /\[([^\]]+)\]/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(raw))) {
    if (m.index > last) {
      // Drop trailing spaces before a [tag] — line break is added in the UI
      parts.push({ type: 'text', value: raw.slice(last, m.index).replace(/[ \t]+$/u, '') })
    }
    parts.push({ type: 'tag', value: m[0] })
    last = m.index + m[0].length
  }
  if (last < raw.length) {
    parts.push({ type: 'text', value: raw.slice(last) })
  }
  if (!parts.length) parts.push({ type: 'text', value: raw })
  return parts
}
