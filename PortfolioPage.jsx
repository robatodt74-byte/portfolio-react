import { useState } from "react";
import "./PortfolioPage.css";

import profilePhoto from "./profile-photo.png";
import workAiLab from "./work-ai-lab-shot.png";
import workDcon from "./work-dcon-shot.png";
import workSortViewer from "./work-sort-viewer-shot.png";
import workLifeGame from "./work-life-game-shot.png";

// インタラクションや技術的な動きの実装にはAIを活用し、レイアウトや内容は手動で確認・調整しました。
const skillCodingIcons = [
  { src: "https://cdn.simpleicons.org/c?viewbox=auto", alt: "C" },
  { src: "https://cdn.simpleicons.org/python?viewbox=auto", alt: "Python" },
  { src: "https://cdn.simpleicons.org/javascript?viewbox=auto", alt: "JavaScript" },
  { src: "https://cdn.simpleicons.org/typescript?viewbox=auto", alt: "TypeScript" },
  { src: "https://cdn.simpleicons.org/html5?viewbox=auto", alt: "HTML5" },
  { src: "https://cdn.simpleicons.org/css?viewbox=auto", alt: "CSS" },
  { src: "https://cdn.simpleicons.org/react?viewbox=auto", alt: "React" },
];

const skillDesignIcons = [
  { src: "https://cdn.simpleicons.org/figma?viewbox=auto", alt: "Figma" },
  { src: "https://cdn.simpleicons.org/adobeillustrator?viewbox=auto", alt: "Adobe Illustrator" },
  { src: "https://cdn.simpleicons.org/adobephotoshop?viewbox=auto", alt: "Adobe Photoshop" },
  { src: "https://cdn.simpleicons.org/adobexd?viewbox=auto", alt: "Adobe XD" },
];

const skillOtherIcons = [
  { label: "Zed", src: "https://zed.dev/_next/static/media/logo-new-white.0gnyg5qr0_x6r.png", className: "service-icon service-icon--zed" },
  { label: "GitHub", src: "https://cdn.simpleicons.org/github?viewbox=auto", className: "service-icon" },
  { label: "Ghostty", src: "https://cdn.simpleicons.org/ghostty?viewbox=auto", className: "service-icon" },
  { label: "Obsidian", src: "https://cdn.simpleicons.org/obsidian?viewbox=auto", className: "service-icon" },
  { label: "Linear", src: "https://cdn.simpleicons.org/linear?viewbox=auto", className: "service-icon" },
];

const serviceItems = [
  {
    name: "codex",
    icon: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/codex-openai/default.svg",
  },
  {
    name: "zed",
    icon: "https://zed.dev/_next/static/media/logo-new-white.0gnyg5qr0_x6r.png",
  },
  {
    name: "linear",
    icon: "https://cdn.simpleicons.org/linear?viewbox=auto",
  },
  {
    name: "ghostty",
    icon: "https://cdn.simpleicons.org/ghostty?viewbox=auto",
  },
  {
    name: "obsidian",
    icon: "https://cdn.simpleicons.org/obsidian?viewbox=auto",
  },
];

const works = [
  {
    name: "AI lab.",
    image: workAiLab,
    categories: ["AI", "Web"],
    tags: ["AI", "Prompt", "Workflow"],
    background: "生成AIを使った制作の再現性と改善点を検証するための実験プロジェクト。",
    role: "企画、プロンプト設計、検証フローの整理",
    result: "試行内容を比較できるワークフローとして整理",
    learning: "AIの出力だけでなく、検証条件と判断基準を残す重要性",
  },
  {
    name: "DCON",
    image: workDcon,
    categories: ["Web"],
    tags: ["Pitch", "Prototype", "Teamwork"],
    background: "チームでアイデアを形にし、短時間で伝わる提案へまとめるプロジェクト。",
    role: "プロトタイプ制作と発表内容の構成",
    result: "議論したアイデアを画面と資料で共有できる形に整理",
    learning: "チームの視点を揃えるには、早い段階で触れるものを作ることが有効",
  },
  {
    name: "sort_viewer",
    image: workSortViewer,
    categories: ["Learning", "Web"],
    tags: ["Visualization", "Education", "Web App"],
    background: "ソートアルゴリズムの動きを見て理解できる学習用Webアプリ。",
    role: "UI設計、アニメーション実装、学習導線の調整",
    result: "アルゴリズムの比較を操作しながら確認できる画面を制作",
    learning: "複雑な処理ほど、状態変化を視覚化すると説明しやすくなる",
  },
  {
    name: "Life_game",
    image: workLifeGame,
    categories: ["Game", "Learning"],
    tags: ["Simulation", "Playful", "Logic"],
    background: "セルの増減ルールを観察しながら遊べるライフゲームのシミュレーション。",
    role: "ルール実装、操作設計、見た目の調整",
    result: "初期状態を変えながら変化を観察できる体験を実装",
    learning: "小さなルールでも、操作とフィードバックがあると学びにつながる",
  },
];

