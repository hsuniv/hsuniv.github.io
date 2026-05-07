# Workflow 04: Rocky Linux 운영서버 배포

## 환경 (확정)
- **서버 IP**: 220.66.103.42
- **도메인**: help.hansung.ac.kr
- **OS**: Rocky Linux 9.7 (Blue Onyx), x86_64
- **계정**: hs (sudo 없음) / root (별도 전환)
- **인증서**: 와일드카드 (*.hansung.ac.kr) — FTP로 직접 업로드
- **구성**: Apache(443) → gunicorn Flask(5001) 역방향 프록시
- **Python**: 프로젝트별 venv — 기존 /opt/security_mail_sender 크론잡과 완전 분리
- **서버 외부 인터넷**: 정상 개통 (2026-04-30). hansung.ac.kr 포함 전체 접근 가능. 크롤링 cron 정상 운영 중.

---

## 실제 배포 절차 (2026-04-10 완료)

### 1. Apache 설치

root 계정에서:

```bash
dnf install -y httpd mod_ssl
systemctl enable httpd
systemctl start httpd
systemctl status httpd
```

→ `active (running)`, `listening on: port 443, port 80` 확인

---

### 2. SSL 인증서 업로드 및 배치

인증서 파일 4개를 FTP로 `/home/hs/ssl_202512/` 에 업로드:

| 파일명 | 용도 |
|--------|------|
| `cert_wildcard.hansung.ac.kr.crt` | 서버 인증서 |
| `prv_wildcard.hansung.ac.kr_no_passwd.key` | 개인키 (패스워드 없음) |
| `subca1_wildcard.hansung.ac.kr.crt` | 중간 CA |
| `rootca_wildcard.hansung.ac.kr.crt` | 루트 CA |

root에서 정식 위치로 이동:

```bash
cp /home/hs/ssl_202512/cert_wildcard.hansung.ac.kr.crt /etc/pki/tls/certs/
cp /home/hs/ssl_202512/prv_wildcard.hansung.ac.kr_no_passwd.key /etc/pki/tls/private/
cp /home/hs/ssl_202512/subca1_wildcard.hansung.ac.kr.crt /etc/pki/tls/certs/
cp /home/hs/ssl_202512/rootca_wildcard.hansung.ac.kr.crt /etc/pki/tls/certs/

# 중간CA + 루트CA 체인 파일 생성
cat /etc/pki/tls/certs/subca1_wildcard.hansung.ac.kr.crt \
    /etc/pki/tls/certs/rootca_wildcard.hansung.ac.kr.crt \
    > /etc/pki/tls/certs/chain_wildcard.hansung.ac.kr.crt

# 개인키 권한 강화
chmod 600 /etc/pki/tls/private/prv_wildcard.hansung.ac.kr_no_passwd.key
```

---

### 3. 프로젝트 파일 업로드

FTP로 `/home/hs/it-helphesk-bot/` (오타 주의: helphesk) 에 업로드:

**올려야 하는 것:**
```
app.py
requirements.txt
tools/          (폴더 전체)
static/         (폴더 전체)
data/           (it_services.json, departments.txt 등 수동 관리 파일만 — faq.json/pages.json/question_log.jsonl 제외)
```

**올리면 안 되는 것:**
```
.gitignore
cert.pem / key.pem              (서버에서 안 씀)
workflows/                      (참고용 문서, 불필요)
__pycache__/
data/question_log.jsonl         ⚠️  덮어쓰면 서버 질문 로그 유실
data/faq.json                   (크론 자동 생성)
data/pages.json                 (크론 자동 생성)
data/synonyms.json              ⚠️  덮어쓰면 서버에서 AI가 학습한 동의어 + 관리자 수동 등록 유실
                                    (최초 배포 시에는 서버에 없으므로 앱 시작 시 자동 생성됨 — 업로드 불필요)
data/learned_synonyms.json      (구버전 파일 — 더 이상 사용 안 함, synonyms.json으로 통합됨)
```

**별도 업로드 (민감 파일):**
```
.env                          → /home/hs/it-helphesk-bot/.env
private_20260410104134.key    → /home/hs/it-helphesk-bot/ (또는 직접 /opt/으로)
```

