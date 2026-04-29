/* eslint-disable */
const { useState: useState2, useEffect: useEffect2, useRef: useRef2, useMemo: useMemo2 } = React;

/* ============== Newsletter Preview (interactive 3-tab) ============== */
function NewsletterPreview() {
  const [tab, setTab] = useState2(0);
  const tabs = [
    { n: "01", label: "이번 주 보안 뉴스 5선" },
    { n: "02", label: "역대 대학 사고 사례" },
    { n: "03", label: "이번 주 체크포인트" },
  ];

  const news = [
    { rank: "01", title: "인하대학교 학번·연락처·주소 6.4만건 유출", summary: "관리자 페이지 우회 접근 → 학생 DB 덤프. 유출된 정보로 피싱 2차 피해 발생. 동일 구조의 행정 시스템 취약점 점검 필요.", src: "보안뉴스", tag: "대학보안" },
    { rank: "02", title: "KISA, '교육기관 사칭' 신종 피싱 메일 주의보", summary: "장학금·등록금 환급을 미끼로 한 가짜 로그인 페이지 유포. 한성대 도메인 유사 URL도 확인됨.", src: "KrCERT", tag: "피싱" },
    { rank: "03", title: "Microsoft Office 제로데이 (CVE-2025-XXXX) 패치", summary: ".docx 파일 열기만 해도 코드 실행 가능. 자동 업데이트 켜두면 자동 적용. 외부 메일의 첨부파일은 일단 의심.", src: "CISA", tag: "취약점" },
    { rank: "04", title: "랜섬웨어 그룹, 국내 사립대 다수 동시 공격 시도", summary: "백업 서버까지 암호화하는 신종 변종. 오프라인 백업 없으면 복구 불가. 분리 백업 정책 재점검 권고.", src: "데일리시큐", tag: "랜섬웨어" },
    { rank: "05", title: "교육부, 대학 정보보호 자율점검 가이드 v3 배포", summary: "학내 시스템 30개 항목 체크리스트 갱신. 한성대 자체 점검 일정에 반영 예정.", src: "보호나라", tag: "정책" },
  ];

  const cases = [
    { when: "2025.06", title: "인하대학교 개인정보 유출", cause: "관리자 페이지 인증 우회 취약점 방치", impact: "학번·연락처·주소 6.4만건 유출 → 피싱 2차 피해" },
    { when: "2024.11", title: "수도권 A사립대 랜섬웨어 감염", cause: "외부 협력업체 VPN 계정 탈취", impact: "행정 시스템 3일 마비, 복구비 약 2.4억" },
    { when: "2024.03", title: "지방 국립대 학사정보 유출", cause: "퇴직 직원 계정 권한 미회수", impact: "재학생 1.8만명 학적 정보 유출" },
    { when: "2023.09", title: "B대학 연구실 데이터 탈취", cause: "공용 PC 피싱 메일 첨부파일 실행", impact: "정부 R&D 과제 자료 외부 유출" },
  ];

  const checkpoint = {
    n: "07",
    label: "이번 주 보안 미션",
    title: "오늘 받은 첨부파일,\n보낸 사람에게 직접 확인 전화하기",
    body: "메일 본문에 적힌 번호 말고, 사내 디렉토리에서 찾은 번호로요. 피싱은 \"답장 메일\"보다 \"확인 전화\" 한 통에 더 약합니다.",
  };

  return (
    <section className="newsletter-preview" id="preview">
      <div className="container">
        <div className="reveal">
          <div className="eyebrow">NEWSLETTER · 매주 월요일 09:00 자동 발송</div>
          <h2 className="section-title" style={{ marginTop: 18, maxWidth: 920 }}>
            한 통 받으면 5분 안에 끝나는,<br />읽고 싶은 보안 레터.
          </h2>
          <p className="kicker" style={{ marginTop: 18, maxWidth: 720 }}>
            3단 구성으로 흥미와 행동 변화를 동시에. 탭을 눌러 직접 둘러보세요.
          </p>
        </div>

        <div className="reveal" style={{ display: "flex", justifyContent: "center" }}>
          <div className="nl-tabs">
            {tabs.map((t, i) => (
              <button key={i} className="nl-tab" data-active={tab === i} onClick={() => setTab(i)}>
                <span className="n">{t.n}</span> {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="reveal nl-frame">
          <div className="mail-chrome">
            <span className="lights"><span /><span /><span /></span>
            <span style={{ marginLeft: 10 }}>From: security@hansung.ac.kr · To: faculty@hansung.ac.kr</span>
            <span style={{ marginLeft: "auto" }}>Mon 09:00 KST</span>
          </div>
          <div className="nl-letter">
            <div className="nl-banner">
              <div className="week">2026 · APR · WEEK 01 · ISSUE #14</div>
              <h3>비밀번호 '1234', 이제 그만 하세요</h3>
              <div className="meta">
                <span>📨 한성대 IT인프라팀</span>
                <span>🤖 작성: Claude Sonnet 4.5</span>
                <span>⏱ 읽는 시간 약 4분</span>
              </div>
            </div>

            {tab === 0 && (
              <div className="nl-section first">
                <h4><span className="badge">①</span> 이번 주 보안 뉴스 5선</h4>
                {news.map((n, i) => (
                  <div className="news-item" key={i}>
                    <div className="rank">{n.rank}</div>
                    <div>
                      <div className="title">{n.title}</div>
                      <div className="summary">{n.summary}</div>
                      <span className="tag">#{n.tag}</span>
                    </div>
                    <div className="src">{n.src}</div>
                  </div>
                ))}
              </div>
            )}

            {tab === 1 && (
              <div className="nl-section first">
                <h4><span className="badge">②</span> 역대 대학 주요 보안 사고 사례</h4>
                <p style={{ fontSize: 13, color: "var(--ink-mid)", margin: "0 0 14px" }}>
                  "이건 남 얘기가 아닙니다" — 매주 다른 사례를 순환 제공합니다.
                </p>
                {cases.map((c, i) => (
                  <div className="case-card" key={i}>
                    <div className="when">{c.when}</div>
                    <h5>{c.title}</h5>
                    <div className="cause"><strong>원인 </strong>{c.cause}</div>
                    <div className="impact">→ {c.impact}</div>
                  </div>
                ))}
              </div>
            )}

            {tab === 2 && (
              <div className="nl-section first">
                <h4><span className="badge">③</span> 이번 주 보안 체크포인트</h4>
                <div className="checkpoint-card">
                  <div>
                    <div className="label">MISSION</div>
                    <div className="num-big">#{checkpoint.n}</div>
                  </div>
                  <div>
                    <div className="label">{checkpoint.label}</div>
                    <h5 style={{ whiteSpace: "pre-line" }}>{checkpoint.title}</h5>
                    <p>{checkpoint.body}</p>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "var(--ink-mid)", margin: "16px 0 0", fontFamily: "var(--font-mono)" }}>
                  · 12개 실천 항목을 매주 1개씩 순환 · 동일 항목 반복 방지 로테이션 시스템 적용
                </p>
              </div>
            )}

            <div className="nl-footer">
              <span>📞 IT인프라팀 김도광 주임 (내선 5689)</span>
              <span>발송 시스템 · Powered by Claude AI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============== Live AI Demo ============== */
function LiveDemo() {
  const sources = [
    { name: "한성대학교 게시판", count: 3, prio: "P1" },
    { name: "KISA 보호나라", count: 12, prio: "P2" },
    { name: "KrCERT", count: 8, prio: "P2" },
    { name: "보안뉴스", count: 24, prio: "P3" },
    { name: "데일리시큐", count: 18, prio: "P3" },
    { name: "Google뉴스 (교육부)", count: 9, prio: "P4" },
    { name: "Google뉴스 (대학 보안)", count: 14, prio: "P4" },
    { name: "Google뉴스 (사이버보안)", count: 31, prio: "P4" },
    { name: "CISA Advisories", count: 7, prio: "P5" },
    { name: "Google뉴스 (university security)", count: 11, prio: "P5" },
    { name: "Google뉴스 (해킹)", count: 19, prio: "P5" },
  ];

  const script = useMemo2(() => ([
    { type: "ts", text: "[09:00:00] " }, { type: "info", text: "fetch_news.py 시작 — 11개 RSS 소스 스캔 (지난 7일)\n" },
    { type: "ts", text: "[09:00:02] " }, { type: "ok", text: "✓ 한성대학교 게시판 → 3건 수집\n" },
    { type: "ts", text: "[09:00:04] " }, { type: "ok", text: "✓ KISA 보호나라 → 12건 수집\n" },
    { type: "ts", text: "[09:00:06] " }, { type: "ok", text: "✓ KrCERT → 8건 수집\n" },
    { type: "ts", text: "[09:00:09] " }, { type: "ok", text: "✓ 보안뉴스 → 24건 수집\n" },
    { type: "ts", text: "[09:00:12] " }, { type: "ok", text: "✓ 데일리시큐 → 18건 수집\n" },
    { type: "ts", text: "[09:00:18] " }, { type: "ok", text: "✓ CISA + Google News × 6 → 91건 수집\n" },
    { type: "ts", text: "[09:00:20] " }, { type: "info", text: "TOTAL: 156건 수집 완료\n\n" },
    { type: "ts", text: "[09:00:21] " }, { type: "ai", text: "▸ Claude Haiku 4.5 — 관련성 필터 시작\n" },
    { type: "ghost", text: "  · 채용 공고 12건 제외\n  · MOU 체결 7건 제외\n  · 제품 홍보·수상 18건 제외\n  · 관련성 낮음 27건 제외\n" },
    { type: "ts", text: "[09:00:34] " }, { type: "ok", text: "✓ 92건 → 23건 (필터링 완료)\n\n" },
    { type: "ts", text: "[09:00:35] " }, { type: "ai", text: "▸ Claude Sonnet 4.5 — 한성대 맥락 요약·번역\n" },
    { type: "ghost", text: "  · 대학·교육기관 관련성 기준 정렬\n  · CVE 번호 → 일상 언어 번역\n  · '왜 나에게 중요한가' 맥락 추가\n  · 행동 지침 1줄 생성\n" },
    { type: "ts", text: "[09:00:58] " }, { type: "ok", text: "✓ 보안 뉴스 5선 선정 완료\n" },
    { type: "ts", text: "[09:01:01] " }, { type: "ok", text: "✓ 사고 사례 #03 로드 (히스토리 회피)\n" },
    { type: "ts", text: "[09:01:02] " }, { type: "ok", text: "✓ 체크포인트 #07 로드 (12개 중 7번째)\n" },
    { type: "ts", text: "[09:01:04] " }, { type: "info", text: "build_newsletter.py — HTML 뉴스레터 생성\n" },
    { type: "ts", text: "[09:01:07] " }, { type: "ok", text: "✓ newsletter_2026W14.html 생성 (반응형)\n\n" },
    { type: "ts", text: "[09:01:08] " }, { type: "info", text: "send_email.py — Gmail SMTP 발송 시작\n" },
    { type: "ts", text: "[09:01:23] " }, { type: "ok", text: "✓ 수신자 1,247명 개별 발송 완료\n" },
    { type: "ts", text: "[09:01:24] " }, { type: "warn", text: "→ 발송 이력 history.json 업데이트\n" },
    { type: "ts", text: "[09:01:25] " }, { type: "ok", text: "✓ 전체 파이프라인 종료. 사람 개입: 0회.\n" },
    { type: "ai", text: "\n   다음 발송: 다음 주 월요일 09:00 (cron 예약됨)\n" },
  ]), []);

  const [step, setStep] = useState2(0);
  const [running, setRunning] = useState2(false);
  const [activeSrc, setActiveSrc] = useState2(-1);
  const [doneSrc, setDoneSrc] = useState2(-1);
  const termRef = useRef2(null);
  const intRef = useRef2(null);

  useEffect2(() => {
    if (!running) return;
    if (step >= script.length) { setRunning(false); return; }
    intRef.current = setTimeout(() => setStep((s) => s + 1), 280);
    if (step >= 2 && step <= 16) {
      const idx = Math.min(Math.floor((step - 2) / 2), sources.length - 1);
      setActiveSrc(idx);
      if (idx > 0) setDoneSrc(idx - 1);
    } else if (step > 16) { setDoneSrc(sources.length - 1); setActiveSrc(-1); }
    return () => clearTimeout(intRef.current);
  }, [running, step, script.length]);

  useEffect2(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [step]);

  const start = () => {
    if (running) return;
    setStep(0); setActiveSrc(-1); setDoneSrc(-1);
    setRunning(true);
  };
  const reset = () => {
    setRunning(false); setStep(0); setActiveSrc(-1); setDoneSrc(-1);
  };

  return (
    <section className="demo-section" id="demo">
      <div className="container">
        <div className="reveal" style={{ maxWidth: 880 }}>
          <div className="eyebrow">LIVE DEMO · 1분 26초 안에 끝나는 자동화</div>
          <h2 className="section-title" style={{ marginTop: 18 }}>
            "재생" 한 번만 누르면<br />파이프라인 전체가 보입니다.
          </h2>
          <p className="kicker" style={{ marginTop: 18, color: "oklch(0.78 0.02 258)" }}>
            매주 월요일 09:00, 실제 서버에서 일어나는 일을 그대로 시뮬레이션합니다.
          </p>
        </div>

        <div className="demo-grid">
          <div className="demo-input reveal">
            <h4 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>📡 11개 RSS 소스</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "oklch(0.65 0.04 258)", fontWeight: 500 }}>
                {doneSrc + 1}/{sources.length}
              </span>
            </h4>
            <div className="source-list">
              {sources.map((s, i) => (
                <div key={i} className={`source-row${activeSrc === i ? " active" : ""}${i <= doneSrc ? " done" : ""}`}>
                  <span className="dot" />
                  <span><span style={{ color: "oklch(0.55 0.04 258)", marginRight: 8 }}>{s.prio}</span><span className="name">{s.name}</span></span>
                  <span className="count">{i <= doneSrc || activeSrc === i ? `${s.count}건` : "—"}</span>
                </div>
              ))}
            </div>
            <div className="demo-controls">
              <button className="btn btn-primary" onClick={start} disabled={running} style={{ background: "var(--signal-yellow)", color: "var(--ink)" }}>
                {running ? "● Running…" : "▶ 파이프라인 실행"}
              </button>
              <button className="btn btn-ghost" onClick={reset} style={{ color: "#fff", borderColor: "oklch(0.40 0.04 258)" }}>↻ Reset</button>
            </div>
          </div>

          <div className="demo-output">
            <div className="term-head">
              <span className="lights"><span /><span /><span /></span>
              <span className="label">hs@security-server: ~/security_mail_sender — run_newsletter.py</span>
            </div>
            <div className="term-body" ref={termRef}>
              {script.slice(0, step).map((t, i) => (
                <span key={i} className={t.type === "ts" ? "ts" : t.type === "info" ? "info" : t.type === "ok" ? "ok" : t.type === "warn" ? "warn" : t.type === "ai" ? "ai" : "ghost"}>
                  {t.text}
                </span>
              ))}
              {running && step < script.length && <span className="cursor" />}
              {!running && step === 0 && (
                <span className="ghost">
                  $ python run_newsletter.py{"\n"}  (오른쪽 ▶ 버튼을 눌러 시작하세요){"\n"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============== Pipeline diagram ============== */
function Pipeline() {
  const steps = [
    { n: "STEP 01", title: "Collect", desc: "11개 RSS 피드에서 지난 7일 기사 자동 수집. 우선순위 P1~P5로 정렬.", tools: "feedparser · requests · bs4" },
    { n: "STEP 02", title: "Filter", desc: "Claude Haiku로 채용·MOU·홍보 자동 제외. 진짜 위협만 통과.", tools: "Claude Haiku 4.5" },
    { n: "STEP 03", title: "Compose", desc: "Claude Sonnet이 한성대 맥락으로 요약·번역. 행동 지침까지 생성.", tools: "Claude Sonnet 4.5" },
    { n: "STEP 04", title: "Deliver", desc: "Gmail SMTP로 수신자별 개별 발송. 발송 이력 JSON 기록.", tools: "smtplib · cron" },
  ];
  return (
    <section className="pipeline" id="pipeline">
      <div className="container">
        <div className="reveal">
          <div className="eyebrow">HOW IT WORKS · 4-STEP PIPELINE</div>
          <h2 className="section-title" style={{ marginTop: 18 }}>수집 → 필터 → 작성 → 발송, 끝.</h2>
        </div>
        <div className="pipeline-flow reveal-stagger">
          {steps.map((s, i) => (
            <div key={i} className="pipeline-step">
              <div className="step-n">{s.n}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
              <div className="tools">{s.tools}</div>
              <div className="arrow-r">→</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== Tech stack ============== */
function TechStack() {
  return (
    <section className="tech" id="tech">
      <div className="container">
        <div className="reveal">
          <div className="eyebrow">TECH STACK · Production-grade</div>
          <h2 className="section-title" style={{ marginTop: 18, maxWidth: 920 }}>
            Python 3개 모듈 + Claude API.<br />그게 전부입니다.
          </h2>
        </div>

        <div className="tech-grid">
          <div className="reveal">
            <div className="code-block">
              <div className="filename"><span className="lights"><span /><span /><span /></span>build_newsletter.py</div>
              <pre dangerouslySetInnerHTML={{ __html:
`<span class="cm"># Claude Haiku → 관련성 필터 (저비용·고속)</span>
<span class="kw">from</span> anthropic <span class="kw">import</span> Anthropic
<span class="kw">import</span> feedparser, json

client = Anthropic()

<span class="kw">def</span> <span class="fn">filter_relevant</span>(articles):
    prompt = <span class="str">f"""대학 보안과 무관한 기사를 제외하라.
    제외: 채용·MOU·홍보·수상
    유지: 실제 위협·정책·대학 사고
    {articles}"""</span>
    res = client.messages.create(
        model=<span class="str">"claude-haiku-4-5"</span>,
        max_tokens=<span class="num-c">2048</span>,
        messages=[{<span class="str">"role"</span>: <span class="str">"user"</span>,
                   <span class="str">"content"</span>: prompt}]
    )
    <span class="kw">return</span> json.loads(res.content[<span class="num-c">0</span>].text)

<span class="cm"># Claude Sonnet → 한성대 맥락 요약·번역</span>
<span class="kw">def</span> <span class="fn">compose_newsletter</span>(filtered):
    res = client.messages.create(
        model=<span class="str">"claude-sonnet-4-5"</span>,
        max_tokens=<span class="num-c">4096</span>,
        system=<span class="str">"한성대 행정직원 눈높이로 번역."</span>,
        messages=[{<span class="str">"role"</span>: <span class="str">"user"</span>,
                   <span class="str">"content"</span>: filtered}]
    )
    <span class="kw">return</span> render_html(res.content[<span class="num-c">0</span>].text)` }} />
            </div>
          </div>

          <div className="tech-stack-list reveal-stagger">
            <div className="tech-card">
              <div className="icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /></svg>
              </div>
              <div>
                <h5>Claude Haiku 4.5 <span className="ver">· Anthropic</span></h5>
                <p>저비용 고속. 156건 기사를 한 번에 묶어 관련성 필터링.</p>
              </div>
            </div>
            <div className="tech-card">
              <div className="icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 16 8-16M8 4l4 8 4-8" /></svg>
              </div>
              <div>
                <h5>Claude Sonnet 4.5 <span className="ver">· Anthropic</span></h5>
                <p>맥락 기반 요약·번역. CVE를 일상 언어로, 행동 지침까지.</p>
              </div>
            </div>
            <div className="tech-card">
              <div className="icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3h10l4 4v14H5z" /><path d="M14 3v5h5" /></svg>
              </div>
              <div>
                <h5>Python 3.11 + venv <span className="ver">· feedparser, bs4, anthropic</span></h5>
                <p>3개 모듈로 구성. fetch / build / send 책임 분리.</p>
              </div>
            </div>
            <div className="tech-card">
              <div className="icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="12" rx="1" /><path d="M3 8h18M8 20h8" /></svg>
              </div>
              <div>
                <h5>Rocky Linux 9.7 <span className="ver">· cron + venv</span></h5>
                <p>OS 스케줄러로 자동 실행. .env로 민감정보 분리 관리.</p>
              </div>
            </div>
            <div className="tech-card">
              <div className="icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 8l9 6 9-6" /></svg>
              </div>
              <div>
                <h5>Gmail SMTP <span className="ver">· 앱 비밀번호 인증</span></h5>
                <p>수신자별 개별 발송. 별도 메일 인프라 없이 운영 가능.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.NewsletterPreview = NewsletterPreview;
window.LiveDemo = LiveDemo;
window.Pipeline = Pipeline;
window.TechStack = TechStack;
