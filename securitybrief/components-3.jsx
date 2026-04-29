/* eslint-disable */
const { useState: useState3, useEffect: useEffect3 } = React;

/* ============== Effects (impact numbers) ============== */
function Effects() {
  return (
    <section className="effects" id="effects">
      <div className="container">
        <div className="reveal">
          <div className="eyebrow">IMPACT · 정량 / 정성 효과</div>
          <h2 className="section-title" style={{ marginTop: 18 }}>
            숫자로 보는 변화.
          </h2>
        </div>

        <div className="effects-grid reveal-stagger">
          <div className="effect-card">
            <div className="lab">담당자 업무 시간</div>
            <div className="from-to"><s>주 2시간</s> → <strong>0분</strong></div>
            <div className="big">−<window.CountUp end={100} suffix="%" /></div>
            <h4>완전 자동화</h4>
            <p>매주 보안 공지 작성 시간이 0이 됩니다.</p>
          </div>
          <div className="effect-card">
            <div className="lab">정기 보안 교육 횟수</div>
            <div className="from-to"><s>연 1~2회</s> → <strong>연 52회</strong></div>
            <div className="big"><window.CountUp end={52} suffix="회" /></div>
            <h4>매주 정기화</h4>
            <p>비정기 → 매주 월요일 09:00 정기화.</p>
          </div>
          <div className="effect-card">
            <div className="lab">정보 도달률</div>
            <div className="from-to"><s>포털 열람</s> → <strong>이메일 푸시</strong></div>
            <div className="big"><window.CountUp end={100} suffix="%" /></div>
            <h4>전 교직원 직접 도달</h4>
            <p>찾아오는 공지 → 배달되는 레터.</p>
          </div>
          <div className="effect-card">
            <div className="lab">콘텐츠 다양성</div>
            <div className="from-to">사고 사례 7 + 체크포인트 12</div>
            <div className="big"><window.CountUp end={19} suffix="종" /></div>
            <h4>로테이션 시스템</h4>
            <p>같은 항목 반복 없는 5개월치 콘텐츠.</p>
          </div>
        </div>

        <div className="qual-block reveal">
          <h4>정성적 효과</h4>
          <ul className="qual-list">
            <li><span className="check">✓</span><span>기술 용어 없는 콘텐츠로 일반 행정직원의 보안 인식 실질적 향상</span></li>
            <li><span className="check">✓</span><span>실제 대학 사고 사례 중심으로 "나도 당할 수 있다"는 경각심 형성</span></li>
            <li><span className="check">✓</span><span>매주 한 가지 실천 지침으로 보안 습관의 점진적 내재화</span></li>
            <li><span className="check">✓</span><span>피싱·랜섬웨어 등 사용자 행동 기반 공격 예방으로 사고 감소</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ============== Roadmap ============== */
function Roadmap() {
  const phases = [
    {
      phase: "PHASE 01 · NOW",
      title: "교직원 대상 정착",
      desc: "한성대 전 교직원 대상 매주 월요일 자동 발송. 안정화 단계.",
      items: ["전 교직원 대상 발송", "수신 동의 기반 운영", "운영 매뉴얼 v1 배포"],
    },
    {
      phase: "PHASE 02 · 2026 H2",
      title: "학생 맞춤 레터 + 채널 확장",
      desc: "학생 대상 별도 큐레이션 + 네이버 웍스 메신저 봇 연동.",
      items: ["학생용 콘텐츠 분기", "메신저 봇 연동", "수신함별 톤·예시 차별화"],
    },
    {
      phase: "PHASE 03 · 2027",
      title: "타 대학 오픈소스화",
      desc: "MIT 라이선스로 공개. 대학별 .env만 수정해 즉시 도입 가능한 표준 모델.",
      items: ["GitHub 공개 저장소", "도입 가이드 문서", "대학 정보보호 컨소시엄 제안"],
    },
  ];
  return (
    <section className="roadmap" id="roadmap">
      <div className="container">
        <div className="reveal">
          <div className="eyebrow">ROADMAP · 다음 단계</div>
          <h2 className="section-title" style={{ marginTop: 18 }}>한성대를 넘어 모든 대학으로.</h2>
        </div>
        <div className="road-grid reveal-stagger">
          {phases.map((p, i) => (
            <div className="road-card" key={i}>
              <span className="phase">{p.phase}</span>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
              <ul>{p.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== Team ============== */
function Team() {
  const members = [
    { initial: "KD", name: "김도광 주임", role: "PLANNING & ARCHITECTURE", dept: "IT인프라팀", desc: "보안 콘텐츠 큐레이션과 시스템 설계. Python 모듈 아키텍처와 Claude API 통합을 책임집니다.", id: "130236" },
    { initial: "SH", name: "심형준", role: "OPERATIONS & TESTING", dept: "IT인프라팀", desc: "Rocky Linux 서버 배포·운영과 발송 안정성 테스트. cron 스케줄링과 이중 안전망을 보장합니다.", id: "420397" },
  ];
  return (
    <section className="team" id="team">
      <div className="container">
        <div className="reveal">
          <div className="eyebrow">TEAM · 월요일의 보안부기</div>
          <h2 className="section-title" style={{ marginTop: 18 }}>
            보안 레터 배달왔습니다 🦉📨
          </h2>
          <p className="kicker" style={{ marginTop: 18, maxWidth: 720 }}>
            한성대학교 IT인프라팀 3인이 만든 Zero-Touch 보안 인식 시스템.
          </p>
        </div>
        <div className="team-grid reveal-stagger">
          {members.map((m, i) => (
            <div className="team-card" key={i}>
              <div className="avatar">{m.initial}</div>
              <h4>{m.name}</h4>
              <div className="role">{m.role}</div>
              <p style={{ marginTop: 6, fontSize: 12.5, color: "var(--fg-soft)", fontFamily: "var(--font-mono)" }}>{m.dept} · ID {m.id}</p>
              <p>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== FAQ ============== */
function FAQ() {
  const items = [
    { q: "AI가 잘못된 정보를 보내면 어쩌죠?", a: "이중 안전망 구조입니다. 금요일 오후 1시에 사전 점검용 발송이 담당자에게만 먼저 가고, 오류 확인 후 월요일 오전 9시에 본 발송이 나갑니다. 또한 Claude Sonnet은 출처 기사 링크를 항상 함께 첨부하므로 원문 확인이 가능합니다." },
    { q: "수신을 원하지 않으면 어떻게 하나요?", a: "수신자 목록은 .env 파일에서 관리되며, 담당자에게 메일 한 통이면 즉시 제외됩니다. 향후 자동 구독 해제 링크도 푸터에 추가될 예정입니다." },
    { q: "운영 비용은 얼마나 드나요?", a: "Claude API 비용은 주당 약 $0.30 수준 (월 $1.5 미만). Gmail SMTP는 무료. 별도 서버 인프라 비용 없음 (기존 Rocky Linux 서버 활용). 연간 $20 미만으로 운영 가능합니다." },
    { q: "한성대 외 다른 대학도 도입할 수 있나요?", a: "네. .env 파일의 수신자 목록과 담당자 정보만 바꾸면 즉시 도입 가능한 구조로 설계했습니다. PHASE 03에서 MIT 라이선스 오픈소스로 공개할 계획입니다." },
    { q: "기사 출처 11개는 고정인가요?", a: "tools/fetch_news.py의 FEEDS 목록만 수정하면 추가·제거가 가능합니다. RSS 표준만 지원하면 어떤 소스든 추가할 수 있습니다." },
    { q: "발송이 실패하면 알 수 있나요?", a: "발송 로그는 /opt/security_mail_sender/newsletter.log에 기록되며, SMTP 인증 실패·API 오류·뉴스 0건 등 주요 실패 케이스에 대한 운영 가이드가 함께 제공됩니다." },
  ];
  const [open, setOpen] = useState3(0);
  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="reveal" style={{ textAlign: "center" }}>
          <div className="eyebrow">FAQ · 자주 묻는 질문</div>
          <h2 className="section-title" style={{ marginTop: 18 }}>궁금하실 만한 것들.</h2>
        </div>
        <div className="faq-list reveal">
          {items.map((it, i) => (
            <div key={i} className="faq-item" data-open={open === i}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{it.q}</span>
                <span className="ico">+</span>
              </button>
              <div className="faq-a">{it.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== Final CTA ============== */
function FinalCTA({ onSubscribe }) {
  return (
    <section className="final-cta">
      <div className="container">
        <div className="reveal">
          <div className="eyebrow" style={{ color: "var(--signal-yellow)" }}>GET STARTED · 함께해요</div>
          <h2 className="section-title" style={{ marginTop: 18 }}>
            다음 월요일 09시,<br />
            보안부기를 받아보세요.
          </h2>
          <p>샘플 레터를 직접 받아보거나, 발표 자료를 다운로드하거나, 코드를 둘러보세요.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={onSubscribe}>📨 샘플 레터 받기 <span className="arrow">→</span></button>
            <a className="btn btn-ghost" href="#" onClick={(e) => { e.preventDefault(); alert("발표 자료 PDF는 GitHub Releases에 업로드 예정입니다."); }}>📄 발표 자료 PDF</a>
            <a className="btn btn-ghost" href="#" onClick={(e) => { e.preventDefault(); alert("GitHub 저장소는 PHASE 03(2027) 공개 예정입니다."); }}>⌘ GitHub 저장소</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============== Subscribe Modal ============== */
function SubscribeModal({ open, onClose }) {
  const [email, setEmail] = useState3("");
  const [done, setDone] = useState3(false);
  useEffect3(() => { if (!open) { setEmail(""); setDone(false); } }, [open]);
  return (
    <div className="modal-backdrop" data-open={open} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {!done ? (
          <>
            <h3>📨 샘플 레터 받아보기</h3>
            <p>이메일 주소를 알려주시면 다음 월요일 09:00 샘플 레터를 보내드립니다. (가상 폼 — 실제 발송은 운영 시작 후)</p>
            <label htmlFor="modal-email">이메일</label>
            <input id="modal-email" type="email" placeholder="name@hansung.ac.kr" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={onClose}>취소</button>
              <button className="btn btn-primary" onClick={() => email && setDone(true)}>신청하기 →</button>
            </div>
          </>
        ) : (
          <>
            <h3>✓ 신청이 완료되었어요!</h3>
            <p>{email} 으로 다음 월요일 09:00에 보안부기가 찾아갑니다.<br />그 전엔 샘플 레터를 페이지에서 둘러보세요.</p>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={onClose}>닫기</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ============== Footer ============== */
function Footer() {
  return (
    <footer>
      <div>© 2025 월요일의 보안부기 · 한성대학교 IT인프라팀</div>
      <div>제1회 한성 AX 프론티어 챌린지 · Powered by Claude AI</div>
    </footer>
  );
}

window.Effects = Effects;
window.Roadmap = Roadmap;
window.Team = Team;
window.FAQ = FAQ;
window.FinalCTA = FinalCTA;
window.SubscribeModal = SubscribeModal;
window.Footer = Footer;