root에서 /opt/ 로 이동 (폴더 중첩 주의):

```bash
cp -r /home/hs/it-helphesk-bot /opt/it-helpdesk-bot

# 폴더 중첩됐으면 정리
mv /opt/it-helpdesk-bot/it-helphesk-bot/* /opt/it-helpdesk-bot/
mv /opt/it-helpdesk-bot/it-helphesk-bot/.env /opt/it-helpdesk-bot/.env
rm -rf /opt/it-helpdesk-bot/it-helphesk-bot

ls /opt/it-helpdesk-bot/
# app.py  claude.md  data  private_20260410104134.key  requirements.txt  static  tools  workflows
```

---

### 4. 가상환경 생성 및 패키지 설치

root에서:

```bash
cd /opt/it-helpdesk-bot
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install pyjwt
pip install cryptography==41.0.7   # 버전 고정 필수 (최신 버전 오류)
pip install gunicorn
deactivate
```

> Rocky Linux 9에서는 cryptography 최신 버전이 정상 동작함.  
> Windows에서는 41.0.7 고정 필요 (DLL 문제).

---

### 5. data 폴더 권한 설정

크롤링 결과 파일을 hs 계정으로 올리거나 업데이트하려면:

```bash
chown -R hs:hs /opt/it-helpdesk-bot/data
mkdir -p /opt/it-helpdesk-bot/logs
chown hs:hs /opt/it-helpdesk-bot/logs
```

---

### 6. systemd 서비스 등록

```bash
cat > /etc/systemd/system/it-helpdesk-bot.service << 'EOF'
[Unit]
Description=IT Helpdesk Bot (Flask)
After=network.target

[Service]
User=root
WorkingDirectory=/opt/it-helpdesk-bot
Environment="PATH=/opt/it-helpdesk-bot/venv/bin"
ExecStart=/opt/it-helpdesk-bot/venv/bin/gunicorn \
    --bind 127.0.0.1:5001 \
    --workers 2 \
    --timeout 60 \
    app:app
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable it-helpdesk-bot
systemctl start it-helpdesk-bot
systemctl status it-helpdesk-bot
```

→ `active (running)`, `Listening at: http://127.0.0.1:5001` 확인

---

### 7. Apache 가상호스트 설정

```bash
cat > /etc/httpd/conf.d/it-helpdesk-bot.conf << 'EOF'
# HTTP → HTTPS 리다이렉트
<VirtualHost *:80>
    ServerName help.hansung.ac.kr
    Redirect permanent / https://help.hansung.ac.kr/
</VirtualHost>

# HTTPS → Flask 프록시
<VirtualHost *:443>
    ServerName help.hansung.ac.kr

    SSLEngine on
    SSLCertificateFile    /etc/pki/tls/certs/cert_wildcard.hansung.ac.kr.crt
    SSLCertificateKeyFile /etc/pki/tls/private/prv_wildcard.hansung.ac.kr_no_passwd.key
    SSLCertificateChainFile /etc/pki/tls/certs/chain_wildcard.hansung.ac.kr.crt

    ProxyPreserveHost On
    ProxyPass        / http://127.0.0.1:5001/
    ProxyPassReverse / http://127.0.0.1:5001/

    ErrorLog  /var/log/httpd/it-helpdesk-bot-error.log
    CustomLog /var/log/httpd/it-helpdesk-bot-access.log combined
</VirtualHost>
EOF

apachectl configtest   # Syntax OK 확인
systemctl reload httpd
```

---

### 8. SELinux 설정 (핵심)

Apache가 내부 Flask(5001)로 프록시하려면 SELinux 허용 필요:

```bash
setsebool -P httpd_can_network_connect 1
systemctl reload httpd
```

> 이 설정 없으면 `curl https://127.0.0.1/` 시 **503 Service Unavailable** 발생.

---

### 9. 방화벽 설정

```bash
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

> 서버 OS 방화벽 외에 **네트워크 방화벽(L3/L4)** 별도 존재.  
> 담당자에게 220.66.103.42:443 인바운드 허용 요청 필요했음.

---

### 10. 동작 확인

```bash
# Flask 직접 확인 (서버 내부)
curl http://127.0.0.1:5001/api/health

