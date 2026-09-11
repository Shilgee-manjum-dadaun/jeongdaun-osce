import type { ShuffledQuestion } from '../types/quiz'
import { optionLabel } from '../utils/format'
import { splitExplanation } from '../utils/format'
import { QuizHeader } from './QuizHeader'
import type { ThemeMode } from '../hooks/useTheme'

interface Props {
  current: ShuffledQuestion
  index: number
  total: number
  selected: string | null
  answered: boolean
  explainOpen: boolean
  onToggleExplain: () => void
  onSelect: (option: string) => void
  onNext: () => void
  onPrev: () => void
  onShuffleRestart: () => void
  onHome: () => void
  onAsk: () => void
  progressPct: number
  accuracyPct: number
  answeredCount: number
  correctCount: number
  attemptCount: number
  themeMode: ThemeMode
  onThemeCycle: () => void
}

export function QuizView({
  current,
  index,
  total,
  selected,
  answered,
  explainOpen,
  onToggleExplain,
  onSelect,
  onNext,
  onPrev,
  onShuffleRestart,
  onHome,
  onAsk,
  progressPct,
  accuracyPct,
  answeredCount,
  correctCount,
  attemptCount,
  themeMode,
  onThemeCycle,
}: Props) {
  const parts = splitExplanation(current.explanation)

  return (
    <div className="min-h-dvh bg-[#f5f5f7] dark:bg-[#0b0b0f]">
      <QuizHeader
        onHome={onHome}
        onAsk={onAsk}
        progressPct={progressPct}
        accuracyPct={accuracyPct}
        answeredCount={answeredCount}
        total={total}
        correctCount={correctCount}
        attemptCount={attemptCount}
        themeMode={themeMode}
        onThemeCycle={onThemeCycle}
      />

      <main className="mx-auto max-w-3xl px-4 pb-28 pt-36 sm:px-6 sm:pt-40">
        <div className="animate-fade-up mb-6">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="rounded-full bg-zinc-200/80 px-3 py-1 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              {index + 1} / {total}
            </span>
            <span className="rounded-full bg-blue-500/10 px-3 py-1 font-medium text-blue-600 dark:text-blue-400">
              {current.cc}
            </span>
          </div>

          <div className="rounded-[28px] border border-zinc-200/80 bg-white px-5 py-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 sm:px-7 sm:py-7">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              환자
            </p>
            <p className="text-xl font-semibold leading-snug text-zinc-900 dark:text-white sm:text-2xl">
              “{current.patient}”
            </p>
          </div>
        </div>

        <ol className="mb-6 grid list-none gap-2.5 p-0">
          {current.shuffledOptions.map((opt, i) => {
            let cls =
              'opt w-full rounded-[20px] border border-zinc-200/90 bg-white px-4 py-3.5 text-left text-[15px] leading-snug text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100 sm:px-5'
            if (answered) {
              if (opt === current.answer) cls += ' opt-correct'
              else if (opt === selected) cls += ' opt-wrong'
            }
            return (
              <li key={`${current.id}-${i}-${opt}`}>
                <button
                  type="button"
                  disabled={answered}
                  onClick={() => onSelect(opt)}
                  className={cls}
                >
                  <span className="mr-2.5 inline-block w-6 shrink-0 font-medium text-zinc-400 dark:text-zinc-500">
                    {optionLabel(i)}
                  </span>
                  <span className="align-middle">{opt}</span>
                </button>
              </li>
            )
          })}
        </ol>

        {answered && (
          <div className="mb-6 animate-fade-up">
            <button
              type="button"
              onClick={onToggleExplain}
              className="glass-btn mb-3 flex w-full items-center justify-between rounded-[22px] px-5 py-3.5 text-left text-sm font-semibold text-zinc-800 dark:text-zinc-100"
              aria-expanded={explainOpen}
            >
              <span>해설 보기</span>
              <span className="text-zinc-400" aria-hidden="true">
                {explainOpen ? '▾' : '▸'}
              </span>
            </button>

            {explainOpen && (
              <div className="glass rounded-[24px] px-5 py-4 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-200">
                {parts.map((part, i) => {
                  if (part.type === 'tag') {
                    const breakBefore = i > 0
                    return (
                      <span key={i}>
                        {breakBefore ? <br /> : null}
                        <span className="tag">{part.value}</span>
                      </span>
                    )
                  }
                  // Trim spaces that sat before a mid-sentence [tag]
                  const value =
                    i + 1 < parts.length && parts[i + 1]?.type === 'tag'
                      ? part.value.replace(/[ \t]+$/u, '')
                      : part.value
                  return <span key={i}>{value}</span>
                })}
              </div>
            )}
          </div>
        )}

        <div className="glass sticky bottom-4 z-40 flex flex-wrap items-center justify-between gap-2 rounded-[24px] px-3 py-2.5 sm:px-4">
          <button
            type="button"
            onClick={onPrev}
            disabled={index <= 0}
            className="glass-btn rounded-full px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-100"
          >
            이전
          </button>

          <button
            type="button"
            onClick={onShuffleRestart}
            className="glass-btn rounded-full px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-100"
          >
            Shuffle & Restart
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={index >= total - 1}
            className="glass-btn rounded-full px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-100"
          >
            다음
          </button>
        </div>
      </main>
    </div>
  )
}
