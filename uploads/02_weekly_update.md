# Workflow 02: 콘텐츠 주기적 업데이트

## 목표
- `data/faq.json` — 디지털정보처, 한성공지 게시판 신규/수정 게시글 반영
- `data/pages.json` — 홈페이지 정적 안내 페이지 재수집

## 실행 주기
매일 오전 6시 (cron, root 계정 등록)  
※ 테스트 기간 중 1시간 간격 추가 운영 중 (안정화 후 제거 예정)

## 단계

### 1. 게시판 FAQ 업데이트
```bash
venv/bin/python -u tools/crawl_faq.py
```

#### 게시판별 크롤링 전략 (BOARD_URLS 순서 기준)

| 순서 | 게시판 | board_no | 전략 | 이유 |
|------|--------|----------|------|------|
| 첫 번째 | IT 매뉴얼 (4016) | 1926 | **해시 비교** — 매번 전체 읽고, 내용 변경 시만 업데이트 | 수정일 표시 없음. 담당자가 직접 편집하는 공식 매뉴얼 |
| 나머지 | IT 보안공지 (4017), 전체공지 (6172) | 1927, 2127 | **날짜 비교** — 신규 게시글만 수집 | 공지사항 특성상 등록 후 수정 없음 |

- 6172 (전체공지): 최대 10페이지만 수집 (게시글 수 많음)

### 2. 홈페이지 정적 페이지 업데이트
```bash
venv/bin/python -u tools/crawl_pages.py
```
- 오늘 이미 수집한 페이지는 skip (하루 1회)
- 대상: IT서비스, IT인프라, 대학생활, 학사 안내, FAQ (21개 페이지)
- PAGE_ROOTS에 등록된 URL 기준으로 하위 서브메뉴까지 자동 수집

### 3. 통합전화부 (행정부서 연락처) 업데이트

```bash
venv/bin/python -u tools/parse_admin_staff.py
```

- 출처: 한성대 홈페이지 행정부서 전화번호 PDF 자동 다운로드 파싱
- 출력: `data/admin_staff_structured.json`
- 주기: **주 1회** (cron 등록, 매주 월요일 06:10)
- 수동 실행 시 서버 재시작 불필요 — 다음 질문부터 즉시 반영

PDF가 새 버전으로 교체되어도 **자동으로 최신 파일을 다운로드**함. (페이지에서 fileDown.do 링크를 동적 탐색)

---

### 4. 전체 재수집 (수동, 필요 시)
```bash
venv/bin/python -u tools/crawl_faq.py --force
venv/bin/python -u tools/crawl_pages.py --force
```
- `--force`: 모든 게시판/페이지 전략 무시하고 전체 재수집

### 4. 로컬 Windows PC에서 수동 실행

프로젝트 폴더에서 터미널(PowerShell 또는 명령 프롬프트) 열고 실행:

```cmd
cd C:\MyWorkPrj\04_worksplace\it-helphesk-bot

python tools/crawl_faq.py
python tools/crawl_pages.py
python tools/parse_admin_staff.py
```

전체 재수집 필요할 때:
```cmd
python tools/crawl_faq.py --force
python tools/crawl_pages.py --force
```

- 결과는 터미널에 바로 출력됨 (서버처럼 log 파일로 안 감)
- `data/faq.json`, `data/pages.json`, `data/admin_staff_structured.json` 업데이트됨
- 서버 재시작 불필요 — 다음 질문부터 자동 반영

> **서버 배포 전 데이터 미리 채우기**: 로컬에서 크롤링 후 `data/` 폴더를 서버에 올리면 서버에서 즉시 사용 가능.

---

### 5. 서버에서 직접 크롤링 (정상 운영) ✅ 2026-04-30~

서버 → hansung.ac.kr 네트워크 개통 완료. 서버에서 직접 크롤링 가능.

**수동 실행 (hs 계정):**
```bash
cd /opt/it-helpdesk-bot
venv/bin/python -u tools/crawl_faq.py
venv/bin/python -u tools/crawl_pages.py
```

> `-u` 옵션: 실시간 출력 확인용. 없어도 동작은 동일.

서버 재시작 없이 즉시 반영됨.

---

### 5. cron 설정 (Rocky Linux 배포 서버)

**계정: root** — crontab 편집 및 실행 모두 root로 해야 함.

```bash
su -
crontab -e
```

**현재 등록된 crontab:**
```
# it helpdesk ai bot crawaling. 20260410
0 6 * * * cd /opt/it-helpdesk-bot && venv/bin/python tools/crawl_faq.py >> logs/crawl.log 2>&1
5 6 * * * cd /opt/it-helpdesk-bot && venv/bin/python tools/crawl_pages.py >> logs/crawl.log 2>&1

# 통합전화부 (행정부서 연락처) — 주 1회 갱신 (매주 월요일 오전 6시 10분)
10 6 * * 1 cd /opt/it-helpdesk-bot && venv/bin/python tools/parse_admin_staff.py >> logs/crawl.log 2>&1

# 1시간 간격 (테스트 기간, 안정화 후 제거 예정) — :30/:35/:40으로 일간 크론(:00/:05/:10)과 겹침 방지
30 * * * * cd /opt/it-helpdesk-bot && venv/bin/python tools/crawl_faq.py >> logs/crawl.log 2>&1
35 * * * * cd /opt/it-helpdesk-bot && venv/bin/python tools/crawl_pages.py >> logs/crawl.log 2>&1
40 * * * 1 cd /opt/it-helpdesk-bot && venv/bin/python tools/parse_admin_staff.py >> logs/crawl.log 2>&1
```

> `40 * * * 1` — 월요일 매 시각 :40분 실행 (테스트 기간 중). 안정화 후 제거 예정.

**로그 확인:**
```bash
tail -100 /opt/it-helpdesk-bot/logs/crawl.log
```

### 6. 게시판 추가/제거 (FAQ)
**코드 수정 없이 `.env`의 `BOARD_URLS`만 편집하면 됩니다.**

```
# .env
BOARD_URLS=URL1,URL2,...
```

- 앞쪽 URL이 **우선순위 높음** (검색 결과에 먼저 반영)
- `https://hansung.ac.kr/info/{번호}/subview.do` 형태 입력
- board_no는 자동 추출됨 (직접 입력 불필요)

현재 설정:
```
BOARD_URLS=https://hansung.ac.kr/info/4016/subview.do,https://hansung.ac.kr/info/4017/subview.do
```

### 7. 홈페이지 정적 페이지 추가/제거
**코드 수정 없이 `.env`의 `PAGE_ROOTS`만 편집하면 됩니다.**

```
# .env
PAGE_ROOTS=URL1,URL2,URL3,...
```

- 각 URL은 수집하려는 섹션의 **첫 페이지** URL
- 해당 페이지와 같은 섹션의 서브메뉴 페이지까지 자동 수집
- 한성대 홈페이지에서 원하는 메뉴로 들어간 후 주소표시줄의 URL 복사

예시:
```
PAGE_ROOTS=https://www.hansung.ac.kr/hansung/6298/subview.do,https://www.hansung.ac.kr/hansung/6338/subview.do,https://www.hansung.ac.kr/hansung/6225/subview.do
```

## 예외 처리

| 문제 | 해결 |
|------|------|
| FAQ 크롤링 0건 | 게시판 URL/구조 변경 확인 → `crawl_faq.py` 선택자 수정 |
| pages 특정 페이지 내용 없음 | 해당 URL 직접 확인 → `crawl_pages.py`의 선택자 보완 |
| 검색 품질 저하 | `search_faq.py`의 `SYNONYMS` 동의어 테이블 보완 |