# Apache HTTPS 확인 (서버 내부)
curl -k https://127.0.0.1/api/health

# 외부 도메인 확인
curl https://help.hansung.ac.kr/api/health

# 콜백 시뮬레이션
curl -k -X POST https://help.hansung.ac.kr/callback \
  -H "Content-Type: application/json" \
  -d '{"type":"message","source":{"userId":"test"},"content":{"type":"text","text":"웹메일 로그인이 안돼요"}}'
```

---

## 트러블슈팅 기록 (실제 발생)

| 문제 | 원인 | 해결 |
|------|------|------|
| Apache 503 | SELinux가 httpd → 5001 프록시 차단 | `setsebool -P httpd_can_network_connect 1` |
| 외부 접근 불가 | 네트워크 방화벽(L3) 차단 | 방화벽 담당자에게 443 인바운드 허용 요청 |
| 크롤링 실패 `No route to host` | DMZ 구성으로 서버 → hansung.ac.kr 차단 (Google 등 일반 인터넷은 가능) | ✅ 2026-04-30 네트워크 개통으로 해결. 현재 정상 운영 중. |
| DNS 미적용 | help.hansung.ac.kr DNS 등록 후 전파 지연 | 약 1시간 후 자동 해결 |
| 폴더 중첩 | cp 시 폴더 안에 폴더로 복사됨 | mv로 정리 후 rmdir |

---

---

## 관리자 페이지 `/hsmgmt` 설정

### 접속 방식 비교

| 환경 | 접속 경로 | 인증 |
|------|----------|------|
|  개발 (Windows) | `http://localhost:5001/hsmgmt` | 없음 (Flask 직접) |
| 운영 서버 | `https://help.hansung.ac.kr/hsmgmt` | Apache Basic Auth + IP 제한 |

### 1. Apache 설정 추가

'root로 사용

`/etc/httpd/conf.d/it-helpdesk-bot.conf` 의 `<VirtualHost *:443>` 블록 안 **ProxyPass 라인 위에** 추가:

```apache
<Location /hsmgmt>
    AuthType Basic
    AuthName "한성대학교 관리시스템"
    AuthUserFile /etc/httpd/.hsmgmt_passwd
    <RequireAll>
        Require valid-user
        Require ip 220.66.102 220.66.103
    </RequireAll>
</Location>
```

> **주의**: `Require ip` 와 `Require valid-user` 를 `<RequireAll>` 로 감싸야 둘 다 만족해야 접근 허용됨.  
> `<RequireAny>` 로 쓰면 IP OR 비번 중 하나만 맞아도 들어올 수 있음.

### 2. 계정 관리 (`.hsmgmt_passwd`)

```bash
# 최초 생성 + 첫 계정 (-c: 파일 신규 생성, 기존 파일 있으면 덮어씀 주의!)
htpasswd -c -B /etc/httpd/.hsmgmt_passwd hs_mgr

# 계정 추가 (파일 이미 있을 때 — -c 없이)
htpasswd -B /etc/httpd/.hsmgmt_passwd another_user

# 비밀번호 변경 (계정 있으면 덮어씀)
htpasswd -B /etc/httpd/.hsmgmt_passwd hs_mgr

# 계정 삭제
htpasswd -D /etc/httpd/.hsmgmt_passwd hs_mgr

# 등록 계정 목록 확인 (비밀번호는 해시로만 표시됨)
cat /etc/httpd/.hsmgmt_passwd
```

> `-B`: bcrypt 해시. 파일명·계정명에 "admin" 사용 금지.

### 3. 적용

```bash
apachectl configtest    # Syntax OK 확인
systemctl reload httpd
```

### 4. 동작 확인

```bash
# 교내 IP에서: 인증 다이얼로그 표시 → 정상
curl -k https://help.hansung.ac.kr/hsmgmt

# 잘못된 자격증명: 401 반환 확인
curl -k -u wrong:pass https://help.hansung.ac.kr/hsmgmt

# 올바른 자격증명: 200 + HTML 반환 확인
curl -k -u hs_mgr:비밀번호 https://help.hansung.ac.kr/hsmgmt
```

---

## 남은 작업

