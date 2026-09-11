import { ThemeToggle } from './ThemeToggle'
import type { ThemeMode } from '../hooks/useTheme'

interface Props {
  onHome: () => void
  onAsk: () => void
  progressPct: number
  accuracyPct: number
  answeredCount: number
  total: number
  correctCount: number
  attemptCount: number
  themeMode: ThemeMode
  onThemeCycle: () => void
}

export function QuizHeader({
  onHome,
  onAsk,
  progressPct,
  accuracyPct,
  answeredCount,
  total,
  correctCount,
  attemptCount,
  themeMode,
  onThemeCycle,
}: Props) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="pointer-events-auto mx-auto max-w-3xl">
        <nav
          className="glass-strong rounded-[28px] px-3.5 py-3 sm:px-5 sm:py-3.5"
          aria-label="퀴즈 진행"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onHome}
              className="glass-btn flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-100"
              aria-label="홈으로 · 정다운암기법"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span className="hidden sm:inline">정다운암기법</span>
              <span className="sm:hidden">홈</span>
            </button>

            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 sm:text-sm">
              {answeredCount}/{total} 풀이 · {correctCount}/{attemptCount} 정답
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onAsk}
                className="glass-btn rounded-full px-3 py-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-100"
              >
                질문
              </button>
              <ThemeToggle mode={themeMode} onCycle={onThemeCycle} />
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-4">
            <div>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  풀이 진행
                </span>
                <span className="text-xs font-semibold tabular-nums text-zinc-800 dark:text-zinc-100">
                  {progressPct.toFixed(0)}%
                </span>
              </div>
              <div className="progress-track" role="progressbar" aria-valuenow={Math.round(progressPct)} aria-valuemin={0} aria-valuemax={100} aria-label="풀이 진행">
                <div
                  className="progress-fill bg-zinc-800 dark:bg-zinc-100"
                  style={{ width: `${Math.min(100, progressPct)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  정답률
                </span>
                <span className="text-xs font-semibold tabular-nums text-zinc-800 dark:text-zinc-100">
                  {accuracyPct.toFixed(0)}%
                </span>
              </div>
              <div className="progress-track" role="progressbar" aria-valuenow={Math.round(accuracyPct)} aria-valuemin={0} aria-valuemax={100} aria-label="정답률">
                <div
                  className="progress-fill bg-emerald-500 dark:bg-emerald-400"
                  style={{ width: `${Math.min(100, accuracyPct)}%` }}
                />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
