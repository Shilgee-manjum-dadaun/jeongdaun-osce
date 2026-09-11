export interface QuizQuestion {
  id: string
  sheet_row: number
  cc: string
  patient: string
  options: string[]
  answer: string
  explanation: string
}

export interface QuizData {
  title: string
  source: string
  items?: unknown[]
  questions: QuizQuestion[]
}

export interface ShuffledQuestion extends QuizQuestion {
  shuffledOptions: string[]
}

export type View = 'landing' | 'quiz'