### 1. 네이버 웍스 Callback URL 등록
Developer Console → Bot 탭 → Callback URL:
```
https://help.hansung.ac.kr/callback
```
> 네이버 웍스 서버 → 220.66.103.42:443 인바운드 방화벽 허용 필요 (담당자 확인)

### 2. 크롤링 cron 운영 현황 ✅ 정상 운영 중 (2026-04-30~)

서버 → hansung.ac.kr 네트워크 개통 완료. 서버에서 직접 크롤링 가능.

**계정: root** (crontab 등록 계정)  
**실행 계정: hs** (수동 실행 시, `/opt/it-helpdesk-bot` 전체 소유자)

**현재 crontab (root 계정):**
```
# it helpdesk ai bot crawaling. 20260410
0 6 * * * cd /opt/it-helpdesk-bot && venv/bin/python tools/crawl_faq.py >> logs/crawl.log 2>&1
5 6 * * * cd /opt/it-helpdesk-bot && venv/bin/python tools/crawl_pages.py >> logs/crawl.log 2>&1

# 1시간 간격 (테스트 기간, 안정화 후 제거 예정)
0 * * * * cd /opt/it-helpdesk-bot && venv/bin/python tools/crawl_faq.py >> logs/crawl.log 2>&1
5 * * * * cd /opt/it-helpdesk-bot && venv/bin/python tools/crawl_pages.py >> logs/crawl.log 2>&1

# IT서비스 담당 연락처 자동 업데이트 (매주 월요일 새벽 6시 10분)
10 6 * * 1 cd /opt/it-helpdesk-bot && venv/bin/python tools/crawl_it_services.py >> logs/crawl.log 2>&1

# 질문 로그 90일 보관 정리 (매일 새벽 3시)
0 3 * * * cd /opt/it-helpdesk-bot && venv/bin/python tools/log_cleanup.py >> logs/crawl.log 2>&1
```

**crontab 편집:**
```bash
su -
crontab -e
```

**크롤링 로그 확인:**
```bash
tail -100 /opt/it-helpdesk-bot/logs/crawl.log
```

**수동 실행 (hs 계정):**
```bash
cd /opt/it-helpdesk-bot
venv/bin/python -u tools/crawl_faq.py
venv/bin/python -u tools/crawl_pages.py
```

---

## 서버 재기동 후 복구 절차

서버가 재부팅되면 systemd 등록된 서비스는 자동 시작됨.
하지만 정상 동작 확인은 직접 해야 함.

### 1. 서비스 상태 확인 (root)

```bash
systemctl status it-helpdesk-bot
systemctl status httpd
```

둘 다 `active (running)` 이면 정상. 바로 6번으로 이동.

### 2. Flask 서비스가 안 떠있으면

```bash
systemctl start it-helpdesk-bot
systemctl status it-helpdesk-bot
```

그래도 안 되면 로그 확인:
```bash
journalctl -u it-helpdesk-bot -n 50
```

### 3. Apache가 안 떠있으면

```bash
systemctl start httpd
apachectl configtest   # 설정 오류 확인
systemctl status httpd
```

### 4. SELinux 설정 확인 (재기동 후에도 유지되지만 혹시 모르니)

```bash
getsebool httpd_can_network_connect
# httpd_can_network_connect --> on  이어야 정상
```

off면:
```bash
setsebool -P httpd_can_network_connect 1
```

### 5. 방화벽 확인

```bash
firewall-cmd --list-services
# http https 포함되어 있어야 정상
```

없으면:
```bash
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

### 6. 동작 최종 확인

```bash
# Flask 직접 확인
curl http://127.0.0.1:5001/api/health

# Apache 통해 확인
curl -k https://127.0.0.1/api/health

