import { useEffect, useMemo, useState, type FormEvent } from 'react'

type BusinessCard = {
  id: string
  name: string
  company: string
  title: string
  email: string
  phone: string
  website: string
  location: string
  tags: string[]
  keywords: string[]
  notes: string
  lastMet: string
  relationNotes: string[]
  nextAction: string
  stage: 'hot' | 'warm' | 'watch'
  imageUrl?: string
}

type DraftCard = {
  name: string
  company: string
  title: string
  email: string
  phone: string
  website: string
  location: string
  tags: string
  keywords: string
  notes: string
  nextAction: string
  stage: BusinessCard['stage']
  imageUrl?: string
  imageName?: string
}

const storageKey = 'business-card-atlas-separate:v1'

const seedCards: BusinessCard[] = [
  {
    id: 'card-1',
    name: 'Shiori Tanaka',
    company: 'Northstar AI',
    title: 'Product Lead',
    email: 'shiori@northstar.ai',
    phone: '+81 90 1111 2222',
    website: 'northstar.ai',
    location: 'Tokyo, JP',
    tags: ['AI', 'SaaS', 'Sales'],
    keywords: ['LLM', 'workflow', 'enterprise'],
    notes: '商談の組み立てが速く、導入フローの合意形成がうまい。',
    lastMet: '2026-08-09',
    relationNotes: ['SaaS導入の比較検討', 'AI実装のPoC'],
    nextAction: 'AIワークフローに強い人へつなぐ',
    stage: 'hot',
  },
  {
    id: 'card-2',
    name: 'Yuto Kondo',
    company: 'Atlas Design',
    title: 'Design Ops',
    email: 'yuto@atlas.design',
    phone: '+81 80 2222 3333',
    website: 'atlas.design',
    location: 'Osaka, JP',
    tags: ['Design', 'Brand', 'UX'],
    keywords: ['brand system', 'motion', 'prototype'],
    notes: 'ブランドの骨格づくりとUIの統一に強い。',
    lastMet: '2026-08-01',
    relationNotes: ['ブランド整理', 'プロトタイプ検証'],
    nextAction: 'デザイン系の相談役として保管',
    stage: 'warm',
  },
  {
    id: 'card-3',
    name: 'Mika Saito',
    company: 'Kobe Robotics Lab',
    title: 'R&D Manager',
    email: 'mika@kobe-robotics.jp',
    phone: '+81 70 3333 4444',
    website: 'kobe-robotics.jp',
    location: 'Kobe, JP',
    tags: ['Hardware', 'Robotics', 'Mobility'],
    keywords: ['sensor', 'edge', 'prototype'],
    notes: '試作速度が速い。ハードとソフトの接続役になれる。',
    lastMet: '2026-07-29',
    relationNotes: ['試作機', 'センサ連携'],
    nextAction: 'ハード好きの学生へ紹介',
    stage: 'warm',
  },
  {
    id: 'card-4',
    name: 'Naoki Inoue',
    company: 'Green Loop',
    title: 'Community Builder',
    email: 'naoki@greenloop.jp',
    phone: '+81 90 4444 5555',
    website: 'greenloop.jp',
    location: 'Fukuoka, JP',
    tags: ['Community', 'Education', 'Local'],
    keywords: ['events', 'learning', 'network'],
    notes: 'コミュニティの熱量を保つ設計が上手い。',
    lastMet: '2026-08-03',
    relationNotes: ['勉強会', '地域連携'],
    nextAction: '教育系イベントに招待',
    stage: 'watch',
  },
  {
    id: 'card-5',
    name: 'Sara Watanabe',
    company: 'Study Deck',
    title: 'Founder',
    email: 'sara@studydeck.io',
    phone: '+81 80 5555 6666',
    website: 'studydeck.io',
    location: 'Tokyo, JP',
    tags: ['Education', 'AI', 'App'],
    keywords: ['edtech', 'habit', 'mobile'],
    notes: '学習導線とアプリ体験をつなぐ視点がある。',
    lastMet: '2026-08-11',
    relationNotes: ['学習アプリ', 'モバイルUX'],
    nextAction: 'アプリ化の話を共有',
    stage: 'hot',
  },
  {
    id: 'card-6',
    name: 'Ken Suzuki',
    company: 'Relay Health',
    title: 'Operations Manager',
    email: 'ken@relay.health',
    phone: '+81 70 6666 7777',
    website: 'relay.health',
    location: 'Nagoya, JP',
    tags: ['Health', 'Operations', 'AI'],
    keywords: ['workflow', 'care', 'triage'],
    notes: '現場導入の摩擦を潰す運用設計に向く。',
    lastMet: '2026-07-25',
    relationNotes: ['医療導線', 'オペレーション'],
    nextAction: '運用設計が必要な案件で再接続',
    stage: 'watch',
  },
]

