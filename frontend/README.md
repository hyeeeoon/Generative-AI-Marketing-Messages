# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

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
│   ├── Auth/                          # 로그인/회원가입/권한 관리 관련 페이지
│   │   ├── LoginPage.js               # 로그인 화면
│   │   └── LogoutPage.js              # 로그아웃 화면/기능
│   ├── Dashboard/                     # 데이터 요약, 시각화 대시보드
│   │   └── DashboardPage.js           # 대시보드 메인페이지
│   ├── Customers/                     # 고객 CRUD + 상세 정보, 히스토리
│   │   ├── CustomersListPage.js       # 고객 리스트 조회 화면
│   │   ├── CustomerDetailPage.js      # 고객 상세 정보 페이지
│   │   └── CustomerCreatePage.js      # 신규 고객 생성 페이지
│   ├── Services/                      # 서비스/요금제 기능 페이지
│   │   ├── ServiceListPage.js         # 서비스 리스트 화면
│   │   ├── ServiceDetailPage.js       # 서비스 상세 정보
│   │   └── ServiceCreatePage.js       # 신규 서비스 등록 페이지
│   ├── Segments/                      # 고객 분류/세그먼트 기능 페이지
│   │   ├── SegmentListPage.js         # 세그먼트 목록
│   │   ├── SegmentDetailPage.js       # 세그먼트 상세
│   │   └── SegmentCreatePage.js       # 신규 세그먼트 생성
│   ├── Messages/                      # AI 자동 메시징 관리 페이지
│   │   ├── MessageListPage.js         # 메시지 목록 조회
│   │   ├── MessageCreatePage.js       # 메시지 생성(AI 요청 포함)
│   │   └── MessageSendPage.js         # 메시지 발송 및 테스트
│   ├── AISettings/                    # AI 엔진 관련 설정 관리 페이지
│   │   ├── AIGuidelinePage.js         # AI 지침 관리
│   │   └── AIModelPage.js             # AI 모델 관리
│   └── SystemLogs/                    # 시스템 로그 페이지
│       └── SystemLogPage.js           # 시스템 로그 조회
├── assets/                            # 이미지, 폰트 등 정적 리소스
│   └── kt_logo.png                    # 예시 이미지(사이드바 로고 등)
├── styles/                            # 글로벌 스타일 파일
│   ├── App.css                        # 전체 앱 공통 스타일
│   └── index.css                      # 기본/추가 커스텀 CSS
├── utils/                             # 전역 유틸 함수, API 등
│   ├── api.js                         # axios 등 API 요청 함수
│   └── auth.js                        # 토큰 등 인증/로그인 유틸 함수
├── routes/                            # 리액트 라우터(페이지-컴포넌트 연결)
│   └── AppRoutes.js                   # 전체 라우팅 관리 파일
├── App.js                             # 전체 앱 루트 컴포넌트(레이아웃+라우팅)
├── index.js                           # React DOM 진입점, App 렌더링
└── ...env, config, 기타 전역 설정 파일 등 필요에 따라 추가