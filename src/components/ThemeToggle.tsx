import type { ThemeMode } from '../hooks/useTheme'

interface Props {
  mode: ThemeMode
  onCycle: () => void
  className?: string
}

const LABELS: Record<ThemeMode, string> = {
  system: '시스템',
  light: '라이트',
  dark: '다크',
}

export function ThemeToggle({ mode, onCycle, className = '' }: Props) {
  return (
    <button
      type="button"
      onClick={onCycle}
      className={`glass-btn rounded-full px-3.5 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-100 ${className}`}
      aria-label={`테마 전환 (현재: ${LABELS[mode]})`}
      title={`테마: ${LABELS[mode]}`}
    >
      {mode === 'dark' ? '🌙' : mode === 'light' ? '☀️' : '💻'} {LABELS[mode]}
    </button>
  )
}
