// 샘플 데이터 (시제품용)
const CATEGORIES = [
  { id: "all", name: "전체", icon: "✨" },
  { id: "phone", name: "휴대폰·태블릿", icon: "📱" },
  { id: "electronics", name: "전자기기", icon: "💻" },
  { id: "appliance", name: "가전", icon: "🧊" },
  { id: "furniture", name: "가구·인테리어", icon: "🛋️" },
  { id: "fashion", name: "의류·잡화", icon: "👕" },
  { id: "vehicle", name: "오토바이·차량", icon: "🛵" },
  { id: "baby", name: "유아용품", icon: "🍼" },
  { id: "hobby", name: "취미·스포츠", icon: "🏀" },
  { id: "etc", name: "기타", icon: "📦" },
];

const REGIONS = [
  "메트로 마닐라 · 마카티",
  "메트로 마닐라 · BGC 타기그",
  "메트로 마닐라 · 퀘존시티",
  "메트로 마닐라 · 파식",
  "메트로 마닐라 · 마닐라",
  "세부 · 세부시티",
  "세부 · 막탄 라푸라푸",
  "다바오 · 다바오시티",
  "앙헬레스 · 클락",
  "바기오",
  "일로일로",
];

const CONDITIONS = ["새상품", "거의 새것", "사용감 적음", "사용감 있음"];

const DEALS = ["직거래", "택배(LBC/J&T)", "Grab/Lalamove 배송"];

const PAYMENTS = ["현금", "GCash", "Maya", "계좌이체"];

const HOUR = 3600 * 1000;
const now = Date.now();