# 외부 도메인 확인
curl https://help.hansung.ac.kr/api/health
```

모두 `{"status":"ok",...}` 응답 오면 정상.

---

## 코드 업데이트 반영 절차

로컬 PC에서 코드를 수정한 뒤 서버에 반영하는 절차.

### 변경 파일 종류별 처리 방법

| 파일 종류 | 서비스 재시작 필요 여부 |
|-----------|------------------------|
| `app.py`, `tools/*.py` | **필요** |
| `hsmgmt/routes.py` | **필요** |
| `static/` (HTML, CSS, JS) | **필요** (Flask가 정적 파일 서빙) |
| `data/faq.json`, `data/pages.json` | 불필요 (즉시 반영) |
| `data/synonyms.json` | ⚠️ 업로드 금지 — 서버 학습 내용 유실됨 |

---

### 1단계 — FTP로 서버에 직접 업로드

FTP가 `/opt/it-helpdesk-bot/` 에 직접 접근 가능하므로 해당 경로에 바로 업로드.

변경된 파일만 올려도 되고, 전체 올려도 됨:
```
.env                 → /opt/it-helpdesk-bot/.env          ← BOARD_URLS 등 설정 변경 시 반드시 포함
tools/crawl_faq.py   → /opt/it-helpdesk-bot/tools/crawl_faq.py
tools/search_faq.py  → /opt/it-helpdesk-bot/tools/search_faq.py
tools/works_api.py   → /opt/it-helpdesk-bot/tools/works_api.py
static/index.html    → /opt/it-helpdesk-bot/static/index.html
static/style.css     → /opt/it-helpdesk-bot/static/style.css
static/chat.js       → /opt/it-helpdesk-bot/static/chat.js
hsmgmt/routes.py     → /opt/it-helpdesk-bot/hsmgmt/routes.py
static/hsmgmt.css    → /opt/it-helpdesk-bot/static/hsmgmt.css
static/hsmgmt.js     → /opt/it-helpdesk-bot/static/hsmgmt.js
app.py               → /opt/it-helpdesk-bot/app.py
# ⚠️  data/ 폴더 업로드 금지 — 서버 크론이 모두 자동 생성·갱신함
#     question_log.jsonl 덮어쓰면 질문 로그 유실, faq.json/pages.json은 크론 담당
```

---

### 2단계 — 서비스 재시작 (코드 변경 시만, root 필요)

```bash
su -
systemctl restart it-helpdesk-bot
systemctl status it-helpdesk-bot
```

→ `active (running)` 확인

---

### 3단계 — 동작 확인

```bash
# Flask 직접 확인
curl http://127.0.0.1:5001/api/health

# 외부 도메인 확인
curl https://help.hansung.ac.kr/api/health
```

`{"status":"ok",...}` 응답 오면 정상.

---

### 빠른 참고 — 자주 쓰는 업데이트 시나리오

**시나리오 A: tools/*.py 또는 app.py 수정 후**
1. FTP로 /opt/it-helpdesk-bot/tools/ (또는 루트) 에 직접 업로드
2. `su -` → root 전환
3. `systemctl restart it-helpdesk-bot`

**시나리오 B: static/ 파일 수정 후 (HTML, CSS, JS)**
1. FTP로 /opt/it-helpdesk-bot/static/ 에 직접 업로드
2. `su -` → root 전환
3. `systemctl restart it-helpdesk-bot`

**시나리오 C: faq.json / pages.json 갱신 (크롤링 결과)**
1. 로컬에서 크롤링 실행: `python tools/crawl_faq.py --force`
2. FTP로 /opt/it-helpdesk-bot/data/ 에 직접 업로드
3. 재시작 불필요 — 즉시 반영됨

**시나리오 D: 관리자 페이지(hsmgmt) 수정 후**
1. FTP로 변경 파일 업로드:
   - `hsmgmt/routes.py` → /opt/it-helpdesk-bot/hsmgmt/routes.py
   - `static/hsmgmt.css` → /opt/it-helpdesk-bot/static/hsmgmt.css
   - `static/hsmgmt.js` → /opt/it-helpdesk-bot/static/hsmgmt.js
2. `su -` → root 전환
3. `systemctl restart it-helpdesk-bot`
4. ⚠️ `data/synonyms.json` 은 절대 업로드하지 않음 (서버 AI 학습 내용 유실)

---

## 서비스 관리 명령어

```bash
# 상태 확인
systemctl status it-helpdesk-bot
systemctl status httpd

# 재시작
systemctl restart it-helpdesk-bot
systemctl reload httpd

# 로그 확인
journalctl -u it-helpdesk-bot -n 50 -f
tail -f /var/log/httpd/it-helpdesk-bot-error.log
tail -f /opt/it-helpdesk-bot/data/question_log.jsonl
```
