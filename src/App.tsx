const FIGMA_ASSET_BASE_URL = '/assets/figma/'
const asset = (fileName: string) => `${FIGMA_ASSET_BASE_URL}${fileName}`

const assets = {
  heroStrip: asset('imgImage17'),
  portrait: asset('imgImage12'),
  portraitScribble: asset('imgImage13'),
  toolsDecoration: asset('imgImage7'),
  contactLeft: asset('imgImage20'),
  contactRight: asset('imgImage1'),
  brandMark: asset('imgImage10'),
  navAbout: asset('img2'),
  navWorks: asset('img6'),
  navContact: asset('img7'),
  headingAbout: asset('img1'),
  headingSkills: asset('img3'),
  headingTools: asset('img4'),
  headingWorks: asset('img5'),
  headingContact: asset('img8'),
} as const

type Skill = { iconSrc: string; name: string }
type Tool = { iconSrc: string; name: string; description: string }

const skills: Skill[] = [
  { iconSrc: asset('imgRectangle23'), name: 'HTML' },
  { iconSrc: asset('imgRectangle26'), name: 'CSS' },
  { iconSrc: asset('imgRectangle24'), name: 'Python' },
  { iconSrc: asset('imgRectangle25'), name: 'JavaScript' },
  { iconSrc: asset('imgRectangle27'), name: 'React' },
]

const tools: Tool[] = [
  { iconSrc: asset('imgImage3'), name: 'codex', description: '優秀な開発パートナー' },
  { iconSrc: asset('imgImage4'), name: 'zed', description: '軽量のAIエディター' },
  { iconSrc: asset('imgImage5'), name: 'linear', description: 'Issues管理サービス' },
  { iconSrc: asset('imgImage6'), name: 'ghostty', description: '拡張性の高いターミナル' },
  { iconSrc: asset('imgImage34'), name: 'obsidian', description: 'プロジェクト管理アプリ' },
]

function SectionTitle({ imageSrc, alt }: { imageSrc: string; alt: string }) {
  return <header className="section-title"><img src={imageSrc} alt={alt} /></header>
}

function App() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">本文へ移動</a>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="ページ上部へ"><img src={assets.brandMark} alt="Toma" /></a>
        <nav aria-label="メインナビゲーション">
          <a href="#about"><img src={assets.navAbout} alt="ABOUT" /></a>
          <a href="#works"><img src={assets.navWorks} alt="WORKS" /></a>
          <a href="#contact"><img src={assets.navContact} alt="CONTACT" /></a>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <img className="hero-strip" src={assets.heroStrip} alt="" />
          <h1 id="hero-title"><span>PORTFOLIO</span></h1>
          <a className="scroll-cue" href="#about">SCROLL TO EXPLORE <i>↓</i></a>
        </section>

        <section className="about section" id="about">
          <SectionTitle imageSrc={assets.headingAbout} alt="ABOUT" />
          <div className="about-grid">
            <div className="portrait-stage">
              <img className="portrait" src={assets.portrait} alt="上田冬真のポートレート作品" />
              <img className="scribble" src={assets.portraitScribble} alt="" />
              <p className="vertical-note">WHO AM I — WHO AM I — WHO AM I</p>
            </div>
            <div className="bio">
              <p className="label">Who am i</p>
              <p className="school">神山まるごと高専 2期生</p>
              <h3>上田 冬真 <span>ueda toma</span></h3>
              <p>AIを駆使するバイブコーディングエンジニア。ライフゲームやVLMなどを趣味で作っています。</p>
              <p>PC環境の開発やskill・pluginなど、Codexの最適化を業務や制作の効率化のために行っています。デザインやインタラクティブアートにも興味があります。</p>
              <div className="hobbies"><b>Hobby</b><span>ベースギター</span><span>原付旅</span><span>DAW</span><span>音楽視聴</span><span>麻雀</span><span>ロゴデザイン</span></div>
            </div>
          </div>
        </section>

        <section className="skills section" id="skills">
          <SectionTitle imageSrc={assets.headingSkills} alt="SKILLS" />
          <div className="skill-grid">{skills.map(({ iconSrc, name }) => <article className="skill" key={name}><img src={iconSrc} alt="" /><span>{name}</span></article>)}</div>
        </section>

        <section className="toolkit section" id="tools">
          <img className="tool-art" src={assets.toolsDecoration} alt="" />
          <SectionTitle imageSrc={assets.headingTools} alt="TOOLS" />
          <div className="tool-list">{tools.map(({ iconSrc, name, description }) => <article className="tool" key={name}><img src={iconSrc} alt="" /><div><h3>{name}</h3><p>{description}</p></div><span>↗</span></article>)}</div>
        </section>

        <section className="works section" id="works">
          <SectionTitle imageSrc={assets.headingWorks} alt="WORKS" />
          <div className="works-grid" aria-label="作品掲載予定枠">{[1, 2, 3, 4].map((number) => <div className="work-frame" key={number} aria-label={`作品 ${number} 掲載予定`} />)}</div>
        </section>

        <section className="contact section" id="contact">
          <img className="contact-art left" src={assets.contactLeft} alt="" /><img className="contact-art right" src={assets.contactRight} alt="" />
          <SectionTitle imageSrc={assets.headingContact} alt="CONTACT" />
          <a className="mail" href="mailto:kmc2406@kamiyama.ac.jp">kmc2406@kamiyama.ac.jp <span>↗</span></a>
          <a className="telephone" href="tel:07037903490">Tel: 070 - 3790 - 3490</a>
          <address>〒771-3310 徳島県名西郡神山町神領西上角175-1</address>
        </section>
      </main>
      <footer><span>© 2026 UEDA TOMA</span><a href="#top">BACK TO TOP ↑</a></footer>
    </div>
  )
}

export default App