const SAMPLE_ITEMS = [
  { id: "s1", title: "아이폰 14 프로 256GB 딥퍼플", price: 42000, category: "phone", region: REGIONS[1], condition: "거의 새것", deal: ["직거래", "Grab/Lalamove 배송"], pay: ["GCash", "현금"], desc: "1년 사용, 배터리 효율 89%. 기스 거의 없고 케이스 끼고 썼어요. 박스·충전 케이블 포함. BGC 하이스트리트 근처 직거래 선호합니다.", seller: "Miguel R.", rating: 4.9, createdAt: now - 2 * HOUR, views: 132, color: "#7c5cbf" },
  { id: "s2", title: "혼다 클릭 125i 2021년식", price: 68000, category: "vehicle", region: REGIONS[5], condition: "사용감 있음", deal: ["직거래"], pay: ["현금", "계좌이체"], desc: "주행 18,000km. OR/CR 서류 완비, 정기 오일 교환. 세부 마보로 근처에서 시승 가능해요.", seller: "Jun D.", rating: 4.7, createdAt: now - 5 * HOUR, views: 210, color: "#d1495b" },
  { id: "s3", title: "3인용 패브릭 소파 (그레이)", price: 7500, category: "furniture", region: REGIONS[0], condition: "사용감 적음", deal: ["직거래", "Grab/Lalamove 배송"], pay: ["GCash", "현금"], desc: "이사 가서 급하게 처분합니다. 반려동물 없음, 흡연 안 함. 라라무브 배송비는 구매자 부담.", seller: "Anna K.", rating: 5.0, createdAt: now - 9 * HOUR, views: 87, color: "#6c757d" },
  { id: "s4", title: "인버터 창문형 에어컨 1HP (캐리어)", price: 14500, category: "appliance", region: REGIONS[2], condition: "거의 새것", deal: ["직거래", "Grab/Lalamove 배송"], pay: ["GCash", "Maya", "현금"], desc: "6개월 사용. 전기세 절약형 인버터 모델입니다. 영수증 있어요, 보증기간 남음.", seller: "Carlo M.", rating: 4.8, createdAt: now - 26 * HOUR, views: 301, color: "#2a9d8f" },
  { id: "s5", title: "맥북 에어 M2 8GB/256GB", price: 48000, category: "electronics", region: REGIONS[3], condition: "거의 새것", deal: ["직거래"], pay: ["계좌이체", "GCash"], desc: "사이클 수 45회. 오르티가스 쇼핑몰에서 직거래 가능. 정품 충전기 포함.", seller: "Bea S.", rating: 4.9, createdAt: now - 30 * HOUR, views: 254, color: "#264653" },
  { id: "s6", title: "유모차 (접이식, 경량)", price: 3200, category: "baby", region: REGIONS[7], condition: "사용감 적음", deal: ["직거래", "택배(LBC/J&T)"], pay: ["GCash", "현금"], desc: "아이가 커서 정리해요. 한 손으로 접히고 비행기 기내 반입 사이즈입니다.", seller: "Liza P.", rating: 4.6, createdAt: now - 50 * HOUR, views: 64, color: "#f4a261" },
  { id: "s7", title: "농구화 나이키 270mm", price: 2800, category: "fashion", region: REGIONS[4], condition: "사용감 적음", deal: ["택배(LBC/J&T)", "직거래"], pay: ["GCash"], desc: "실내 코트에서만 5번 신었습니다. 사이즈 미스로 판매해요.", seller: "Paolo T.", rating: 4.5, createdAt: now - 3 * HOUR, views: 41, color: "#e76f51" },
  { id: "s8", title: "서핑보드 7'2\" 펀보드", price: 9000, category: "hobby", region: REGIONS[6], condition: "사용감 있음", deal: ["직거래"], pay: ["현금", "GCash"], desc: "시아르가오 다녀와서 판매합니다. 리쉬·핀 포함. 작은 딩 수리 1군데.", seller: "Ken L.", rating: 4.8, createdAt: now - 70 * HOUR, views: 119, color: "#00a6d6" },
  { id: "s9", title: "삼성 갤럭시 탭 S9 FE", price: 16000, category: "phone", region: REGIONS[8], condition: "거의 새것", deal: ["택배(LBC/J&T)", "직거래"], pay: ["GCash", "Maya"], desc: "S펜 포함, 북커버 증정. 클락 SM 근처 직거래 또는 J&T 발송.", seller: "Rina V.", rating: 4.9, createdAt: now - 12 * HOUR, views: 98, color: "#3d5a80" },
  { id: "s10", title: "원목 4인용 식탁 세트", price: 11000, category: "furniture", region: REGIONS[9], condition: "사용감 있음", deal: ["직거래"], pay: ["현금"], desc: "바기오 원목 공방에서 맞춘 식탁입니다. 의자 4개 포함. 직접 가져가셔야 해요.", seller: "Mario G.", rating: 4.7, createdAt: now - 96 * HOUR, views: 77, color: "#8d6e63" },
  { id: "s11", title: "업라이트 냉장고 9cu.ft (투도어)", price: 9800, category: "appliance", region: REGIONS[10], condition: "사용감 있음", deal: ["직거래", "Grab/Lalamove 배송"], pay: ["현금", "GCash"], desc: "냉동·냉장 모두 잘 됩니다. 일로일로 시내 라라무브 가능.", seller: "Joy A.", rating: 4.4, createdAt: now - 20 * HOUR, views: 56, color: "#90a4ae" },
  { id: "s12", title: "닌텐도 스위치 OLED + 타이틀 3개", price: 15500, category: "hobby", region: REGIONS[1], condition: "거의 새것", deal: ["직거래", "택배(LBC/J&T)"], pay: ["GCash", "계좌이체"], desc: "마리오카트, 젤다, 동물의숲 포함. 조이콘 쏠림 없음.", seller: "Sam C.", rating: 5.0, createdAt: now - 1 * HOUR, views: 188, color: "#e63946" },
  { id: "s13", title: "가방 무료 나눔 (백팩 2개)", price: 0, category: "etc", region: REGIONS[2], condition: "사용감 있음", deal: ["직거래"], pay: ["현금"], desc: "아직 쓸만한 학생용 백팩 두 개 나눔합니다. 퀘존 메모리얼 서클 근처.", seller: "Tess N.", rating: 4.9, createdAt: now - 6 * HOUR, views: 33, color: "#43aa8b" },
  { id: "s14", title: "야마하 어쿠스틱 기타 F310", price: 4500, category: "hobby", region: REGIONS[5], condition: "사용감 적음", deal: ["직거래", "택배(LBC/J&T)"], pay: ["GCash", "현금"], desc: "줄 새로 갈았어요. 소프트 케이스와 카포 같이 드립니다.", seller: "Nico B.", rating: 4.6, createdAt: now - 40 * HOUR, views: 72, color: "#bc6c25" },
  { id: "s15", title: "스탠드 선풍기 (아사히) 2대", price: 1500, category: "appliance", region: REGIONS[4], condition: "사용감 있음", deal: ["직거래"], pay: ["현금", "GCash"], desc: "두 대 일괄. 작동 이상 없습니다. 말라테 근처.", seller: "Ella F.", rating: 4.3, createdAt: now - 60 * HOUR, views: 29, color: "#577590" },
  { id: "s16", title: "원피스 여름 린넨 (M) 3벌", price: 900, category: "fashion", region: REGIONS[0], condition: "사용감 적음", deal: ["택배(LBC/J&T)"], pay: ["GCash"], desc: "보홀 여행 때 입은 원피스 3벌 일괄입니다. 세탁 완료.", seller: "Hana Y.", rating: 4.8, createdAt: now - 15 * HOUR, views: 45, color: "#ffb4a2" },
];
