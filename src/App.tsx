import { Landing } from './components/Landing'
import { QuizView } from './components/QuizView'
import { AskView } from './components/AskView'
import { useQuiz } from './hooks/useQuiz'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const quiz = useQuiz()
  const theme = useTheme()

  if (quiz.view === 'landing') {
    return (
      <Landing
        questionCount={quiz.questionCount}
        onStart={quiz.startFresh}
        onAsk={quiz.goAsk}
        themeMode={theme.mode}
        onThemeCycle={theme.cycle}
        loading={quiz.loading}
        error={quiz.error}
      />
    )
  }

  if (quiz.view === 'ask') {
    return (
      <AskView
        onHome={quiz.goHome}
        themeMode={theme.mode}
        onThemeCycle={theme.cycle}
        contextHint={
          quiz.current
            ? `quiz:${quiz.current.cc}`
            : typeof window !== 'undefined'
              ? window.location.href
              : ''
        }
      />
    )
  }

  if (!quiz.current) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f5f5f7] dark:bg-[#0b0b0f]">
        <p className="text-zinc-500">문항을 준비하는 중…</p>
      </div>
    )
  }

  return (
    <QuizView
      current={quiz.current}
      index={quiz.index}
      total={quiz.total}
      selected={quiz.selected}
      answered={quiz.answered}
      explainOpen={quiz.explainOpen}
      onToggleExplain={() => quiz.setExplainOpen((v) => !v)}
      onSelect={quiz.selectOption}
      onNext={quiz.goNext}
      onPrev={quiz.goPrev}
      onShuffleRestart={quiz.startFresh}
      onHome={quiz.goHome}
      onAsk={quiz.goAsk}
      progressPct={quiz.progressPct}
      accuracyPct={quiz.accuracyPct}
      answeredCount={quiz.answeredIds.size}
      correctCount={quiz.correctCount}
      attemptCount={quiz.attemptCount}
      themeMode={theme.mode}
      onThemeCycle={theme.cycle}
    />
  )
}
