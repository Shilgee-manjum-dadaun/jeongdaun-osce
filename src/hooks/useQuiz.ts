import { useCallback, useEffect, useMemo, useState } from 'react'
import type { QuizData, QuizQuestion, ShuffledQuestion, View } from '../types/quiz'
import { shuffle } from '../utils/shuffle'

function prepareDeck(questions: QuizQuestion[]): ShuffledQuestion[] {
  return shuffle(questions).map((q) => ({
    ...q,
    shuffledOptions: shuffle(q.options),
  }))
}

export function useQuiz() {
  const [data, setData] = useState<QuizData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('landing')
  const [deck, setDeck] = useState<ShuffledQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [explainOpen, setExplainOpen] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [attemptCount, setAttemptCount] = useState(0)
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}quiz-data.json`)
        if (!res.ok) throw new Error(`퀴즈 데이터를 불러오지 못했습니다 (${res.status})`)
        const json = (await res.json()) as QuizData
        if (!json.questions?.length) throw new Error('문항이 없습니다.')
        if (!cancelled) {
          setData(json)
          setLoading(false)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : '알 수 없는 오류')
          setLoading(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const total = deck.length
  const current = deck[index] ?? null

  const progressPct = total ? (answeredIds.size / total) * 100 : 0
  const accuracyPct = attemptCount ? (correctCount / attemptCount) * 100 : 0

  const startFresh = useCallback(() => {
    if (!data?.questions.length) return
    setDeck(prepareDeck(data.questions))
    setIndex(0)
    setSelected(null)
    setAnswered(false)
    setExplainOpen(false)
    setCorrectCount(0)
    setAttemptCount(0)
    setAnsweredIds(new Set())
    setView('quiz')
  }, [data])

  const goHome = useCallback(() => {
    setView('landing')
  }, [])

  const goAsk = useCallback(() => {
    setView('ask')
  }, [])

  const selectOption = useCallback(
    (option: string) => {
      if (answered || !current) return
      const isCorrect = option === current.answer
      setSelected(option)
      setAnswered(true)
      setAttemptCount((c) => c + 1)
      if (isCorrect) setCorrectCount((c) => c + 1)
      setAnsweredIds((prev) => {
        const next = new Set(prev)
        next.add(current.id)
        return next
      })
    },
    [answered, current],
  )

  const goNext = useCallback(() => {
    if (index >= total - 1) return
    setIndex((i) => i + 1)
    setSelected(null)
    setAnswered(false)
    setExplainOpen(false)
  }, [index, total])

  const goPrev = useCallback(() => {
    if (index <= 0) return
    setIndex((i) => i - 1)
    setSelected(null)
    setAnswered(false)
    setExplainOpen(false)
  }, [index])

  const questionCount = useMemo(() => data?.questions.length ?? 0, [data])

  return {
    data,
    error,
    loading,
    view,
    deck,
    index,
    total,
    current,
    selected,
    answered,
    explainOpen,
    setExplainOpen,
    correctCount,
    attemptCount,
    answeredIds,
    progressPct,
    accuracyPct,
    questionCount,
    startFresh,
    goHome,
    goAsk,
    selectOption,
    goNext,
    goPrev,
  }
}