const workFilters = ["All", "AI", "Web", "Learning", "Game"];

function buildMailtoUrl(formData) {
  const name = formData.get("name")?.toString().trim() || "Anonymous";
  const email = formData.get("email")?.toString().trim() || "(not provided)";
  const message = formData.get("message")?.toString().trim() || "(no message)";
  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  return `mailto:kmc2406@kamiyama.ac.jp?subject=${subject}&body=${body}`;
}

export default function PortfolioPage() {
  const [activeWorkFilter, setActiveWorkFilter] = useState("All");
  const filteredWorks = works.filter(
    (work) => activeWorkFilter === "All" || work.categories.includes(activeWorkFilter),
  );

  function handleContactSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    window.location.href = buildMailtoUrl(formData);
  }

  return (
    <div className="page" id="top">
      <div className="shell">
        <header className="topbar">
          <a className="mark" href="#top" aria-label="トップへ戻る">
            <span className="mark-badge">UT</span>
            <span>Ueda Toma</span>
          </a>
          <nav className="nav" aria-label="ページ内リンク">
            <a href="#profile">About</a>
            <a href="#skills">Skills</a>
            <a href="#works">Works</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <main>
          <section className="hero anchor" aria-label="Hero">
            <div className="hero-copy">
              <p className="eyebrow">Portfolio / MVP</p>
              <h1 className="hero-title">UEDA TOMA</h1>
              <p className="hero-subtitle">自分のしたい開発を、技術とデザインの両面から形にする。</p>
              <div className="hero-actions">
                <a className="button button--accent" href="#works">
                  See Works
                </a>
                <a className="button" href="#contact">
                  Contact
                </a>
              </div>
            </div>

            <aside className="hero-panel" aria-label="Profile preview">
              <img src={profilePhoto} alt="Profile portrait preview" />
              <div className="hero-panel-foot">
                <span>Profile / Intro</span>
                <span>01</span>
              </div>
            </aside>
          </section>

          <section className="section anchor" id="overview" aria-label="Overview">
            <div className="section-head">
              <div>
                <p className="section-kicker">Overview</p>
              </div>
            </div>

            <div className="overview-grid">
              <article className="overview-card profile-card">
                <div className="profile-media">
                  <img src={profilePhoto} alt="上田冬真のプロフィールカード" />
                </div>
                <div className="profile-meta">
                  <h3>Profile</h3>
                </div>
              </article>

              <article className="overview-card banner-card" id="data-science">
                <h3>Why Data Science ?</h3>
                <div className="banner-visual" aria-hidden="true">
                  <img
                    className="banner-image"
                    src="https://picsum.photos/seed/portfolio-data-science/1400/900"
                    alt=""
                  />
                  <span className="glow" />
                </div>
                <div className="banner-copy">
                  <div className="badge-grid">
                    <span className="badge badge--warm">Visualize</span>
                    <span className="badge">Analyze</span>
                    <span className="badge">Explain</span>
                  </div>
                </div>
              </article>

              <article className="overview-card">
                <h3>Skills</h3>
                <div className="icon-grid" aria-label="Skills">
                  {skillCodingIcons.map((icon) => (
                    <img key={icon.alt} className="brand-icon" src={icon.src} alt={icon.alt} />
                  ))}
                </div>
              </article>
            </div>
          </section>

          <section className="section anchor" id="profile">
            <div className="section-head">
              <div>
                <p className="section-kicker">Profile</p>
                <h2 className="section-title">Who am I</h2>
              </div>
            </div>

            <div className="content-grid">
              <article className="dark-card about-figure">
                <div className="about-photo">
                  <img src={profilePhoto} alt="上田冬真のプロフィール写真" />
                </div>
                <div className="about-copy">
                  <h3>上田 冬真</h3>
                  <ul className="fact-list">
                    <li>
                      <strong>Interest</strong>
                      <span>エンジニアリング / デザイン / 生成AI / ものづくり</span>
                    </li>
                    <li>
                      <strong>Style</strong>
                      <span>まずは MVP を作って、見せ方と改善点を早く掴む</span>
                    </li>
                    <li>
                      <strong>Focus</strong>
                      <span>読みやすい UI、伝わる説明、継続しやすい作業導線</span>
                    </li>
                  </ul>
                </div>
              </article>

              <article className="dark-card">
                <h3 className="section-title section-title--compact">Why Data Science ?</h3>
                <div className="banner-visual banner-visual--compact" style={{ marginTop: 18 }}>
                  <img
                    className="banner-image"
                    src="https://picsum.photos/seed/portfolio-workflow/1200/800"
                    alt=""
                  />
                  <span className="glow" />
                </div>
              </article>
            </div>
          </section>

          <section className="section anchor" id="skills">
            <div className="section-head">
              <div>
                <p className="section-kicker">Skills</p>
                <h2 className="section-title">coding / design</h2>
              </div>
            </div>

            <div className="content-grid">
              <article className="dark-card skill-group">
                <div className="skill-block">
                  <h3>Coding</h3>
                  <div className="icon-row">
                    {skillCodingIcons.map((icon) => (
                      <img key={icon.alt} className="brand-icon" src={icon.src} alt={icon.alt} />
                    ))}
                  </div>
                </div>
                <div className="skill-block">
                  <h3>Design</h3>
                  <div className="icon-row">
                    {skillDesignIcons.map((icon) => (
                      <img key={icon.alt} className="brand-icon" src={icon.src} alt={icon.alt} />
                    ))}
                  </div>
                </div>
              </article>

              <article className="dark-card skill-group">
                <div className="skill-block">
                  <h3>Other</h3>
                  <div className="icon-row">
                    {skillOtherIcons.map((icon) => (
                      <img
                        key={icon.label}
                        className={icon.className}
                        src={icon.src}
                        alt={icon.label}
                      />
                    ))}
                  </div>
                </div>
                <div className="skill-block">
                  <h3>What I care about</h3>
                </div>
              </article>
            </div>
          </section>

          <section className="section anchor" id="tools">
            <div className="section-head">
              <div>
                <p className="section-kicker">Tools</p>
                <h2 className="section-title">everyday stack</h2>
              </div>
            </div>

            <div className="content-grid">
              <article className="dark-card tools-card">
                <ul className="tools-list">
                  {serviceItems.map((item) => (
                    <li key={item.name}>
                      <div className="tool-mark" aria-hidden="true">
                        <img className="service-icon" src={item.icon} alt="" />
                      </div>
                      <div>
                        <strong>{item.name}</strong>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section className="section anchor" id="works">
            <div className="section-head">
              <div>
                <p className="section-kicker">Works</p>
                <h2 className="section-title">selected projects</h2>
              </div>
              <div className="filter-bar" role="tablist" aria-label="Works filter">
                {workFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={`filter-button${activeWorkFilter === filter ? " is-active" : ""}`}
                    aria-pressed={activeWorkFilter === filter}
                    onClick={() => setActiveWorkFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="works-grid">
              {filteredWorks.map((work) => (
                <article className="work-card" key={work.name}>
                  <figure>
                    <img src={work.image} alt={`${work.name} project`} />
                    <figcaption>
                      <h3>{work.name}</h3>
                      <dl className="work-details">
                        <div><dt>Background</dt><dd>{work.background}</dd></div>
                        <div><dt>My role</dt><dd>{work.role}</dd></div>
                        <div><dt>Result</dt><dd>{work.result}</dd></div>
                        <div><dt>Learning</dt><dd>{work.learning}</dd></div>
                      </dl>
                      <div className="tag-row">
                        {work.tags.map((tag) => (
                          <span className="tag" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </figcaption>
                  </figure>
                </article>
              ))}
            </div>
          </section>

          <section className="section anchor" id="contact">
            <div className="section-head">
              <div>
                <p className="section-kicker">Contact</p>
                <h2 className="section-title">Let’s talk</h2>
              </div>
            </div>

            <div className="contact-wrap">
              <article className="contact-card">
                <h3>CONTACT</h3>
                <div className="contact-lines">
                  <div>
                    <strong>Tel</strong>: 070 - 3790 - 3490
                  </div>
                  <div>
                    <strong>Mail</strong>: kmc2406@kamiyama.ac.jp
                  </div>
                  <div>
                    <strong>addr</strong>: 〒771-3310 徳島県名西郡神山町神領西上角175-1
                  </div>
                </div>

                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <input className="input-line" type="text" name="name" placeholder="Name" aria-label="Name" />
                  <input className="input-line" type="email" name="email" placeholder="Email" aria-label="Email" />
                  <textarea className="input-box" name="message" placeholder="Message" aria-label="Message" />
                  <button className="contact-submit button button--accent" type="submit">
                    Send
                  </button>
                </form>
              </article>
            </div>
          </section>
        </main>

        <footer className="footer">
          <span className="accent-mark">UT</span> Ueda Toma Portfolio
        </footer>
      </div>
    </div>
  );
}
