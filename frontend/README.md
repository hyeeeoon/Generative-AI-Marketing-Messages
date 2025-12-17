# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


src/                                   # 리액트 소스 코드 루트
├── components/                        # 공통 UI 컴포넌트 폴더 (여러 페이지에서 재사용)
│   ├── Layout/                        # 전체 앱 레이아웃 담당 폴더 (사이드바+헤더+본문)
│   │   ├── Layout.js                  # 레이아웃 구현(공통 배치 구성)
│   │   ├── Layout.module.css          # 레이아웃 전용 스타일(CSS 모듈)
│   │   └── index.js                   # Layout 컴포넌트 export
│   ├── Sidebar/                       # 사이드바 UI/네비게이션 컴포넌트
│   │   ├── Sidebar.js                 # 사이드바 실제 UI, 메뉴 렌더링
│   │   ├── Sidebar.module.css         # 사이드바만 사용하는 스타일(CSS Module)
│   │   └── index.js                   # Sidebar export
│   ├── Header/                        # 상단 헤더 UI 컴포넌트
│   │   ├── Header.js                  # 헤더 UI/알림 등 구현
│   │   ├── Header.module.css          # 헤더 전용 스타일
│   │   └── index.js                   # Header export
│   ├── ChartComponent/                # 대시보드의 그래프, 차트 컴포넌트
│   │   ├── ChartComponent.js          # Chart.js 등으로 실제 차트 렌더링
│   │   └── index.js                   # ChartComponent export
│   ├── MenuItem/                      # 사이드바 내 개별 메뉴 버튼 컴포넌트
│   │   ├── MenuItem.js                # 개별 메뉴 아이템(아이콘+텍스트, 클릭 라우팅)
│   │   └── index.js                   # MenuItem export
│   ├── Common/                        # 버튼, 입력폼 등 다양한 공통 UI
│   │   ├── Button.js                  # 재사용 Button 컴포넌트
│   │   ├── Input.js                   # 재사용 입력폼 컴포넌트
│   │   └── index.js                   # Common export
├── pages/                             # 실제 화면 단위, 라우터 연결 기준
│   └── Admin/                         
│   │   ├── AdminSettingsPage.jsx      # 시스템설정 화면
│   │   ├── AdminSettingsPage.css      # 
│   │   ├── AdminUsers.jsx             # 사용자 관리
│   │   └── AdminUsers.css
│   ├── Auth/                          # 로그인/회원가입/권한 관리 관련 페이지
│   │   ├── LoginView.jsx              # 로그인 레이아웃 + 단계 전환 (실제로 보이는 전체 로그인 화면)
│   │   ├── LoginPage.jsx              # 로그인 권한 선택 화면 (역할 선택 페이지)
│   │   ├── LoginForm.jsx              # 실제 로그인 폼 (아이디/비번 입력)
│   │   ├── LogoutPage.jsx             # 로그아웃 화면/기능
│   │   │── SignupPage.jsx             # 회원가입 화면/기능
│   │   ├── Login.module.css           # 레이아웃 + 페이지 공통 스타일  # (LoginView, LoginPage 에서 사용)
│   │   ├── SignupPage.css             # 회원가입 전용 스타일         # (SignupPage 디자인)
│   │   └── LoginForm.css              # 로그인 폼 전용 스타일        # (LoginForm 디자인)
│   │                                
│   ├── Messages/                      # AI 자동 메시징 관리 페이지
│   │   ├── 
│   │   ├── MessageCreatePage.js       # 메시지 생성(AI 요청 포함)
│   │   └── MessageCreatePage.css
│   │ 
│   ├── HomePage.jsx                   # 메인 페이지
│   ├── HomePage.css                   
│   ├── HistoryTrackerPage.jsx         # 클릭률 가입률 수동 전환 페이지 
│   ├── History.jsx                    # 전송 이력
│   ├── Manager.jsx                    # 비용/효율관리
│   ├── NoticeBoard.css                 
│   ├── NoticeBoard.jsx                # 공지사항
│   ├── Performance.jsx                # 나의 성과
│   └── TeamPerformance.jsx            # 팀 성과 분석
│
├── assets/                            # 이미지, 폰트 등 정적 리소스
│   └── kt_logo.png                    # 예시 이미지(사이드바 로고 등)
│
├── App.js                             # 전체 앱 루트 컴포넌트(레이아웃+라우팅)
├── index.js                           # React DOM 진입점, App 렌더링
└── gemini.js                          # AI 프롬프트 