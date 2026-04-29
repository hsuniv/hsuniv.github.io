/* eslint-disable */
/* global React, ReactDOM */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ============== Bugi mascot (SVG) ============== */
function Bugi({ size = 200, blink = true }) {
  return (
    <svg viewBox="0 0 200 220" width={size} height={size * 1.1} aria-hidden="true">
      <defs>
        <linearGradient id="bg-body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="oklch(0.45 0.18 255)" />
          <stop offset="1" stopColor="oklch(0.30 0.18 258)" />
        </linearGradient>
        <linearGradient id="bg-belly" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="oklch(0.95 0.02 85)" />
          <stop offset="1" stopColor="oklch(0.88 0.03 85)" />
        </linearGradient>
      </defs>
      {/* feet */}
      <ellipse cx="78" cy="205" rx="14" ry="6" fill="oklch(0.78 0.16 65)" />
      <ellipse cx="122" cy="205" rx="14" ry="6" fill="oklch(0.78 0.16 65)" />
      {/* body */}
      <ellipse cx="100" cy="130" rx="78" ry="80" fill="url(#bg-body)" />
      {/* belly */}
      <ellipse cx="100" cy="148" rx="48" ry="55" fill="url(#bg-belly)" />
      {/* wing tufts */}
      <path d="M 28 130 Q 18 165 32 195 Q 48 175 50 145 Z" fill="oklch(0.32 0.18 258)" />
      <path d="M 172 130 Q 182 165 168 195 Q 152 175 150 145 Z" fill="oklch(0.32 0.18 258)" />
      {/* ear tufts */}
      <path d="M 50 60 L 60 30 L 75 60 Z" fill="oklch(0.30 0.18 258)" />
      <path d="M 150 60 L 140 30 L 125 60 Z" fill="oklch(0.30 0.18 258)" />
      {/* eye discs */}
      <circle cx="76" cy="100" r="26" fill="#fff" stroke="oklch(0.30 0.18 258)" strokeWidth="3" />
      <circle cx="124" cy="100" r="26" fill="#fff" stroke="oklch(0.30 0.18 258)" strokeWidth="3" />
      {/* glasses bridge */}
      <line x1="98" y1="100" x2="102" y2="100" stroke="oklch(0.30 0.18 258)" strokeWidth="3" />
      {/* pupils */}
      <circle cx="76" cy="102" r="9" fill="oklch(0.18 0.04 258)">
        {blink && <animate attributeName="ry" values="9;9;1;9;9" dur="5s" repeatCount="indefinite" />}
      </circle>
      <circle cx="124" cy="102" r="9" fill="oklch(0.18 0.04 258)">
        {blink && <animate attributeName="ry" values="9;9;1;9;9" dur="5s" repeatCount="indefinite" />}
      </circle>
      <circle cx="79" cy="99" r="3" fill="#fff" />
      <circle cx="127" cy="99" r="3" fill="#fff" />
      {/* beak */}
      <path d="M 92 125 L 100 138 L 108 125 Z" fill="oklch(0.78 0.16 65)" stroke="oklch(0.55 0.16 55)" strokeWidth="1.5" />
      {/* shield badge on belly */}
      <path d="M 100 150 L 84 156 L 84 170 Q 84 184 100 192 Q 116 184 116 170 L 116 156 Z" fill="oklch(0.42 0.18 255)" />
      <path d="M 92 168 L 98 174 L 110 162" stroke="oklch(0.86 0.17 92)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ============== Top Nav ============== */
function TopNav({ onSubscribe, theme, setTheme }) {
  return (
    <nav className="topnav">
      <div className="brand">
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
          <rect width="28" height="28" rx="7" fill="oklch(0.42 0.18 255)" />
          <path d="M 8 9 L 14 6 L 20 9 L 20 16 Q 20 21 14 23 Q 8 21 8 16 Z" fill="oklch(0.86 0.17 92)" />
          <path d="M 11 14 L 13.5 16.5 L 17.5 12" stroke="oklch(0.18 0.04 258)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>월요일의 보안부기 <small>· Hansung AX Frontier 2025</small></span>
      </div>
      <div className="nav-links">
        <a href="#problem">Problem</a>
        <a href="#solution">Solution</a>
        <a href="#preview">Newsletter</a>
        <a href="#demo">Live Demo</a>
        <a href="#tech">Tech</a>
        <a href="#team">Team</a>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          className="btn btn-ghost"
          style={{ padding: "8px 12px", fontSize: 12 }}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀ Light" : "☾ Dark"}
        </button>
        <button className="btn btn-primary" style={{ padding: "10px 16px", fontSize: 13 }} onClick={onSubscribe}>
          수신 신청 <span className="arrow">→</span>
        </button>
      </div>
    </nav>
  );
}

/* ============== Reveal hook ============== */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-stagger");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ============== Count-up ============== */
function CountUp({ end, duration = 1600, decimals = 0, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setVal(end * eased);
              if (t < 1) requestAnimationFrame(tick);
              else setVal(end);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [end, duration]);
  return (
    <span ref={ref} className="num">
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ============== Hero ============== */
function Hero({ onSubscribe }) {
  return (
    <section className="hero" id="hero">
      <div className="bg-grid" />
      <div className="hero-grid">
        <div className="reveal-stagger">
          <div className="hero-eyebrow"><span className="dot" /> AX FRONTIER CHALLENGE · 2025</div>
          <h1 className="hero-title">
            <span style={{ whiteSpace: "nowrap" }}>보안은 <span className="strike">어렵지만</span></span><br />
            <span style={{ whiteSpace: "nowrap" }}>보안<span className="em">부기</span>는 귀엽지.</span>
          </h1>
          <p className="lede">
            Claude AI가 매주 월요일 오전 9시,<br />
            한성대 교직원에게 <strong>알기 쉬운 보안 브리핑</strong>을 자동으로 배달합니다.
            <br />수집부터 발송까지 사람 손길 0회.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#preview">샘플 뉴스레터 보기 <span className="arrow">→</span></a>
            <button className="btn btn-ghost" onClick={onSubscribe}>수신 신청</button>
            <a className="btn btn-ghost" href="#demo">라이브 데모</a>
          </div>
          <div className="hero-meta">
            <div className="item"><div className="l">Team</div><div className="v">월요일의 보안부기</div></div>
            <div className="item"><div className="l">Cadence</div><div className="v">매주 월요일 09:00 · 연 52회</div></div>
            <div className="item"><div className="l">Powered by</div><div className="v">Claude Haiku 4.5 · Sonnet 4.5</div></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card hero-card-1">
            <div className="mini-letter-head">
              <span>[한성대 보안] 4월 첫째주</span>
              <span className="badge">AI</span>
            </div>
            <div className="mini-letter-body">
              <h5>비밀번호 '1234', 이제 그만 하세요</h5>
              <div className="row"><span className="n">01</span><span>인하대 학번·연락처 유출…2차 피해 발생</span></div>
              <div className="row"><span className="n">02</span><span>KISA, 신종 피싱 메일 주의보 발령</span></div>
              <div className="row"><span className="n">03</span><span>대학 행정 시스템 랜섬웨어 사례</span></div>
            </div>
          </div>
          <div className="hero-card hero-card-2">
            <div className="mini-letter-head" style={{ background: "oklch(0.86 0.17 92)", color: "oklch(0.18 0.04 258)" }}>
              <span>이번 주 체크포인트 #07</span>
              <span style={{ fontFamily: "var(--font-mono)" }}>MON</span>
            </div>
            <div className="mini-letter-body">
              <h5 style={{ marginBottom: 6 }}>오늘 받은 첨부파일,<br />보낸 사람에게 직접 확인 전화</h5>
              <p style={{ fontSize: 11, color: "var(--ink-mid)", margin: 0 }}>실제 행정직원 행동 지침 1줄. 매주 다른 항목.</p>
            </div>
          </div>
          <div className="hero-card hero-card-3" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 12 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--ink-mid)", letterSpacing: ".1em" }}>SOURCES</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 36, fontWeight: 800, color: "var(--hansung-blue)", lineHeight: 1, marginTop: 4 }}>11</div>
            <div style={{ fontSize: 10, color: "var(--ink-mid)" }}>RSS 피드</div>
          </div>
          <div className="hero-bugi"><Bugi size={180} /></div>
        </div>
      </div>
    </section>
  );
}

/* ============== Problem section ============== */
function Problem() {
  return (
    <section className="problem" id="problem">
      <div className="container">
        <div className="reveal">
          <div className="eyebrow">PROBLEM · 왜 지금인가</div>
          <h2 className="section-title" style={{ marginTop: 18, maxWidth: 920 }}>
            대학을 노리는 공격은 늘었지만,<br />
            보안 공지를 읽는 사람은 줄었습니다.
          </h2>
        </div>
        <div className="problem-stats reveal-stagger">
          <div className="stat-card">
            <div className="trend">YoY ↑</div>
            <div className="stat-num warn"><CountUp end={92} suffix="%" /></div>
            <h3>대학 대상 사이버 공격 시도</h3>
            <p>전년 대비 사이버 공격 시도가 92% 증가. 대학은 이제 1순위 표적입니다.</p>
          </div>
          <div className="stat-card">
            <div className="trend">READ RATE</div>
            <div className="stat-num danger"><CountUp end={15} suffix="%" /></div>
            <h3>보안 공지 정독률</h3>
            <p>전문 용어와 비정기 발송으로, 발송된 공지의 85%는 그냥 묻힙니다.</p>
          </div>
          <div className="stat-card">
            <div className="trend">PER WEEK</div>
            <div className="stat-num"><CountUp end={2} suffix="h" /></div>
            <h3>담당자의 수작업 시간</h3>
            <p>매주 보안 공지 작성에 평균 2시간. AI가 대신할 수 있는 일에 사람이 매달려 있습니다.</p>
          </div>
        </div>

        <div className="problem-three reveal-stagger">
          <div className="three-item">
            <div className="num">CAUSE 01</div>
            <h4>정보의 장벽</h4>
            <p>CVE 번호, 취약점 코드 등 기술 전문 용어 중심의 공지는 일반 행정직원에게 심리적 거리감을 만듭니다. 정보 습득 자체를 포기하게 만들어요.</p>
          </div>
          <div className="three-item">
            <div className="num">CAUSE 02</div>
            <h4>낮은 지속성</h4>
            <p>비정기적 발송은 인식이 형성되기 전에 휘발됩니다. 보안 습관은 반복적 노출을 통해서만 내재화됩니다.</p>
          </div>
          <div className="three-item">
            <div className="num">CAUSE 03</div>
            <h4>보안 불감증</h4>
            <p>"보안은 IT 담당자의 일"이라는 인식이 팽배. 정작 피싱·랜섬웨어 등 사용자 단계에서 막을 수 있는 공격에 무방비입니다.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============== Solution ============== */
function Solution() {
  return (
    <section className="solution" id="solution">
      <div className="solution-bg-glow" />
      <div className="container">
        <div className="reveal" style={{ maxWidth: 880 }}>
          <div className="eyebrow">SOLUTION · Zero-Touch Briefing System</div>
          <h2 className="section-title" style={{ marginTop: 18 }}>
            AI가 수집·번역·발송까지 끝냅니다.<br />
            담당자는 진짜 보안 일에 집중하세요.
          </h2>
          <p className="lede">
            국내·외 11개 보안 소스에서 지난 7일간의 기사를 자동 수집하고,
            Claude가 한성대 환경에 맞는 맥락으로 요약·번역해 매주 월요일 09:00에 자동 발송합니다.
            사람이 개입할 필요가 없는, 진짜 자동화된 보안 인식 시스템입니다.
          </p>
        </div>

        <div className="solution-features reveal-stagger">
          <div className="feature">
            <div className="ico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></svg>
            </div>
            <h4>11개 소스 자동 수집</h4>
            <p>KISA·KrCERT·CISA 등 국내외 RSS 피드를 매주 스캔. 대학·교육기관 관련 기사를 최우선 선별.</p>
          </div>
          <div className="feature">
            <div className="ico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M7 12h10M10 18h4" /></svg>
            </div>
            <h4>AI 관련성 필터</h4>
            <p>Claude Haiku가 채용·MOU·홍보 기사를 자동 제외. 진짜 위협만 남깁니다.</p>
          </div>
          <div className="feature">
            <div className="ico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h10M4 18h16" /><path d="M18 8l4 4-4 4" /></svg>
            </div>
            <h4>행정직원 눈높이 번역</h4>
            <p>Claude Sonnet이 CVE·취약점 코드를 일상 언어로. "왜 나에게 중요한가"의 맥락까지.</p>
          </div>
          <div className="feature">
            <div className="ico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
            </div>
            <h4>Gmail SMTP 자동 발송</h4>
            <p>매주 월요일 09:00 정시 발송. 금요일 오후 1시에 사전 점검 발송으로 이중 안전망.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Bugi = Bugi;
window.TopNav = TopNav;
window.useReveal = useReveal;
window.CountUp = CountUp;
window.Hero = Hero;
window.Problem = Problem;
window.Solution = Solution;
