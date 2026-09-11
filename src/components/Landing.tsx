import { ThemeToggle } from './ThemeToggle'
import type { ThemeMode } from '../hooks/useTheme'

interface Props {
  questionCount: number
  onStart: () => void
  onAsk: () => void
  themeMode: ThemeMode
  onThemeCycle: () => void
  loading: boolean
  error: string | null
}

export function Landing({
  questionCount,
  onStart,
  onAsk,
  themeMode,
  onThemeCycle,
  loading,
  error,
}: Props) {
  return (
    <section className="relative min-h-dvh overflow-hidden" aria-label="시작 화면">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src={`${import.meta.env.BASE_URL}assets/hero-landmark.jpg`}
          alt=""
          className="h-full w-full object-cover opacity-40 dark:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-[#f5f5f7] dark:from-black/70 dark:via-[#0b0b0f]/85 dark:to-[#0b0b0f]" />
        <img
          src={`${import.meta.env.BASE_URL}assets/accent-constellation.jpg`}
          alt=""
          className="absolute -right-8 top-16 h-48 w-48 rounded-full object-cover opacity-35 blur-[1px] dark:opacity-25 sm:h-64 sm:w-64"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-2xl flex-col px-6 pb-10 pt-6">
        <div className="flex justify-end">
          <ThemeToggle mode={themeMode} onCycle={onThemeCycle} />
        </div>

        <div className="animate-fade-up flex flex-1 flex-col justify-center py-12">
          <h1 className="sr-only">정다운암기법</h1>
          <p className="mb-3 text-sm font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
            OSCE 실기 암기
          </p>
          <p className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            정다운암기법
          </p>
          <p className="mb-10 max-w-md text-base leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-lg">
            의사 국가고시 실기 · 주호소→암기 퀴즈 — 실전처럼 묻고, 즉시 채점하며 해설로
            다집니다.
          </p>

          <div className="mb-10 flex flex-wrap gap-2.5" role="list">
            <span
              role="listitem"
              className="glass rounded-full px-4 py-2 text-sm text-zinc-800 dark:text-zinc-100"
            >
              <strong className="font-semibold">{loading ? '…' : questionCount}</strong>문항
            </span>
            <span
              role="listitem"
              className="glass rounded-full px-4 py-2 text-sm text-zinc-800 dark:text-zinc-100"
            >
              <strong className="font-semibold">10</strong>지선다
            </span>
            <span
              role="listitem"
              className="glass rounded-full px-4 py-2 text-sm text-zinc-800 dark:text-zinc-100"
            >
              <strong className="font-semibold">즉시</strong> 채점
            </span>
          </div>

          {error && (
            <p className="mb-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onStart}
              disabled={loading || !!error}
              className="btn-cta rounded-full px-10 py-3.5 text-base font-semibold disabled:opacity-50"
            >
              시작하기
            </button>
            <button
              type="button"
              onClick={onAsk}
              className="glass-btn rounded-full px-6 py-3.5 text-base font-semibold text-zinc-800 dark:text-zinc-100"
            >
              질문하기
            </button>
          </div>
        </div>

        <footer className="text-center text-xs text-zinc-400 dark:text-zinc-500">
          정다운암기법 · OSCE 실기 암기 · 정적 학습 도구
        </footer>
      </div>
    </section>
  )
}
