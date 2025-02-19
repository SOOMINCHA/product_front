## 배포 링크

- [Netlify 배포 페이지](https://golden-kashata-8e1b0e.netlify.app)


## 프로젝트 개요

위해상품 이관 프로젝트는 **Vue.js**로 개발된 프론트엔드와 **Python**을 사용한 ETL 프로세스를 통해, **PostgreSQL**에 저장된 상품 데이터를 **MariaDB**로 이관하는 시스템입니다. 이 시스템은 데이터베이스 간의 효율적인 데이터 이동을 지원하며, 특히 데이터 중복 적재를 방지하는 기능을 제공합니다.

### 주요 기능

- **상품 데이터 이관**: 사용자는 웹 인터페이스에서 **"이관" 버튼**을 클릭하여 **PostgreSQL**에 저장된 상품 데이터를 **MariaDB**로 이관할 수 있습니다.
- **위해상품과 비위해상품 분리**: 이관 과정에서 상품 데이터를 **위해상품**과 **비위해상품**으로 자동으로 분리하여 **MariaDB**에 적재합니다.
- **중복 데이터 방지**: ETL 프로세스는 이전에 이관된 데이터를 확인하여 중복 적재되지 않도록 처리합니다. 새로운 데이터만 이관되며, 기존 데이터는 덮어쓰지 않습니다.
- **전자정부 3.9 기반의 백엔드**: 백엔드는 **전자정부 3.9 (eGovFrame)** 프레임워크를 사용하여 구축되었습니다.
- 

## 기술 스택

| **분야**       | **기술**                         | **버전**        |
|----------------|----------------------------------|-----------------|
| 프론트엔드     | Vue.js                           | 3.4.35          |
| 백엔드         | 전자정부 프레임워크(eGovFrame)   | 3.9             |
| 데이터베이스   | PostgreSQL, MariaDB              | 14.15, 10.6     |
| 프로그래밍 언어| Python                           | 3.10.12         |
| 서버/배포      | AWS EC2, Netlify                 | -               |
| 웹 서버        | Apache Tomcat                    | 8.5             |

## 설치 방법

1. **프론트엔드**:
   - 의존성 설치: 
     ```bash
     pnpm install
     ```
   - 로컬 서버 실행:
     ```bash
     pnpm run dev
     ```
