import { useEffect, useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import type { ThemeMode } from '../hooks/useTheme'

export const ASK_TYPES = [
  '이건 왜 물어보나요?',
  '이건 왜 안물어보나요?',
  '그냥 응원하고 싶어요',
] as const

export type AskType = (typeof ASK_TYPES)[number]

interface Props {
  onHome: () => void
  themeMode: ThemeMode
  onThemeCycle: () => void
  contextHint?: string
}

type Status = 'idle' | 'loading' | 'ok' | 'error'

export function AskView({ onHome, themeMode, onThemeCycle, contextHint }: Props) {
  const [askType, setAskType] = useState<AskType>(ASK_TYPES[0])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}ask-config.json`)
        if (!res.ok) return
        const json = (await res.json()) as { webhookUrl?: string }
        if (!cancelled && json.webhookUrl) setWebhookUrl(json.webhookUrl)
      } catch {
        /* config optional until deployed */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = message.trim()
    if (!trimmed) {
      setErrorMsg('내용을 입력해 주세요.')
      setStatus('error')
      return
    }
    if (!webhookUrl) {
      setErrorMsg('질문 접수 주소가 아직 연결되지 않았어요. 잠시 후 다시 시도해 주세요.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMsg(null)

    try {
      // text/plain avoids CORS preflight; Apps Script answers with 302 → JSON echo
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          type: askType,
          message: trimmed,
          page: contextHint || (typeof window !== 'undefined' ? window.location.href : ''),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        }),
        redirect: 'follow',
      })

      let ok = res.ok || res.type === 'opaqueredirect'
      try {
        const text = await res.text()
        if (text) {
          const data = JSON.parse(text) as { ok?: boolean; error?: string }
          if (data && typeof data.ok === 'boolean') ok = data.ok
          if (!ok && data?.error) setErrorMsg(data.error)
        }
      } catch {
        /* redirect/HTML body: if HTTP ok, treat as success */
      }

      if (!ok) {
        setStatus('error')
        setErrorMsg((m) => m || '전송에 실패했어요. 잠시 후 다시 시도해 주세요.')
        return
      }

      setStatus('ok')
      setMessage('')
    } catch {
      setStatus('error')
      setErrorMsg('네트워크 오류예요. 연결을 확인한 뒤 다시 시도해 주세요.')
    }
  }

  return (
    <div className="min-h-dvh bg-[#f5f5f7] dark:bg-[#0b0b0f]">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="pointer-events-auto mx-auto max-w-3xl">
          <nav
            className="glass-strong flex items-center justify-between gap-2 rounded-[28px] px-3.5 py-3 sm:px-5 sm:py-3.5"
            aria-label="질문하기"
          >
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
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">질문하기</span>
            <ThemeToggle mode={themeMode} onCycle={onThemeCycle} />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
        <div className="animate-fade-up rounded-[28px] border border-zinc-200/80 bg-white px-5 py-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 sm:px-7 sm:py-7">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Feedback
          </p>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            궁금한 점이나 응원을 남겨 주세요
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            유형을 고른 뒤 내용을 적으면, 실기연습 암기 시트의 「질문」 탭으로 바로 쌓여요.
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                유형
              </legend>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {ASK_TYPES.map((t) => {
                  const active = askType === t
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAskType(t)}
                      className={
                        active
                          ? 'rounded-full bg-zinc-900 px-4 py-2 text-left text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900'
                          : 'rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-left text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200'
                      }
                      aria-pressed={active}
                    >
                      {t}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="ask-message"
                className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-200"
              >
                내용
              </label>
              <textarea
                id="ask-message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  if (status !== 'idle') setStatus('idle')
                }}
                rows={6}
                maxLength={4000}
                placeholder="예: 급성 복통에서 이 질문을 왜 하나요? / 응원합니다!"
                className="w-full resize-y rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-900 outline-none ring-zinc-400 placeholder:text-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
              <p className="mt-1 text-right text-xs text-zinc-400">{message.length}/4000</p>
            </div>

            {status === 'ok' && (
              <p className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                잘 받았어요. 시트 「질문」 탭에 저장됐어요.
              </p>
            )}
            {status === 'error' && errorMsg && (
              <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {errorMsg}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-cta rounded-full px-8 py-3 text-sm font-semibold disabled:opacity-50"
              >
                {status === 'loading' ? '보내는 중…' : '보내기'}
              </button>
              <button
                type="button"
                onClick={onHome}
                className="glass-btn rounded-full px-5 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-200"
              >
                홈으로
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
