'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

export type StaffMember = {
  _id: string
  name: string
  role?: string
  department?: string
  email?: string
  phone?: string
  photo?: string
}

type Props = {
  slt: StaffMember[]
  teaching: StaffMember[]
  support: StaffMember[]
}

function NamesList({ items, onOpen }: { items: StaffMember[]; onOpen: (m: StaffMember) => void }) {
  return (
    <ul className="divide-y divide-slate-200 rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-sm overflow-hidden" aria-label="Matching staff">
      {items.length === 0 ? (
        <li className="px-4 py-3 text-sm text-slate-500">No matches.</li>
      ) : (
        items.map((m) => (
          <li key={m._id} className="bg-white">
            <button
              type="button"
              onClick={() => onOpen(m)}
              className="w-full text-left flex items-center justify-between gap-4 px-4 py-3 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
              aria-label={`Open card for ${m.name}`}
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-morpeth-navy">{m.name}</p>
                <p className="truncate text-xs text-slate-500">{m.role || m.department || '—'}</p>
              </div>
              <svg className="h-4 w-4 shrink-0 text-slate-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.22 14.78a.75.75 0 0 1 0-1.06L10.94 10 7.22 6.28a.75.75 0 0 1 1.06-1.06l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        ))
      )}
    </ul>
  )
}

/**
 * Utilities
 * Robust normalisation + name parsing so searching/letter filters work with:
 *   - “First Last”
 *   - “Last, First”
 *   - Accented characters, NBSP, zero‑width chars
 */
function normaliseWords(input: string) {
  const raw = (input || '')
    .replace(/\u00A0/g, ' ') // NBSP -> space
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero‑width chars
    .trim()
  if (!raw) return [] as string[]
  const noMarks = raw.normalize('NFKD').replace(/[\u0300-\u036f]/g, '') // strip combining marks
  const words = noMarks.match(/[A-Za-z]+/g) || []
  return words
}

function splitName(name: string): { first: string; last: string } {
  const n = (name || '').trim()
  if (!n) return { first: '', last: '' }

  if (n.includes(',')) {
    const [left, right = ''] = n.split(',')
    const leftWords = normaliseWords(left)
    const rightWords = normaliseWords(right)
    const last = leftWords[leftWords.length - 1] || ''
    const first = rightWords[0] || ''
    return { first, last }
  }

  const words = normaliseWords(n)
  const first = words[0] || ''
  const last = words[words.length - 1] || ''
  return { first, last }
}

function getAllInitials(name: string): string[] {
  const words = normaliseWords(name || '')
  return words.map((w) => (w[0] || '').toUpperCase()).filter(Boolean)
}

function surnameInitial(name: string) {
  return (splitName(name).last[0] || '').toUpperCase()
}

function firstInitial(name: string) {
  return (splitName(name).first[0] || '').toUpperCase()
}

// Stable, locale‑friendly sort: by surname, then first name.
function sortBySurnameThenFirst(a: StaffMember, b: StaffMember) {
  const A = splitName(a.name)
  const B = splitName(b.name)
  const lastCmp = A.last.localeCompare(B.last, undefined, { sensitivity: 'base' })
  if (lastCmp !== 0) return lastCmp
  return A.first.localeCompare(B.first, undefined, { sensitivity: 'base' })
}

export default function DirectoryClient({ slt, teaching, support }: Props) {
  const [open, setOpen] = useState<StaffMember | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const lastFocused = useRef<Element | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const didAutoOpenForQuery = useRef<string | null>(null)
  const userClosedForKey = useRef<string | null>(null)

  // URL params
  const letterParam = (searchParams.get('letter') || '').trim().toUpperCase().charAt(0)
  const qParam = (searchParams.get('q') || '').trim().toLowerCase()

  // Predicate: free‑text query across name/role/department
  const matchesQ = (m: StaffMember) =>
    !qParam ||
    m.name?.toLowerCase().includes(qParam) ||
    m.role?.toLowerCase().includes(qParam) ||
    m.department?.toLowerCase().includes(qParam)

  // Predicate: letter filter (surname OR first initial OR any word initial)
  const matchesLetter = (m: StaffMember) => {
    if (!letterParam) return true
    if (surnameInitial(m.name) === letterParam) return true
    if (firstInitial(m.name) === letterParam) return true
    return getAllInitials(m.name).includes(letterParam)
  }

  // Filter + stable sort per section
  const filteredSlt = useMemo(
    () => (slt ?? []).filter((m) => matchesQ(m) && matchesLetter(m)).slice().sort(sortBySurnameThenFirst),
    [slt, qParam, letterParam]
  )
  const filteredTeaching = useMemo(
    () => (teaching ?? []).filter((m) => matchesQ(m) && matchesLetter(m)).slice().sort(sortBySurnameThenFirst),
    [teaching, qParam, letterParam]
  )
  const filteredSupport = useMemo(
    () => (support ?? []).filter((m) => matchesQ(m) && matchesLetter(m)).slice().sort(sortBySurnameThenFirst),
    [support, qParam, letterParam]
  )

  const allMembers = useMemo<StaffMember[]>(() => [...filteredSlt, ...filteredTeaching, ...filteredSupport], [filteredSlt, filteredTeaching, filteredSupport])

  // Auto‑open logic: only when a text search returns exactly one match and no letter filter is active
  const qValue = (searchParams.get('q') || '').trim()
  const singleKey = useMemo(() => {
    if (!qValue) return null
    if (allMembers.length !== 1) return null
    return `${qValue}|${allMembers[0]._id}`
  }, [qValue, allMembers])

  // Keep modal state in sync with the URL (?open=<id>)
  function openCard(m: StaffMember) {
    const existing = searchParams.get('open')
    if (existing !== m._id) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('open', m._id)
      router.replace(`?${params.toString()}`, { scroll: false })
    }
    setOpen(m)
  }

  function closeCard() {
    const q = (searchParams.get('q') || '').trim()
    if (q && open?._id) userClosedForKey.current = `${q}|${open._id}`
    const params = new URLSearchParams(searchParams.toString())
    params.delete('open')
    const qs = params.toString()
    const url = qs ? `?${qs}` : window.location.pathname
    router.replace(url, { scroll: false })
    setOpen(null)
  }

  // Handle Escape, scroll lock, and focus restore
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCard()
    }
    if (open) {
      lastFocused.current = document.activeElement
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
      setTimeout(() => closeBtnRef.current?.focus(), 0)
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus()
    }
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Open card if URL has ?open=<id>
  useEffect(() => {
    const id = searchParams.get('open')
    if (id) {
      if (!open || open._id !== id) {
        const found = allMembers.find((m) => m._id === id)
        if (found) setOpen(found)
      }
    } else if (open) {
      setOpen(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, allMembers])

  // Auto‑open if a search yields exactly one person (avoid loops / respect manual close)
  useEffect(() => {
    // If filtering by letter, NEVER auto‑open
    if (searchParams.get('letter')) {
      didAutoOpenForQuery.current = null
      return
    }

    if (!singleKey) {
      didAutoOpenForQuery.current = null
      return
    }
    if (userClosedForKey.current === singleKey) return
    if (didAutoOpenForQuery.current === singleKey) return

    const only = allMembers[0]
    const openId = searchParams.get('open')
    if (openId !== only._id) {
      didAutoOpenForQuery.current = singleKey
      openCard(only)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleKey, searchParams, allMembers])

  const Card = ({ title, count, children, openByDefault }: { title: string; count: number; children: React.ReactNode; openByDefault?: boolean }) => (
    <details open={openByDefault} className="acc group rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-morpeth-navy/20">
      <summary className="list-none cursor-pointer select-none px-5 py-4 flex items-center justify-between gap-4 rounded-3xl transition-colors duration-200 group-hover:bg-slate-50">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Team</p>
          <h3 className="font-heading text-xl md:text-2xl text-morpeth-navy uppercase tracking-[0.1em]">
            {title} <span className="text-slate-400 normal-case font-sans text-sm">({count})</span>
          </h3>
        </div>
        <svg className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 12.5a.75.75 0 0 1-.53-.22l-4-4a.75.75 0 1 1 1.06-1.06L10 10.69l3.47-3.47a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-.53.22Z" clipRule="evenodd"/></svg>
      </summary>
      <div className="p-3 md:p-4">{children}</div>
    </details>
  )

  return (
    <>
      <div className="space-y-4">
        <Card title="Senior Leadership Team" count={filteredSlt.length} openByDefault={!!letterParam}>
          <NamesList items={filteredSlt} onOpen={openCard} />
        </Card>
        <Card title="Teaching Staff" count={filteredTeaching.length} openByDefault={!!letterParam}>
          <NamesList items={filteredTeaching} onOpen={openCard} />
        </Card>
        <Card title="Support Staff" count={filteredSupport.length} openByDefault={!!letterParam}>
          <NamesList items={filteredSupport} onOpen={openCard} />
        </Card>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeCard()
          }}
        >
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm opacity-100" onClick={closeCard} />
          <div className="relative z-10 w-full max-w-4xl rounded-3xl bg-white ring-1 ring-slate-200 shadow-2xl p-4 md:p-6 translate-y-0 opacity-100 transition max-h-[85vh] overflow-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Directory</p>
                <h4 className="font-heading text-2xl md:text-3xl text-morpeth-navy mt-1">{open.name}</h4>
              </div>
              <button
                ref={closeBtnRef}
                className="rounded-full border border-morpeth-navy/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-morpeth-navy hover:bg-morpeth-light/40"
                onClick={closeCard}
              >
                Close
              </button>
            </div>

            {/* Content layout: image left, details right */}
            <div className="mt-5 flex flex-col md:flex-row md:items-start md:gap-6">
              <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-slate-200 md:w-[340px] md:h-auto md:aspect-[3/4] md:flex-none md:shrink-0">
                {open.photo ? (
                  <Image
                    src={open.photo}
                    alt={open.name}
                    fill
                    sizes="(min-width: 768px) 480px, 100vw"
                    className="object-cover object-[50%_35%] md:object-[50%_35%]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">No photo</div>
                )}
              </div>

              <div className="mt-4 md:mt-0 md:flex-1 text-[15px] leading-6 text-slate-700">
                {open.role ? <p className="font-semibold text-morpeth-navy text-lg leading-7">{open.role}</p> : null}
                {open.department ? <p className="text-slate-600">{open.department}</p> : null}

                <div className="mt-4 space-y-2">
                  {open.email ? (
                    <p>
                      <a href={`mailto:${open.email}`} className="text-sky-700 hover:underline break-all">{open.email}</a>
                    </p>
                  ) : null}
                  {open.phone ? (
                    <p>
                      <a href={`tel:${open.phone}`} className="text-sky-700 hover:underline">{open.phone}</a>
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}