const stageLabels: Record<BusinessCard['stage'], string> = {
  hot: '即アクション',
  warm: '温める',
  watch: '保管',
}

const stageOrder: BusinessCard['stage'][] = ['hot', 'warm', 'watch']

const quickTabs = ['All', 'AI', 'Design', 'Hardware', 'Education', 'Community', 'Health'] as const

function createEmptyDraft(): DraftCard {
  return {
    name: '',
    company: '',
    title: '',
    email: '',
    phone: '',
    website: '',
    location: '',
    tags: '',
    keywords: '',
    notes: '',
    nextAction: '',
    stage: 'warm',
  }
}

function normalizeList(input: string) {
  return input
    .split(/[,、\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function stageScore(stage: BusinessCard['stage']) {
  return stage === 'hot' ? 3 : stage === 'warm' ? 2 : 1
}

function overlapScore(source: string[], target: string[]) {
  return source.filter((value) => target.includes(value)).length
}

function relationScore(card: BusinessCard, other: BusinessCard) {
  const tagOverlap = overlapScore(card.tags, other.tags)
  const keywordOverlap = overlapScore(card.keywords, other.keywords)
  const sameCompanyBucket =
    card.company.split(' ')[0].toLowerCase() === other.company.split(' ')[0].toLowerCase() ? 1 : 0
  return tagOverlap * 3 + keywordOverlap * 2 + sameCompanyBucket
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ja-JP', { month: 'short', day: 'numeric' }).format(new Date(value))
}

function loadStoredCards() {
  if (typeof window === 'undefined') {
    return seedCards
  }

  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) {
      return seedCards
    }

    const parsed = JSON.parse(raw) as BusinessCard[]
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
  } catch {
    // Fall back to the bundled sample set when storage is invalid.
  }

  return seedCards
}

function App() {
  const [cards, setCards] = useState<BusinessCard[]>(loadStoredCards)
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<string>('All')
  const [selectedCardId, setSelectedCardId] = useState(loadStoredCards()[0]?.id ?? seedCards[0].id)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<DraftCard>(createEmptyDraft)

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(cards))
  }, [cards])

  useEffect(() => {
    return () => {
      if (draft.imageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(draft.imageUrl)
      }
    }
  }, [draft.imageUrl])

  const visibleCards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return cards
      .filter((card) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          [card.name, card.company, card.title, card.email, card.location, ...card.tags, ...card.keywords]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery)

        const matchesTab =
          activeTab === 'All' ||
          card.tags.includes(activeTab) ||
          card.keywords.some((keyword) => keyword.toLowerCase().includes(activeTab.toLowerCase()))

        return matchesQuery && matchesTab
      })
      .sort((left, right) => {
        const stageDiff = stageScore(right.stage) - stageScore(left.stage)
        if (stageDiff !== 0) return stageDiff
        return new Date(right.lastMet).getTime() - new Date(left.lastMet).getTime()
      })
  }, [activeTab, cards, query])

  const selectedCard = cards.find((card) => card.id === selectedCardId) ?? cards[0]

  const uniqueTags = useMemo(() => {
    return Array.from(new Set(cards.flatMap((card) => card.tags))).sort()
  }, [cards])

  const topStats = useMemo(() => {
    const tagCount = cards.reduce((sum, card) => sum + card.tags.length, 0)
    const hotCount = cards.filter((card) => card.stage === 'hot').length
    const relationCount = cards.reduce((sum, card) => sum + card.relationNotes.length, 0)

    return [
      { label: '保存済み名刺', value: cards.length.toString(), detail: 'local-first' },
      { label: '即アクション', value: hotCount.toString(), detail: '連絡優先' },
      { label: 'タグ総数', value: tagCount.toString(), detail: '会社/分野' },
      { label: '関係メモ', value: relationCount.toString(), detail: '紹介の手がかり' },
    ]
  }, [cards])

  const matchingSuggestions = useMemo(() => {
    if (!selectedCard) return []

    return cards
      .filter((card) => card.id !== selectedCard.id)
      .map((card) => {
        const score = relationScore(selectedCard, card)
        const sharedTags = selectedCard.tags.filter((tag) => card.tags.includes(tag))
        const sharedKeywords = selectedCard.keywords.filter((keyword) => card.keywords.includes(keyword))

        return {
          card,
          score,
          sharedTags,
          sharedKeywords,
        }
      })
      .sort((left, right) => right.score - left.score)
      .slice(0, 3)
  }, [cards, selectedCard])

  const graphCards = useMemo(() => {
    const source = visibleCards.length > 0 ? visibleCards : cards
    return source.slice(0, 6)
  }, [cards, visibleCards])

  const graphNodes = graphCards.map((card, index) => {
    const angle = graphCards.length === 1 ? -90 : -90 + (360 / graphCards.length) * index
    const radius = graphCards.length === 1 ? 0 : 34
    const x = 50 + Math.cos((angle * Math.PI) / 180) * radius
    const y = 50 + Math.sin((angle * Math.PI) / 180) * radius

    return { card, x, y }
  })

  function loadCardToForm(card: BusinessCard) {
    setEditingId(card.id)
    setDraft({
      name: card.name,
      company: card.company,
      title: card.title,
      email: card.email,
      phone: card.phone,
      website: card.website,
      location: card.location,
      tags: card.tags.join(', '),
      keywords: card.keywords.join(', '),
      notes: card.notes,
      nextAction: card.nextAction,
      stage: card.stage,
      imageUrl: card.imageUrl,
      imageName: undefined,
    })
  }

  function resetForm() {
    setEditingId(null)
    setDraft(createEmptyDraft())
  }

  function handleImageChange(file: File | null) {
    if (!file) return
    const imageUrl = URL.createObjectURL(file)
    setDraft((current) => ({ ...current, imageUrl, imageName: file.name }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const now = new Date().toISOString()
    const id = editingId ?? `card-${Date.now()}`

    const nextCard: BusinessCard = {
      id,
      name: draft.name.trim(),
      company: draft.company.trim(),
      title: draft.title.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      website: draft.website.trim(),
      location: draft.location.trim(),
      tags: normalizeList(draft.tags),
      keywords: normalizeList(draft.keywords),
      notes: draft.notes.trim(),
      lastMet: cards.find((card) => card.id === id)?.lastMet ?? now,
      relationNotes: cards.find((card) => card.id === id)?.relationNotes ?? [],
      nextAction: draft.nextAction.trim(),
      stage: draft.stage,
      imageUrl: draft.imageUrl,
    }

    setCards((current) => {
      const exists = current.some((card) => card.id === id)
      if (exists) {
        return current.map((card) => (card.id === id ? nextCard : card))
      }
      return [nextCard, ...current]
    })
    setSelectedCardId(id)
    setEditingId(id)
  }

  function addSampleCapture() {
    const sample = seedCards[(cards.length + 1) % seedCards.length]
    const id = `card-${Date.now()}`
    setCards((current) => [
      {
        ...sample,
        id,
        lastMet: new Date().toISOString(),
        nextAction: 'スキャンから追加されたサンプル',
      },
      ...current,
    ])
    setSelectedCardId(id)
    setEditingId(id)
    setDraft({
      name: sample.name,
      company: sample.company,
      title: sample.title,
      email: sample.email,
      phone: sample.phone,
      website: sample.website,
      location: sample.location,
      tags: sample.tags.join(', '),
      keywords: sample.keywords.join(', '),
      notes: sample.notes,
      nextAction: 'スキャンから追加されたサンプル',
      stage: sample.stage,
      imageUrl: sample.imageUrl,
      imageName: 'sample-card.png',
    })
  }

  const introSummary = selectedCard
    ? matchingSuggestions[0]
    : undefined

  return (
    <div className="app-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <header className="header">
        <div>
          <p className="eyebrow">Business Card Atlas</p>
          <h1>名刺をスキャンして、保存して、つながりを見える化する。</h1>
        </div>
        <div className="header-actions">
          <div className="sync-pill">
            <span className="sync-dot" />
            local-first / PWA ready
          </div>
          <button type="button" className="ghost-button" onClick={addSampleCapture}>
            サンプルを追加
          </button>
        </div>
      </header>

      <main className="layout">
        <aside className="panel capture-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Scan</p>
              <h2>名刺の取り込み</h2>
            </div>
            <span className="panel-badge">OCR / 手入力</span>
          </div>

          <form className="capture-form" onSubmit={handleSubmit}>
            <label className="image-dropzone">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleImageChange(event.target.files?.[0] ?? null)}
              />
              <div className="dropzone-copy">
                <strong>名刺画像を選ぶ</strong>
                <span>{draft.imageName ?? 'PNG / JPG / HEIC の取り込みを想定'}</span>
              </div>
              {draft.imageUrl ? <img className="preview-image" src={draft.imageUrl} alt="" /> : null}
            </label>

            <div className="field-grid">
              <label>
                <span>氏名</span>
                <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
              </label>
              <label>
                <span>会社</span>
                <input value={draft.company} onChange={(event) => setDraft({ ...draft, company: event.target.value })} />
              </label>
              <label>
                <span>役職</span>
                <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
              </label>
              <label>
                <span>所在地</span>
                <input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} />
              </label>
              <label>
                <span>Email</span>
                <input value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
              </label>
              <label>
                <span>Phone</span>
                <input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} />
              </label>
              <label>
                <span>Website</span>
                <input value={draft.website} onChange={(event) => setDraft({ ...draft, website: event.target.value })} />
              </label>
              <label>
                <span>ステージ</span>
                <select value={draft.stage} onChange={(event) => setDraft({ ...draft, stage: event.target.value as BusinessCard['stage'] })}>
                  {stageOrder.map((stage) => (
                    <option key={stage} value={stage}>
                      {stageLabels[stage]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              <span>タグ</span>
              <input
                value={draft.tags}
                onChange={(event) => setDraft({ ...draft, tags: event.target.value })}
                placeholder="AI, SaaS, Design"
              />
            </label>

            <label>
              <span>会社キーワード</span>
              <input
                value={draft.keywords}
                onChange={(event) => setDraft({ ...draft, keywords: event.target.value })}
                placeholder="workflow, sensor, brand"
              />
            </label>

            <label>
              <span>メモ</span>
              <textarea value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} rows={4} />
            </label>

            <label>
              <span>次のアクション</span>
              <textarea
                value={draft.nextAction}
                onChange={(event) => setDraft({ ...draft, nextAction: event.target.value })}
                rows={3}
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editingId ? '更新して保存' : '保存する'}
              </button>
              <button type="button" className="secondary-button" onClick={resetForm}>
                フォームをクリア
              </button>
            </div>
          </form>
        </aside>

        <section className="workspace">
          <section className="panel stats-panel">
            <div className="panel-heading compact">
              <div>
                <p className="panel-kicker">Dashboard</p>
                <h2>一覧で俯瞰する</h2>
              </div>
              <div className="search-chip">cards: {visibleCards.length}</div>
            </div>

            <div className="stats-grid">
              {topStats.map((stat) => (
                <article className="stat-card" key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                  <small>{stat.detail}</small>
                </article>
              ))}
            </div>

            <div className="search-row">
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="氏名、会社、タグ、キーワードで検索"
              />
              <div className="tabs" role="tablist" aria-label="タグによる分類">
                {quickTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    className={activeTab === tab ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="panel graph-panel">
            <div className="panel-heading compact">
              <div>
                <p className="panel-kicker">Graph</p>
                <h2>Obsidianのように関係を辿る</h2>
              </div>
              <span className="panel-badge">tags / keywords</span>
            </div>

            <div className="graph-wrap">
              <svg className="graph" viewBox="0 0 100 100" aria-label="関係グラフ">
                <defs>
                  <linearGradient id="nodeGlow" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#f8b26a" />
                    <stop offset="100%" stopColor="#54d6c6" />
                  </linearGradient>
                </defs>
                {graphNodes.map((node) =>
                  node.card.id === selectedCard?.id ? null : (
                    <line
                      key={`${selectedCard?.id}-${node.card.id}`}
                      x1="50"
                      y1="50"
                      x2={node.x}
                      y2={node.y}
                      className="graph-line"
                    />
                  ),
                )}
                {graphNodes.map((node) => (
                  <g key={node.card.id}>
                    <circle cx={node.x} cy={node.y} r="6.6" className="graph-node" />
                    <text x={node.x} y={node.y - 11} className="graph-label">
                      {node.card.name.split(' ')[0]}
                    </text>
                  </g>
                ))}
                <circle cx="50" cy="50" r="12" fill="url(#nodeGlow)" className="graph-center" />
                <text x="50" y="47" textAnchor="middle" className="graph-center-label">
                  {selectedCard?.company ?? 'Atlas'}
                </text>
                <text x="50" y="56" textAnchor="middle" className="graph-center-subtitle">
                  {selectedCard?.tags.join(' / ') ?? 'connections'}
                </text>
              </svg>

              <div className="tag-cloud" aria-label="タグ一覧">
                {uniqueTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    className="cloud-pill"
                    onClick={() => setActiveTab(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="panel list-panel">
            <div className="panel-heading compact">
              <div>
                <p className="panel-kicker">Library</p>
                <h2>保存した名刺</h2>
              </div>
              <span className="panel-badge">{cards.length} contacts</span>
            </div>

            <div className="card-grid">
              {visibleCards.map((card) => {
                const isSelected = card.id === selectedCard?.id

                return (
                  <article
                    key={card.id}
                    className={isSelected ? 'business-card selected' : 'business-card'}
                    onClick={() => setSelectedCardId(card.id)}
                  >
                    <div className="card-topline">
                      <span className={`stage-badge stage-${card.stage}`}>{stageLabels[card.stage]}</span>
                      <button
                        type="button"
                        className="text-link"
                        onClick={(event) => {
                          event.stopPropagation()
                          loadCardToForm(card)
                        }}
                      >
                        edit
                      </button>
                    </div>
                    <h3>{card.name}</h3>
                    <p className="card-company">{card.company}</p>
                    <p className="card-title">{card.title}</p>
                    <div className="tag-row">
                      {card.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <p className="card-note">{card.nextAction}</p>
                    <div className="card-meta">
                      <span>{formatDate(card.lastMet)}</span>
                      <span>{card.location}</span>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        </section>

        <aside className="panel insight-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Match</p>
              <h2>この人を誰につなぐか</h2>
            </div>
            <span className="panel-badge">future match</span>
          </div>

          {selectedCard ? (
            <>
              <article className="insight-card">
                <p className="insight-label">Selected</p>
                <h3>{selectedCard.name}</h3>
                <span>{selectedCard.company}</span>
                <p>{selectedCard.notes}</p>
              </article>

              <div className="profile-list">
                <div className="profile-row">
                  <span>email</span>
                  <strong>{selectedCard.email}</strong>
                </div>
                <div className="profile-row">
                  <span>phone</span>
                  <strong>{selectedCard.phone}</strong>
                </div>
                <div className="profile-row">
                  <span>website</span>
                  <strong>{selectedCard.website}</strong>
                </div>
              </div>

              <section className="intro-panel">
                <p className="insight-label">Intro suggestion</p>
                {introSummary ? (
                  <>
                    <h3>{introSummary.card.name}</h3>
                    <p>{introSummary.card.company}</p>
                    <ul className="mini-list">
                      {introSummary.sharedTags.length > 0 ? (
                        <li>共通タグ: {introSummary.sharedTags.join(', ')}</li>
                      ) : null}
                      {introSummary.sharedKeywords.length > 0 ? (
                        <li>共通キーワード: {introSummary.sharedKeywords.join(', ')}</li>
                      ) : null}
                      <li>{introSummary.card.nextAction}</li>
                    </ul>
                  </>
                ) : (
                  <p>まず1件選ぶと、紹介候補を自動で並べられます。</p>
                )}
              </section>

              <section className="relation-list">
                <div className="section-title">
                  <p className="insight-label">Relation notes</p>
                  <span>{selectedCard.relationNotes.length} items</span>
                </div>
                {selectedCard.relationNotes.map((note) => (
                  <div key={note} className="relation-item">
                    {note}
                  </div>
                ))}
              </section>

              <section className="suggestion-list">
                <div className="section-title">
                  <p className="insight-label">Other matches</p>
                  <span>top 3</span>
                </div>
                {matchingSuggestions.map((suggestion) => (
                  <article className="suggestion-item" key={suggestion.card.id}>
                    <div>
                      <strong>{suggestion.card.name}</strong>
                      <p>{suggestion.card.company}</p>
                    </div>
                    <div className="suggestion-meta">
                      <span>{suggestion.sharedTags.join(', ') || 'no shared tags'}</span>
                      <span>score {suggestion.score}</span>
                    </div>
                  </article>
                ))}
              </section>
            </>
          ) : (
            <div className="empty-state">
              <h3>カードを選ぶと詳細と紹介候補が出ます。</h3>
              <p>ローカル保存を使って、名刺を集めながら関係のメモを育てるMVPです。</p>
            </div>
          )}
        </aside>
      </main>

      <footer className="footer">
        <span>localStorage / responsive / future app ready</span>
        <span>scan -&gt; tag -&gt; graph -&gt; intro</span>
      </footer>
    </div>
  )
}

export default App
