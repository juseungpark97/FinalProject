# FinalProject

## import
- import -> Maven -> Existing Maven Projects -> FINALPROJECT(루트폴더)선택.

## 버전 정보

- **JDK:** Amazon Corretto 11  
  [다운로드 링크](https://docs.aws.amazon.com/ko_kr/corretto/latest/corretto-11-ug/downloads-list.html)
  
- **Spring Boot:** 2.7.5  
  pom.xml에서 다운그레이드 필요. JDK 11버전부터는 Spring Boot 3.x버전 사용 불가.

- **Spring Tool Suite (STS):** 3.9.18.RELEASE  
  [다운로드 링크](https://github.com/spring-attic/toolsuite-distribution/wiki/Spring-Tool-Suite-3)

- **SQL Developer:** 23.1.1.345  
  [다운로드 링크](https://www.oracle.com/database/sqldeveloper/technologies/download/)

- **Database:** Oracle Database 21c Express Edition Release 21.0.0.0.0 - Production Version 21.3.0.0.0  
  [다운로드 링크](https://www.oracle.com/database/technologies/xe-downloads.html)

- **Lombok:** 1.18.32  
  [다운로드 링크](https://mvnrepository.com/artifact/org.projectlombok/lombok/1.18.32)

- **Node.js:** v20.15.1  
  [다운로드 링크](https://nodejs.org/en)

- **React:**  
  프로젝트 생성: `npx create-react-app my-app` (my-app 이름은 자유롭게 설정 가능)  
  HTTP 클라이언트 axios 설치: `npm install axios`  
  스타일 관련: `npm install styled-components`  
  여러 페이지 구현 라이브러리: `npm install react-router-dom`  
  빌드 : `npm run build` (배포시 사용)
  node_modules : 공유시 제외하고 공유해야 용량문제가 안생김.

## 기본 개념

- **JDK (Java Development Kit):** Java 애플리케이션 개발을 위한 도구 모음으로, 컴파일러, 표준 라이브러리, 실행 환경 등을 포함합니다.

- **Spring Boot:** 스프링 프레임워크를 기반으로 한 자바 웹 애플리케이션 개발 프레임워크로, 빠르고 간편한 설정을 제공합니다.

- **Spring Tool Suite (STS):** Spring 애플리케이션 개발을 위한 통합 개발 환경(IDE)입니다.

- **SQL Developer:** Oracle에서 제공하는 데이터베이스 관리 도구로, SQL 쿼리 작성, 데이터베이스 관리, 데이터 모델링 등을 지원합니다.

- **Oracle Database:** 오라클에서 제공하는 관계형 데이터베이스 관리 시스템(RDBMS)입니다.

- **Lombok:** 자바에서 반복적으로 작성해야 하는 코드를 자동으로 생성해주는 라이브러리로, 생산성을 높여줍니다.

- **Node.js:** JavaScript 런타임 환경으로, 서버 사이드 애플리케이션을 개발할 때 사용됩니다.

- **npm (Node Package Manager):** Node.js의 기본 패키지 관리자입니다. Node.js 패키지를 설치하고 관리하는 도구입니다.

- **React:** 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리로, 컴포넌트 기반의 개발 방식을 제공합니다.

- **Axios:** HTTP 클라이언트 라이브러리로, 브라우저와 Node.js에서 모두 사용할 수 있습니다.

- **styled-components:** CSS-in-JS 라이브러리로, JavaScript 파일 내에서 CSS를 작성할 수 있게 해줍니다.

- **react-router-dom:** React 애플리케이션에서 여러 페이지를 구현하기 위한 라이브러리입니다.
