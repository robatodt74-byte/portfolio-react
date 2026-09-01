type Project = {
  number: string
  title: string
  category: string
  description: string
}

const projects: Project[] = [
  { number: '01', title: 'BUSINESS CARD ATLAS', category: 'PRODUCT / FRONTEND', description: '名刺から、人と人のつながりをたどる。' },
  { number: '02', title: 'MOTION EXPERIMENTS', category: 'VISUAL / RESEARCH', description: '粒子と余白で、画面に温度をつくる。' },
]

const services = ['FRONTEND DEVELOPMENT', 'API INTEGRATION', 'INTERACTIVE MOTION DESIGN', 'PRODUCT PROTOTYPING']

function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Toma Ueda home">[ TU ]</a>
        <span className="header-title">PERSONAL DEVELOPMENT PORTFOLIO</span>
        <span className="header-status">● ONLINE</span>
      </header>

      <main id="top">
        <section className="hero section-frame" aria-labelledby="hero-title">
          <div className="hero-topline"><span>TOMA / CREATIVE DEVELOPER</span><span>2026—09—01</span></div>
          <div className="hero-grid">
            <div className="hero-portrait" aria-hidden="true">
              <img src="/assets/figma/imgImage25" alt="" />
              <span className="portrait-label">[ 001 ]<br />STUDY / SELF</span>
            </div>
            <div className="hero-copy">
              <p className="eyebrow">/ DESIGNER &amp; DEVELOPER</p>
              <h1 id="hero-title">TOMA<br /><span>UEDA</span></h1>
              <p className="hero-summary">自分のしたい開発を、<br />自分の手でかたちにする。</p>
              <p className="hero-location">/ BASED IN TOKYO, JAPAN<br />/ ALWAYS LEARNING</p>
            </div>
          </div>
          <nav className="keyboard-nav" aria-label="ページナビゲーション">
            <a href="#top"><kbd>⌂</kbd><span>HOME</span></a>
            <a href="#biography"><kbd>↑</kbd><span>BIOGRAPHY</span></a>
            <a href="#projects"><kbd>→</kbd><span>PROJECTS</span></a>
            <a href="#services"><kbd>↓</kbd><span>SERVICES</span></a>
            <a href="#contact"><kbd>©</kbd><span>CONTACT</span></a>
          </nav>
        </section>

        <section id="biography" className="section-frame editorial-section">
          <div className="section-title"><span>01 / BIOGRAPHY</span><span>↓</span></div>
          <div className="bio-grid">
            <h2>自分のしたい<br /><span>開発を。</span></h2>
            <div className="bio-copy">
              <p className="bio-lead">DESIGNER &amp; DEVELOPER<br />FOCUSED ON MAKING.</p>
              <p>こんにちは、上田冬真です。興味を持ったことを、自分で調べて、つくって、使ってみる。その繰り返しから、Webサイトやインタラクションを生み出しています。</p>
              <p>完成された答えを探すより、試しながら自分なりの形を見つけることが好きです。</p>
            </div>
          </div>
        </section>

        <section id="projects" className="section-frame editorial-section">
          <div className="section-title"><span>02 / PROJECTS</span><span>↓</span></div>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-row" key={project.number}>
                <span className="project-code">[./] {project.number}</span>
                <div className="project-name"><h3>{project.title}</h3><p>{project.category}</p><span className="project-description">{project.description}</span></div>
                <a href="#contact" className="visit-link">CONTACT ME <span>↗</span></a>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="section-frame editorial-section services-section">
          <div className="section-title"><span>03 / SERVICES</span><span>↓</span></div>
          <div className="services-layout">
            <p className="service-intro">[ WHAT I LIKE TO BUILD ]</p>
            <div className="service-list">{services.map((service, index) => <p key={service}><span>— 0{index + 1}</span>{service}<b>↗</b></p>)}</div>
          </div>
        </section>

        <section id="contact" className="section-frame editorial-section contact-section">
          <div className="section-title"><span>04 / CONTACT</span><span>↓</span></div>
          <div className="contact-content">
            <h2>LET&apos;S MAKE<br /><span>SOMETHING.</span></h2>
            <a className="contact-email" href="mailto:kmc2406@kamiyama.ac.jp">kmc2406@kamiyama.ac.jp <span>↗</span></a>
          </div>
        </section>
      </main>

      <footer className="site-footer section-frame"><span>© 2026 TOMA UEDA</span><span>BUILT WITH CURIOSITY</span><a href="#top">↑ BACK TO TOP</a></footer>
    </div>
  )
}

export default App
