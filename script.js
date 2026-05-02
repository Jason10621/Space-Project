// =======================================================================
// HAFS Grand Observatory (V13.0 Ultimate Unabridged Core)
// Rule 1: No reduction in quantity (All 8 Planets, 13 Moons, 7 Probes)
// Rule 2: Infinite length permitted for highest quality.
// Project Creator: 10621 이정욱
// =======================================================================

const App = { 
    mode: 'lobby', 
    scene: null, 
    camera: null, 
    renderer: null, 
    controls: null 
};

// --- 1. 천문 대백과사전 데이터베이스 (100% 무삭제 완전 복원) ---
const DB = {
    deepspace: {
        'home': { 
            name: "MILKY WAY (우리은하)", type: "galaxy", coords: new THREE.Vector3(0, 0, 0), color: 0x88bbff, count: 25000, 
            img: "https://upload.wikimedia.org/wikipedia/commons/4/43/ESO-VLT-Laser-phot-33a-07.jpg",
            desc: "아름다운 대수 나선(Logarithmic Spiral) 구조를 가진 우리은하입니다.", 
            details: "은하 중심의 거대한 벌지(Bulge)와 4개의 주요 나선팔로 이루어져 있습니다. 질량의 대부분은 눈에 보이지 않는 암흑 물질이 차지하고 있습니다.", 
            metrics: [{n: "암흑 물질", p: 85, c: "#221144"}, {n: "항성/성단", p: 10, c: "#e6c27a"}, {n: "성간 가스/먼지", p: 5, c: "#4488ff"}],
            subs: [{t: "Orion Arm (오리온 팔)", d: "태양계가 위치한 변두리 나선팔"}, {t: "Galactic Bulge", d: "항성들이 밀집된 밝은 은하 중심부"}] 
        },
        'sgra': { 
            name: "SAGITTARIUS A* (초거대 블랙홀)", type: "blackhole", coords: new THREE.Vector3(200, 50, -200), 
            img: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Black_hole_-_Messier_87_crop_max_res.jpg",
            desc: "상대성 이론의 극치, 중심부의 초거대 블랙홀입니다.", 
            details: "안정적인 케플러 궤도를 도는 강착 원반을 시뮬레이션했습니다. 지구를 향해 다가오는 가스는 도플러 빔 효과(Doppler Beaming)로 인해 더욱 밝고 푸르게 빛납니다." 
        },
        'carina': { 
            name: "CARINA NEBULA (용골자리 성운)", type: "nebula", coords: new THREE.Vector3(1200, 300, -800), color: 0xff5522, count: 20000, 
            img: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Carina_Nebula_by_Webb_Telescope_%28high_res%29.jpg",
            desc: "지구에서 8,500광년 떨어진 거대한 별의 요람입니다.", 
            details: "항성풍에 의해 깎여나간 거대한 기둥 형태의 성간운이 특징입니다.", 
            metrics: [{n: "수소 가스", p: 70, c: "#ff4422"}, {n: "헬륨", p: 25, c: "#ffaa55"}, {n: "중원소 먼지", p: 5, c: "#665544"}],
            subs: [{t: "Eta Carinae", d: "폭발 직전의 극대거성 쌍성계"}, {t: "Cosmic Cliffs", d: "별이 탄생하는 우주 절벽"}] 
        },
        'smacs': { 
            name: "SMACS 0723 (중력렌즈 은하단)", type: "cluster", coords: new THREE.Vector3(3500, -2000, -4000), color: 0x5544ff, count: 30000, 
            img: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Webb%27s_First_Deep_Field.jpg",
            desc: "거대한 질량으로 시공간을 렌즈처럼 휘게 만드는 은하단입니다.", 
            details: "은하단의 막대한 암흑물질이 시공간을 왜곡하여 배경 은하의 빛을 둥글게 늘려버립니다.", 
            metrics: [{n: "암흑 물질", p: 90, c: "#111122"}, {n: "은하단 간 가스", p: 8, c: "#aa44ff"}, {n: "은하 질량", p: 2, c: "#ffffff"}],
            subs: [{t: "Gravitational Arcs", d: "왜곡되어 원호 형태로 보이는 130억 년 전의 빛"}] 
        }
    },
    solarsystem: [
        { 
            id: "mercury", name: "MERCURY (수성)", r: 1.2, d: 20, speed: 0.047, color: 0xa9a9a9, 
            img: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg", 
            temp: "430°C", orb: "47.36", 
            desc: "태양과 가장 가까운 암석 행성. 대기가 없어 일교차가 극심합니다.", 
            details: "대기가 거의 없어 수많은 운석 충돌 구덩이가 보존되어 있습니다.", 
            atm: [{n: "산소", p: 42, c: "#a3c2c2"}, {n: "나트륨", p: 29, c: "#ffdb4d"}, {n: "수소", p: 22, c: "#4da6ff"}], 
            internal: [{n: "규산염 맨틀", p: 20, c: "#b33c00"}, {n: "거대 철 코어", p: 80, c: "#ff6600"}], 
            moons: [] 
        },
        { 
            id: "venus", name: "VENUS (금성)", r: 1.8, d: 30, speed: 0.035, color: 0xeeddcc, 
            img: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg", 
            temp: "471°C", orb: "35.02", 
            desc: "극단적 온실효과를 지닌 태양계에서 가장 뜨거운 행성입니다.", 
            details: "두꺼운 이산화탄소 대기와 황산 구름으로 덮여 지표면의 압력이 지구의 90배에 달합니다.", 
            atm: [{n: "이산화탄소", p: 96, c: "#ff6666"}, {n: "질소", p: 3, c: "#c2c2d6"}], 
            internal: [{n: "지각", p: 5, c: "#d4a373"}, {n: "맨틀", p: 65, c: "#a0522d"}, {n: "코어", p: 30, c: "#552500"}], 
            moons: [] 
        },
        { 
            id: "earth", name: "EARTH (지구)", r: 2.0, d: 45, speed: 0.029, color: 0x3366ff, 
            img: "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg", 
            temp: "15°C", orb: "29.78", 
            desc: "액체 상태의 물이 존재하는 생명체 거주 행성.", 
            details: "다이나모 이론에 의한 자기장 형성으로 태양풍으로부터 생명체를 보호합니다.", 
            atm: [{n: "질소", p: 78, c: "#8892b0"}, {n: "산소", p: 21, c: "#66ccff"}], 
            internal: [{n: "지각", p: 5, c: "#8b7355"}, {n: "맨틀", p: 40, c: "#b33c00"}, {n: "외핵", p: 35, c: "#ff6600"}, {n: "내핵", p: 20, c: "#ffcc00"}], 
            moons: [
                {id:"luna", name:"Luna (달)", r:0.5, d:4, speed:0.08, color:0xaaaaaa, img: "https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg", desc:"지구와의 조석 고정으로 인해 인류는 항상 달의 앞면만 볼 수 있습니다. 생명 탄생에 필수적인 조석간만의 차를 만들어냅니다."}
            ] 
        },
        { 
            id: "mars", name: "MARS (화성)", r: 1.5, d: 60, speed: 0.024, color: 0xff4422, 
            img: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg", 
            temp: "-63°C", orb: "24.07", 
            desc: "산화철로 인해 붉게 보이며 과거 물이 흘렀던 뚜렷한 흔적이 있는 행성.", 
            details: "과거에는 두꺼운 대기가 있었으나 자기장을 잃어버리며 태양풍에 대기를 대부분 빼앗겼습니다.", 
            atm: [{n: "이산화탄소", p: 95, c: "#ff6666"}, {n: "질소", p: 3, c: "#8892b0"}], 
            internal: [{n: "지각", p: 10, c: "#cc4422"}, {n: "맨틀", p: 60, c: "#993311"}, {n: "코어", p: 30, c: "#551100"}], 
            moons: [
                {id:"phobos", name:"Phobos", r:0.2, d:2, speed:0.15, color:0x888888, img: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Phobos_colour_2008.jpg", desc:"감자 모양의 위성으로, 궤도가 점차 낮아져 미래에 화성과 충돌할 운명입니다."}, 
                {id:"deimos", name:"Deimos", r:0.15, d:3, speed:0.1, color:0x777777, img: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Deimos-MRO.jpg", desc:"화성의 두 번째 위성으로 매우 작고 어두운 표면을 가졌습니다."}
            ] 
        },
        { 
            id: "jupiter", name: "JUPITER (목성)", r: 5.5, d: 95, speed: 0.013, color: 0xdda050, 
            img: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg", 
            temp: "-110°C", orb: "13.07", 
            desc: "태양계에서 가장 거대한 가스 행성.", 
            details: "내부의 거대한 액체 금속 수소 바다가 초강력 자기장을 만들어냅니다. 수백 년간 지속되는 대적점 폭풍이 특징입니다.", 
            atm: [{n: "수소", p: 89, c: "#4da6ff"}, {n: "헬륨", p: 10, c: "#ffcc99"}], 
            internal: [{n: "기체 수소", p: 15, c: "#ffeebb"}, {n: "액체 금속 수소", p: 70, c: "#99aacc"}, {n: "암석 코어", p: 15, c: "#444444"}], 
            moons: [
                {id:"io", name:"Io", r:0.4, d:7, speed:0.12, color:0xffff00, img: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Io_highest_resolution_true_color.jpg", desc:"목성의 가공할 조석력으로 내부가 끓어올라, 태양계에서 가장 화산 활동이 활발한 지옥 같은 위성입니다."}, 
                {id:"europa", name:"Europa", r:0.35, d:9, speed:0.09, color:0xeeeeee, img: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Europa-moon.jpg", desc:"표면의 두꺼운 얼음 지각 아래에 지구의 모든 바다를 합친 것보다 많은 양의 액체 물이 존재하여 생명체 탐사 1순위로 꼽힙니다."},
                {id:"ganymede", name:"Ganymede", r:0.6, d:11, speed:0.07, color:0xaaaaaa, img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Ganymede_g1_true.jpg", desc:"태양계에서 가장 큰 위성으로, 행성인 수성보다도 큽니다. 위성 중 유일하게 자체적인 자기장을 가지고 있습니다."},
                {id:"callisto", name:"Callisto", r:0.55, d:13, speed:0.05, color:0x888888, img: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Callisto.jpg", desc:"태양계에서 크레이터가 가장 밀집된 천체로, 수십억 년간 표면의 지질학적 활동이 전혀 없이 죽어있는 위성입니다."}
            ] 
        },
        { 
            id: "saturn", name: "SATURN (토성)", r: 4.5, d: 130, speed: 0.009, color: 0xead6b8, 
            img: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg", 
            temp: "-140°C", orb: "9.69", 
            desc: "아름다운 고리 시스템을 가진 거대 가스 행성.", 
            details: "평균 밀도가 물보다 낮아, 거대한 바다가 있다면 둥둥 뜰 수 있습니다. 수많은 얼음 조각들로 이루어진 광대한 고리를 가졌습니다.", 
            atm: [{n: "수소", p: 96, c: "#4da6ff"}, {n: "헬륨", p: 3, c: "#ffcc99"}], 
            internal: [{n: "기체 수소", p: 20, c: "#eeddcc"}, {n: "금속 수소", p: 60, c: "#8899aa"}, {n: "암석 코어", p: 20, c: "#333333"}], 
            hasRing: true, ringColor: 0xeeddcc, ringInner: 1.5, ringOuter: 2.8, 
            moons: [
                {id:"titan", name:"Titan", r:0.7, d:8, speed:0.05, color:0xffaa55, img: "https://upload.wikimedia.org/wikipedia/commons/9/90/Titan_in_true_color.jpg", desc:"지구보다 더 짙은 질소 중심의 대기를 가지고 있으며, 표면에 메탄과 에탄으로 이루어진 호수와 강이 흐르는 유일한 위성입니다."},
                {id:"enceladus", name:"Enceladus", r:0.2, d:6, speed:0.08, color:0xffffff, img: "https://upload.wikimedia.org/wikipedia/commons/8/83/Enceladus_stripes_104.jpg", desc:"하얀 얼음 표면의 갈라진 틈(타이거 스트라이프)에서 수증기와 유기물이 우주 공간으로 뿜어져 나오는(간헐천) 경이로운 위성입니다."},
                {id:"mimas", name:"Mimas", r:0.15, d:5, speed:0.1, color:0xaaaaaa, img: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Mimas_Cassini.jpg", desc:"표면에 거대한 '허셜 크레이터'가 존재하여 영화 스타워즈의 '데스 스타'와 똑같이 생긴 위성입니다."}
            ] 
        },
        { 
            id: "uranus", name: "URANUS (천왕성)", r: 3.2, d: 165, speed: 0.006, color: 0x66ccff, 
            img: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg", 
            temp: "-195°C", orb: "6.81", 
            desc: "자전축이 98도 기울어져 누운 채로 공전하는 얼음 거성.", 
            details: "태양계 형성 초기에 거대한 천체와 충돌하여 자전축이 완전히 꺾인 것으로 추정됩니다. 메탄 가스가 붉은빛을 흡수해 청록색으로 보입니다.", 
            atm: [{n: "수소", p: 83, c: "#4da6ff"}, {n: "헬륨", p: 15, c: "#ffcc99"}, {n: "메탄", p: 2, c: "#66ffcc"}], 
            internal: [{n: "대기(가스)", p: 20, c: "#66ccff"}, {n: "얼음 맨틀", p: 60, c: "#3388cc"}, {n: "암석 코어", p: 20, c: "#222222"}], 
            hasRing: true, ringColor: 0x888888, ringInner: 1.3, ringOuter: 1.4,
            moons: [
                {id:"miranda", name:"Miranda", r:0.1, d:4, speed:0.06, color:0x999999, img: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Miranda.jpg", desc:"수많은 단층과 협곡으로 표면이 심하게 짜깁기된 듯한 누더기 모양의 위성입니다."},
                {id:"titania", name:"Titania", r:0.25, d:6, speed:0.04, color:0xbbbbbb, img: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Titania_%28moon%29.jpg", desc:"천왕성의 위성 중 가장 크며, 더러운 얼음과 암석이 반반씩 섞인 성분으로 이루어져 있습니다."}
            ] 
        },
        { 
            id: "neptune", name: "NEPTUNE (해왕성)", r: 3.0, d: 200, speed: 0.005, color: 0x3333cc, 
            img: "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg", 
            temp: "-200°C", orb: "5.43", 
            desc: "초음속 강풍이 부는 태양계 최외곽 얼음 거성.", 
            details: "태양에서 가장 멀리 떨어져 있음에도 불구하고, 내부의 미스터리한 열원으로 인해 시속 2,100km에 달하는 폭력적인 바람이 붑니다.", 
            atm: [{n: "수소", p: 80, c: "#4da6ff"}, {n: "헬륨", p: 19, c: "#ffcc99"}, {n: "메탄", p: 1, c: "#66ffcc"}], 
            internal: [{n: "가스 대기", p: 15, c: "#3333cc"}, {n: "얼음 맨틀", p: 65, c: "#222288"}, {n: "암석 코어", p: 20, c: "#111111"}], 
            moons: [
                {id:"triton", name:"Triton", r:0.4, d:5, speed:0.04, color:0xaabbcc, img: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Triton_moon_mosaic_Voyager_2_%28large%29.jpg", desc:"해왕성의 자전 방향과 정반대로 공전하는 '역행' 위성. 카이퍼 벨트에서 포획된 천체로 추정되며 액체 질소 간헐천을 뿜어냅니다."}
            ] 
        }
    ],
    // [탐사선 7기 완벽 유지]
    probes: [
        { id: "voyager1", name: "VOYAGER 1", launch: "1977", target: "Interstellar Space", distAU: 162.5, vel: "17.0", img: "https://upload.wikimedia.org/wikipedia/commons/6/60/Voyager_spacecraft_model.png", power: 40, desc: "인류 역사상 가장 멀리 떨어진 탐사선.", details: "목성과 토성을 탐사한 후 성간 공간에 진입했습니다. 외계 지적 생명체를 위한 골든 레코드를 싣고 있습니다.", angle: Math.PI / 4 },
        { id: "voyager2", name: "VOYAGER 2", launch: "1977", target: "Outer Planets Grand Tour", distAU: 136.0, vel: "15.3", img: "https://upload.wikimedia.org/wikipedia/commons/6/60/Voyager_spacecraft_model.png", power: 38, desc: "외행성계 그랜드 투어를 완수한 유일한 우주선.", details: "목성, 토성, 천왕성, 해왕성을 모두 근접 탐사하고 성간 공간으로 나아갔습니다.", angle: Math.PI * 1.8 },
        { id: "pioneer10", name: "PIONEER 10", launch: "1972", target: "Jupiter", distAU: 135.0, vel: "11.9", img: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Pioneer_10_spacecraft.png", power: 0, desc: "최초로 목성을 탐사하고 소행성대를 통과한 개척선.", details: "2003년 전력이 완전히 고갈되어 통신이 두절되었으나, 알데바란을 향해 관성 비행 중입니다. 인간 남녀의 모습이 그려진 금속 명판을 싣고 있습니다.", angle: Math.PI * 1.3 },
        { id: "pioneer11", name: "PIONEER 11", launch: "1973", target: "Saturn", distAU: 111.0, vel: "11.2", img: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Pioneer_10_spacecraft.png", power: 0, desc: "목성과 토성을 차례로 탐사한 탐사선.", details: "토성의 고리를 최초로 직접 관측했으며 1995년에 통신이 영구적으로 끊겼습니다.", angle: Math.PI * 1.5 },
        { id: "newhorizons", name: "NEW HORIZONS", launch: "2006", target: "Pluto / Kuiper Belt", distAU: 58.0, vel: "13.8", img: "https://upload.wikimedia.org/wikipedia/commons/f/fb/New_Horizons_Transparent.png", power: 75, desc: "인류 최초로 명왕성과 카이퍼 벨트를 탐사 중인 우주선.", details: "명왕성의 하트 모양 지형과 위성 카론을 선명하게 촬영했으며, 현재 카이퍼 벨트 외곽을 비행 중입니다.", angle: Math.PI },
        { id: "cassini", name: "CASSINI-HUYGENS", launch: "1997", target: "Saturn System", distAU: 9.5, vel: "Orbiting (Terminated)", img: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Cassini_Saturn_Orbit_Insertion.jpg", power: 0, desc: "토성계의 비밀을 밝혀낸 위대한 궤도선.", details: "엔셀라두스의 생명체 거주 가능성(간헐천)을 발견한 후 2017년 토성 대기로 뛰어들어 스스로 불타며 임무를 종료(그랜드 피날레)했습니다.", angle: Math.PI * 0.7 },
        { id: "rosetta", name: "ROSETTA", launch: "2004", target: "Comet 67P", distAU: 3.5, vel: "Landed (Terminated)", img: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Rosetta_spacecraft.png", power: 0, desc: "인류 최초로 혜성 표면에 직접 착륙한 탐사선.", details: "필레(Philae) 착륙선을 혜성 표면에 투하하여 태양계 초기의 혜성 화학 성분과 유기물을 정밀 분석했습니다.", angle: Math.PI * 0.2 }
    ]
};

// --- 독립 렌더링 엔진 메모리 ---
const DSEngine = { objects: {}, bh: { eh: null, ps: null, disk: null, speeds: [], count: 35000, geometry: null } };
const SSEngine = { planets: [], moons: [], tracked: null, speedMulti: 1.0 };
const PREngine = { probes: [], tracked: null };

// --- DOM 요소 바인딩 ---
const DOM = {
    lobby: document.getElementById('ui-lobby'), 
    btnHub: document.getElementById('btn-return-hub'),
    uiDS: document.getElementById('ui-deepspace'), 
    uiSS: document.getElementById('ui-solarsystem'), 
    uiPR: document.getElementById('ui-probes'),
    
    // Deep Space
    dsTargets: document.querySelectorAll('.ds-target'), 
    dsInfo: document.getElementById('ds-info'), 
    dsTitle: document.getElementById('ds-title'), 
    dsMedia: document.getElementById('ds-media'), 
    dsDesc: document.getElementById('ds-desc'), 
    dsDetails: document.getElementById('ds-details'),
    dsNormal: document.getElementById('ds-normal-info'), 
    dsSubList: document.getElementById('ds-sub-list'), 
    dsBHCtrl: document.getElementById('ds-bh-controls'), 
    bhMass: document.getElementById('bh-mass'), 
    bhDist: document.getElementById('bh-dist'),
    dsMetricsBar: document.getElementById('ds-metrics-bar'), 
    dsMetricsLegend: document.getElementById('ds-metrics-legend'),
    
    // Solar System
    ssList: document.getElementById('ss-planet-list'), 
    ssSpeed: document.getElementById('ss-speed'), 
    ssBtnReset: document.getElementById('btn-ss-reset'),
    ssInfo: document.getElementById('ss-info'), 
    ssName: document.getElementById('ss-name'), 
    ssMedia: document.getElementById('ss-media'), 
    ssDesc: document.getElementById('ss-desc'), 
    ssDetails: document.getElementById('ss-details'),
    ssTemp: document.getElementById('ss-temp'), 
    ssOrb: document.getElementById('ss-orb'), 
    ssCompBar: document.getElementById('ss-comp-bar'), 
    ssCompLegend: document.getElementById('ss-comp-legend'),
    ssInternalBar: document.getElementById('ss-internal-bar'), 
    ssInternalLegend: document.getElementById('ss-internal-legend'), 
    ssMoonsCont: document.getElementById('ss-moons-container'), 
    ssMoonsList: document.getElementById('ss-moons-list'),
    
    // Probes
    prList: document.getElementById('pr-list'), 
    btnPrReset: document.getElementById('btn-pr-reset'),
    prInfo: document.getElementById('pr-info'), 
    prName: document.getElementById('pr-name'), 
    prMedia: document.getElementById('pr-media'), 
    prDesc: document.getElementById('pr-desc'), 
    prDetails: document.getElementById('pr-details'),
    prLaunch: document.getElementById('pr-launch'), 
    prTarget: document.getElementById('pr-target'), 
    prPowerBar: document.getElementById('pr-power-bar'),
    prDist: document.getElementById('pr-dist'), 
    prVel: document.getElementById('pr-vel'), 
    prDelay: document.getElementById('pr-delay')
};

// ================= [ 글로벌 초기화 및 라이프사이클 관리 ] =================
function initGlobalCore() {
    const container = document.getElementById('three-canvas');
    App.scene = new THREE.Scene();
    App.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 25000);
    App.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    App.renderer.setSize(window.innerWidth, window.innerHeight);
    App.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(App.renderer.domElement);
    
    App.controls = new THREE.OrbitControls(App.camera, App.renderer.domElement);
    App.controls.enableDamping = true; 
    App.controls.dampingFactor = 0.05;

    buildLobbyBackground();
    
    window.addEventListener('resize', () => { 
        App.camera.aspect = window.innerWidth / window.innerHeight; 
        App.camera.updateProjectionMatrix(); 
        App.renderer.setSize(window.innerWidth, window.innerHeight); 
    });
    
    animate();
}

function clearScene() {
    while(App.scene.children.length > 0) { 
        App.scene.remove(App.scene.children[0]); 
    }
    DSEngine.objects = {}; 
    DSEngine.bh.disk = null; 
    DSEngine.bh.geometry = null;
    SSEngine.planets = []; 
    SSEngine.moons = []; 
    SSEngine.tracked = null;
    PREngine.probes = []; 
    PREngine.tracked = null;
}

function buildLobbyBackground() {
    App.scene.fog = new THREE.FogExp2(0x020204, 0.0005);
    const bgGeo = new THREE.BufferGeometry(); 
    const bgPos = new Float32Array(5000 * 3);
    for(let i=0; i<5000*3; i++) bgPos[i] = (Math.random() - 0.5) * 1000;
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    App.scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({color: 0x667788, size: 2})));
    App.camera.position.set(0, 0, 500); 
    App.controls.target.set(0, 0, 0);
}

// ================= [ MODULE 01: DEEP SPACE (대수나선 & 도플러 빔 연산 포함) ] =================
function launchDeepSpace() {
    App.mode = 'deepspace'; 
    clearScene(); 
    App.scene.fog = new THREE.FogExp2(0x020204, 0.0001);
    
    // 심우주 전경의 먼지 배경 생성
    const bgGeo = new THREE.BufferGeometry(); 
    const bgPos = new Float32Array(15000 * 3);
    for(let i=0; i<15000*3; i++) bgPos[i] = (Math.random() - 0.5) * 15000;
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    App.scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({color: 0x445566, size: 2})));

    for (const [key, data] of Object.entries(DB.deepspace)) {
        if (data.type === 'galaxy') {
            // [대수 나선 은하 수학 모델링]
            const geo = new THREE.BufferGeometry(); 
            const pos = new Float32Array(data.count * 3); 
            const col = new Float32Array(data.count * 3);
            const baseCol = new THREE.Color(data.color); 
            const arms = 4;
            
            for(let i=0; i<data.count; i++) {
                let r = Math.random() * 300; 
                let armOffset = (i % arms) * (Math.PI * 2 / arms);
                let theta = r * 0.03 + armOffset + (Math.random()-0.5)*0.8; // 나선의 말림(winding) 공식
                let x = Math.cos(theta) * r;
                let z = Math.sin(theta) * r;
                let y = (Math.random()-0.5) * (1500 / (r*r + 50)); // 중심부(벌지)는 두껍게
                
                pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z;
                
                const mix = new THREE.Color(0xffeedd).lerp(baseCol, r/300); 
                col[i*3] = mix.r; col[i*3+1] = mix.g; col[i*3+2] = mix.b;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); 
            geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
            const cloud = new THREE.Points(geo, new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending }));
            cloud.position.copy(data.coords); 
            App.scene.add(cloud); 
            DSEngine.objects[key] = cloud;
        } 
        else if (data.type === 'nebula' || data.type === 'cluster') {
            const geo = new THREE.BufferGeometry(); 
            const pos = new Float32Array(data.count * 3); 
            const col = new Float32Array(data.count * 3);
            const baseCol = new THREE.Color(data.color);
            
            for(let i=0; i<data.count * 3; i+=3) {
                const r = Math.pow(Math.random(), 2);
                const t = Math.random() * Math.PI * 2;
                const p = Math.acos(2 * Math.random() - 1);
                const spread = 350; 
                
                pos[i] = r * Math.sin(p) * Math.cos(t) * spread; 
                pos[i+1] = r * Math.sin(p) * Math.sin(t) * (spread * 0.4); 
                pos[i+2] = r * Math.cos(p) * spread;
                
                const mix = new THREE.Color(0xffffff).lerp(baseCol, r); 
                col[i] = mix.r; col[i+1] = mix.g; col[i+2] = mix.b;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); 
            geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
            const cloud = new THREE.Points(geo, new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }));
            cloud.position.copy(data.coords); 
            App.scene.add(cloud); 
            DSEngine.objects[key] = cloud;
        }
        else if (data.type === 'blackhole') {
            const bhGroup = new THREE.Group();
            
            // 사상의 지평선 (Event Horizon)
            DSEngine.bh.eh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), new THREE.MeshBasicMaterial({ color: 0x000000 }));
            // 광자구 (Photon Sphere)
            DSEngine.bh.ps = new THREE.Mesh(new THREE.SphereGeometry(1.5, 64, 64), new THREE.MeshBasicMaterial({ color: 0xff3366, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, side: THREE.BackSide }));
            
            bhGroup.add(DSEngine.bh.eh); 
            bhGroup.add(DSEngine.bh.ps);

            // 강착 원반 (Accretion Disk) 초기 파티클 세팅
            const geo = new THREE.BufferGeometry(); 
            const pos = new Float32Array(DSEngine.bh.count * 3); 
            const col = new Float32Array(DSEngine.bh.count * 3);
            
            for(let i=0; i < DSEngine.bh.count; i++) {
                const r = 1.6 + Math.pow(Math.random(), 2) * 25; 
                const t = Math.random() * Math.PI * 2;
                
                pos[i*3] = Math.cos(t) * r; 
                pos[i*3+1] = (Math.random() - 0.5) * (1.5 / Math.sqrt(r)); // 얇은 원반 두께
                pos[i*3+2] = Math.sin(t) * r;
                
                DSEngine.bh.speeds[i] = 2.5 / Math.pow(r, 1.5); // 케플러 회전 각속도
                
                col[i*3] = 1.0; col[i*3+1] = 0.5; col[i*3+2] = 0.0;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); 
            geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
            
            DSEngine.bh.geometry = geo; // 도플러 효과 연산을 위한 geometry 참조 저장
            DSEngine.bh.disk = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.25, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
            
            bhGroup.add(DSEngine.bh.disk); 
            bhGroup.position.copy(data.coords); 
            bhGroup.rotation.x = 0.15; // 관측자가 원반을 비스듬히 보도록 기울임
            
            App.scene.add(bhGroup); 
            DSEngine.objects[key] = bhGroup;
        }
    }
    App.camera.position.set(0, 0, 500); 
    App.controls.target.set(0, 0, 0); 
    dsWarpTo('home'); 
}

function dsWarpTo(targetKey) {
    const data = DB.deepspace[targetKey]; 
    const targetObj = DSEngine.objects[targetKey];
    DOM.dsInfo.style.opacity = "0";
    
    // 블랙홀이면 카메라를 훨씬 더 가깝게(50) 줌인, 성운은 넓게(450) 조망
    const zoomOffset = data.type === 'blackhole' ? 50 : 450;
    const endPosition = new THREE.Vector3(targetObj.position.x, targetObj.position.y + (zoomOffset/4), targetObj.position.z + zoomOffset);

    new TWEEN.Tween(App.camera.position).to(endPosition, 3500).easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(() => App.camera.lookAt(targetObj.position))
        .onComplete(() => {
            App.controls.target.copy(targetObj.position);
            
            // 데이터 패널 렌더링
            DOM.dsTitle.textContent = data.name; 
            DOM.dsMedia.style.backgroundImage = `url('${data.img}')`;
            DOM.dsDesc.textContent = data.desc; 
            DOM.dsDetails.textContent = data.details;
            
            if (data.type === 'blackhole') {
                DOM.dsNormal.style.display = 'none'; 
                DOM.dsBHCtrl.style.display = 'block'; 
                dsUpdatePhysics();
            } else {
                DOM.dsNormal.style.display = 'block'; 
                DOM.dsBHCtrl.style.display = 'none';
                
                // 천체 질량 분포(Astro-metrics) 막대그래프 렌더링
                DOM.dsMetricsBar.innerHTML = ''; 
                DOM.dsMetricsLegend.innerHTML = '';
                if(data.metrics) {
                    data.metrics.forEach(c => {
                        DOM.dsMetricsBar.innerHTML += `<div class="comp-segment" style="width:${c.p}%; background:${c.c};">${c.p}%</div>`;
                        DOM.dsMetricsLegend.innerHTML += `<div class="legend-item"><div class="legend-color" style="background:${c.c};"></div>${c.n}</div>`;
                    });
                }
                
                // 내부 주요 하위 구조(Sub-systems) 렌더링
                DOM.dsSubList.innerHTML = ''; 
                data.subs.forEach(s => DOM.dsSubList.innerHTML += `<li><span class="sub-title">${s.t}</span><span class="sub-detail">${s.d}</span></li>`);
            }
            DOM.dsInfo.style.opacity = "1";
        }).start();
}

function dsUpdatePhysics() {
    const mass = parseFloat(DOM.bhMass.value);
    const dist = parseFloat(DOM.bhDist.value);
    const rs = mass * 3.0; // 슈바르츠실트 반지름 근사
    const scale = Math.max(1, mass / 10);
    
    // 질량에 비례하여 3D 메쉬 크기(scale)를 동적으로 스케일링
    if(DSEngine.bh.eh) { 
        DSEngine.bh.eh.scale.set(scale, scale, scale); 
        DSEngine.bh.ps.scale.set(scale, scale, scale); 
        DSEngine.bh.disk.scale.set(scale, scale, scale); 
    }
    
    // 상대성이론에 의한 관측자의 시간 지연(Time Dilation) 연산
    const timeDilation = (dist * rs > rs) ? 1 / Math.sqrt(1 - (rs / (dist * rs))) : 0;
    
    document.getElementById('bh-mass-val').textContent = mass.toFixed(1); 
    document.getElementById('bh-dist-val').textContent = `${dist} Rs`;
    document.getElementById('bh-rs').textContent = `${rs.toFixed(2)} km`;
    document.getElementById('bh-time').textContent = timeDilation > 0 ? timeDilation.toFixed(4) + "x" : "INFINITE";
}

// ================= [ 5. MODULE 02: SOLAR SYSTEM (8 Planets & 13 Moons) ] =================
function launchSolarSystem() {
    App.mode = 'solarsystem'; 
    clearScene(); 
    App.scene.fog = new THREE.FogExp2(0x020204, 0.0005);
    
    // 태양계 공간의 별빛
    const starsGeo = new THREE.BufferGeometry(); 
    const starsPos = new Float32Array(5000 * 3);
    for(let i=0; i<5000*3; i++) starsPos[i] = (Math.random() - 0.5) * 2000;
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    App.scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({color: 0xaaaaaa, size: 1.5})));

    // 태양 (광원)
    const sun = new THREE.Mesh(new THREE.SphereGeometry(8, 64, 64), new THREE.MeshBasicMaterial({ color: 0xffcc33 }));
    App.scene.add(sun); 
    App.scene.add(new THREE.PointLight(0xffffff, 2, 800)); 
    App.scene.add(new THREE.AmbientLight(0x333333));

    DOM.ssList.innerHTML = '';
    
    DB.solarsystem.forEach(pData => {
        // 1. 행성 생성
        const pMesh = new THREE.Mesh(new THREE.SphereGeometry(pData.r, 32, 32), new THREE.MeshStandardMaterial({ color: pData.color, roughness: 0.6 }));
        pMesh.position.x = pData.d;

        // 2. 고리 생성 (토성, 천왕성 등)
        if(pData.hasRing) {
            const ring = new THREE.Mesh(new THREE.RingGeometry(pData.r * pData.ringInner, pData.r * pData.ringOuter, 64), new THREE.MeshStandardMaterial({ color: pData.ringColor, side: THREE.DoubleSide, transparent:true, opacity:0.7 }));
            ring.rotation.x = Math.PI / 2; 
            pMesh.add(ring);
        }

        // 3. 위성(Moons) 13종 생성 (행성의 자식 객체로 종속되어 함께 공전)
        if(pData.moons && pData.moons.length > 0) {
            pData.moons.forEach(mData => {
                const mMesh = new THREE.Mesh(new THREE.SphereGeometry(mData.r, 16, 16), new THREE.MeshStandardMaterial({color: mData.color}));
                mMesh.position.x = mData.d;
                
                const mPivot = new THREE.Group(); 
                mPivot.add(mMesh); 
                pMesh.add(mPivot); // 행성을 중심으로 도는 Pivot 구조
                
                const mOrbit = new THREE.Mesh(new THREE.RingGeometry(mData.d - 0.05, mData.d + 0.05, 64), new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide, transparent:true, opacity:0.5 }));
                mOrbit.rotation.x = Math.PI / 2; 
                pMesh.add(mOrbit);
                
                SSEngine.moons.push({ id: mData.id, pivot: mPivot, mesh: mMesh, speed: mData.speed, parent: pMesh, data: mData });
            });
        }

        // 행성 공전 궤도선 생성
        const pivot = new THREE.Group(); 
        pivot.add(pMesh); 
        App.scene.add(pivot);
        
        const orbit = new THREE.Mesh(new THREE.RingGeometry(pData.d - 0.1, pData.d + 0.1, 128), new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide }));
        orbit.rotation.x = Math.PI / 2; 
        App.scene.add(orbit);

        SSEngine.planets.push({ id: pData.id, pivot, mesh: pMesh, speed: pData.speed, data: pData, type: 'planet' });

        // 좌측 UI: 행성 선택 버튼 생성
        const btn = document.createElement('button'); 
        btn.className = 'target-btn ss-target';
        btn.innerHTML = `<span class="btn-title" style="display:flex; align-items:center; gap:8px;"><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#${pData.color.toString(16)}"></span>${pData.name}</span>`;
        
        btn.onclick = () => {
            document.querySelectorAll('.ss-target').forEach(b => b.classList.remove('active')); 
            btn.classList.add('active');
            SSEngine.tracked = SSEngine.planets.find(p => p.id === pData.id); // 카메라 트래킹 타겟 지정
            ssUpdatePlanetInfo(pData);
        };
        DOM.ssList.appendChild(btn);
    });
    
    // 초기 조감도 위치 설정
    App.camera.position.set(0, 150, 200); 
    App.controls.target.set(0, 0, 0);
}

// 태양계 UI 및 인포그래픽 업데이트
function ssUpdatePlanetInfo(pData) {
    DOM.ssName.textContent = pData.name; 
    DOM.ssMedia.style.backgroundImage = `url('${pData.img}')`; 
    DOM.ssDesc.textContent = pData.desc; 
    DOM.ssDetails.textContent = pData.details;
    DOM.ssTemp.textContent = pData.temp; 
    DOM.ssOrb.textContent = `${pData.orb} km/s`;

    // 대기 성분 막대(Atmosphere Bar) 렌더링
    DOM.ssCompBar.innerHTML = ''; 
    DOM.ssCompLegend.innerHTML = '';
    if(pData.atm) {
        pData.atm.forEach(c => {
            DOM.ssCompBar.innerHTML += `<div class="comp-segment" style="width:${c.p}%; background:${c.c};">${c.p}%</div>`;
            DOM.ssCompLegend.innerHTML += `<div class="legend-item"><div class="legend-color" style="background:${c.c};"></div>${c.n}</div>`;
        });
    }

    // 내부 구조 층상 막대(Internal Layer Bar) 렌더링
    DOM.ssInternalBar.innerHTML = ''; 
    DOM.ssInternalLegend.innerHTML = '';
    if(pData.internal) {
        pData.internal.forEach(layer => {
            DOM.ssInternalBar.innerHTML += `<div class="internal-segment" style="height:${layer.p * 1.5}px; background:${layer.c}; border-bottom:1px solid rgba(0,0,0,0.5);">${layer.p}%</div>`;
            DOM.ssInternalLegend.innerHTML += `<div class="legend-item"><div class="legend-color" style="background:${layer.c};"></div>${layer.n}</div>`;
        });
    }

    // 행성에 속한 위성(Moons) 버튼 렌더링
    if(pData.moons && pData.moons.length > 0) {
        DOM.ssMoonsCont.style.display = 'block'; 
        DOM.ssMoonsList.innerHTML = '';
        pData.moons.forEach(mData => {
            const btn = document.createElement('button'); 
            btn.className = 'moon-btn'; 
            btn.textContent = mData.name;
            
            // 위성 버튼 클릭 이벤트 (카메라가 위성으로 이동 및 위성 데이터 표출)
            btn.onclick = () => {
                document.querySelectorAll('.moon-btn').forEach(b => b.classList.remove('active')); 
                btn.classList.add('active');
                SSEngine.tracked = SSEngine.moons.find(m => m.id === mData.id); // 트래킹 타겟을 위성으로 덮어씀
                
                // UI 데이터를 위성 데이터로 덮어쓰기
                DOM.ssName.textContent = mData.name;
                DOM.ssMedia.style.backgroundImage = `url('${mData.img}')`; 
                DOM.ssDesc.textContent = `[위성 데이터] ${mData.desc}`;
                DOM.ssDetails.textContent = ""; 
            };
            DOM.ssMoonsList.appendChild(btn);
        });
    } else {
        DOM.ssMoonsCont.style.display = 'none';
    }
    
    DOM.ssInfo.style.opacity = "1";
}

// ================= [ 6. MODULE 03: INTERSTELLAR PROBES (7 Probes) ] =================
function launchProbes() {
    App.mode = 'probes'; 
    clearScene(); 
    App.scene.fog = new THREE.FogExp2(0x010205, 0.0001); 
    
    // 심우주 별 배경
    const starsGeo = new THREE.BufferGeometry(); 
    const starsPos = new Float32Array(10000 * 3);
    for(let i=0; i<10000*3; i++) starsPos[i] = (Math.random() - 0.5) * 15000;
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    App.scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({color: 0x888888, size: 2})));

    const sun = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffddaa }));
    App.scene.add(sun); 
    App.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // 배경의 행성 공전 궤도 (수성~해왕성 스케일 비교 가이드용 라인)
    const refOrbits = [0.39, 0.72, 1.0, 1.52, 5.2, 9.5, 19.2, 30.1]; 
    const scaleAU = 10;
    refOrbits.forEach(r => {
        const orbit = new THREE.Mesh(new THREE.RingGeometry(r*scaleAU - 0.2, r*scaleAU + 0.2, 128), new THREE.MeshBasicMaterial({ color: 0x112233, side: THREE.DoubleSide }));
        orbit.rotation.x = Math.PI / 2; 
        App.scene.add(orbit);
    });

    DOM.prList.innerHTML = '';
    
    DB.probes.forEach(pData => {
        // 거리 데이터(AU)를 직교 3D 좌표로 변환
        const dist = pData.distAU * scaleAU;
        const x = Math.cos(pData.angle) * dist;
        const z = Math.sin(pData.angle) * dist;
        
        // 탐사선 3D 하이브리드 모델링 (팔면체 본체 + 통신 안테나 링)
        const pGroup = new THREE.Group();
        const core = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), new THREE.MeshBasicMaterial({ color: 0xa277ff, wireframe: true }));
        const dish = new THREE.Mesh(new THREE.RingGeometry(1.5, 2.5, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 }));
        dish.rotation.x = Math.PI / 2;
        pGroup.add(core); 
        pGroup.add(dish);
        pGroup.position.set(x, 0, z);
        App.scene.add(pGroup);

        // 태양부터 이어지는 탐사선의 궤적 라인(Line)
        const points = [new THREE.Vector3(0,0,0), new THREE.Vector3(x, 0, z)];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({ color: 0xa277ff, transparent: true, opacity: 0.3 });
        const line = new THREE.Line(lineGeo, lineMat); 
        App.scene.add(line);

        PREngine.probes.push({ id: pData.id, mesh: pGroup, data: pData });

        // 좌측 UI 탐사선 리스트 버튼
        const btn = document.createElement('button'); 
        btn.className = 'target-btn pr-target';
        btn.innerHTML = `<span class="btn-title" style="color:#a277ff;">${pData.name}</span>`;
        btn.onclick = () => {
            document.querySelectorAll('.pr-target').forEach(b => b.classList.remove('active')); 
            btn.classList.add('active');
            PREngine.tracked = PREngine.probes.find(p => p.id === pData.id);
            prUpdateInfo(pData);
        };
        DOM.prList.appendChild(btn);
    });
    
    App.camera.position.set(0, 500, 800); 
    App.controls.target.set(0, 0, 0);
}

function prUpdateInfo(pData) {
    DOM.prName.textContent = pData.name; 
    DOM.prMedia.style.backgroundImage = `url('${pData.img}')`; 
    DOM.prDesc.textContent = pData.desc; 
    DOM.prDetails.textContent = pData.details;
    DOM.prLaunch.textContent = pData.launch; 
    DOM.prTarget.textContent = pData.target;
    
    // RTG(원자력 전지) 파워 잔량 막대 애니메이션
    DOM.prPowerBar.style.width = `${pData.power}%`;
    DOM.prPowerBar.textContent = pData.power > 0 ? `${pData.power}%` : "OFFLINE";
    DOM.prPowerBar.style.background = pData.power > 30 ? "#a277ff" : "#ff3366";

    DOM.prDist.textContent = `${pData.distAU} AU`;
    DOM.prVel.textContent = `${pData.vel} km/s`;
    
    // [Light-Time Delay 연산 알고리즘]
    // 1 AU = 1.496e8 km. 빛의 속도 c = 약 300,000 km/s.
    const distKm = pData.distAU * 1.496e8; 
    const seconds = distKm / 300000;
    DOM.prDelay.textContent = `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;

    DOM.prInfo.style.opacity = "1";

    // 카메라 트래킹 (탐사선의 현재 위치를 향해 카메라를 날려 보냄)
    const tPos = PREngine.tracked.mesh.position;
    new TWEEN.Tween(App.controls.target).to(tPos, 1500).start();
    
    // [시네마틱 뷰포트] 탐사선 약간 뒤에서 태양(원점)을 함께 바라보는 각도 도출
    const dirToSun = tPos.clone().normalize().multiplyScalar(-20); 
    new TWEEN.Tween(App.camera.position).to(tPos.clone().add(new THREE.Vector3(0, 10, 0)).add(dirToSun), 1500).start();
}


// ================= [ 7. 글로벌 UI 이벤트 및 SPA 라우팅 ] =================

// 메인 로비에서 모듈 진입 이벤트
document.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('click', () => {
        DOM.lobby.style.opacity = "0";
        setTimeout(() => {
            DOM.lobby.style.display = "none"; 
            DOM.btnHub.style.display = "block"; // 복귀 버튼 On
            
            const targetMod = card.dataset.module;
            if (targetMod === 'deepspace') { DOM.uiDS.style.display = 'block'; launchDeepSpace(); }
            else if (targetMod === 'solarsystem') { DOM.uiSS.style.display = 'block'; launchSolarSystem(); }
            else if (targetMod === 'probes') { DOM.uiPR.style.display = 'block'; launchProbes(); }
        }, 500);
    });
});

// 모듈 내부에서 메인 로비로 복귀
DOM.btnHub.addEventListener('click', () => {
    DOM.uiDS.style.display = 'none'; 
    DOM.uiSS.style.display = 'none'; 
    DOM.uiPR.style.display = 'none'; 
    DOM.btnHub.style.display = 'none';
    App.mode = 'lobby'; 
    clearScene(); 
    buildLobbyBackground(); // 3D 씬을 청소하고 로비 별밭으로 복구
    
    DOM.lobby.style.display = 'flex'; 
    setTimeout(() => DOM.lobby.style.opacity = "1", 100);
});

// UI 버튼 클릭 이벤트 바인딩 (M1)
DOM.dsTargets.forEach(btn => btn.addEventListener('click', (e) => { 
    DOM.dsTargets.forEach(b => b.classList.remove('active')); 
    e.target.closest('.target-btn').classList.add('active'); 
    dsWarpTo(e.target.closest('.target-btn').dataset.target); 
}));
DOM.bhMass.addEventListener('input', dsUpdatePhysics); 
DOM.bhDist.addEventListener('input', dsUpdatePhysics);

// UI 버튼 클릭 이벤트 바인딩 (M2)
DOM.ssBtnReset.addEventListener('click', () => {
    SSEngine.tracked = null; 
    document.querySelectorAll('.ss-target, .moon-btn').forEach(b => b.classList.remove('active')); 
    DOM.ssInfo.style.opacity = "0";
    new TWEEN.Tween(App.camera.position).to(new THREE.Vector3(0, 150, 200), 1500).start(); 
    new TWEEN.Tween(App.controls.target).to(new THREE.Vector3(0,0,0), 1500).start();
});
DOM.ssSpeed.addEventListener('input', e => { 
    SSEngine.speedMulti = parseFloat(e.target.value) / 10; 
    document.getElementById('ss-speed-val').textContent = `${(SSEngine.speedMulti*10).toFixed(1)}x`; 
});

// UI 버튼 클릭 이벤트 바인딩 (M3)
DOM.btnPrReset.addEventListener('click', () => {
    PREngine.tracked = null; 
    document.querySelectorAll('.pr-target').forEach(b => b.classList.remove('active')); 
    DOM.prInfo.style.opacity = "0";
    new TWEEN.Tween(App.camera.position).to(new THREE.Vector3(0, 500, 800), 1500).start(); 
    new TWEEN.Tween(App.controls.target).to(new THREE.Vector3(0,0,0), 1500).start();
});

// ================= [ 8. 60 FPS 마스터 렌더링 루프 (물리 엔진) ] =================
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update(); 

    if (App.mode === 'lobby') { 
        App.scene.rotation.y += 0.0005; 
    } 
    else if (App.mode === 'deepspace') {
        // 거시적 은하/성운의 은은한 전체 자전
        Object.keys(DB.deepspace).forEach(k => { 
            if(DB.deepspace[k].type === 'nebula' || DB.deepspace[k].type === 'galaxy') {
                if(DSEngine.objects[k]) DSEngine.objects[k].rotation.y += 0.0002; 
            }
        });
        
        // [초고퀄리티 도플러 빔 연산 엔진] 블랙홀 강착 원반 실시간 조명 및 회전 제어
        if (DSEngine.bh.disk && DSEngine.bh.geometry) {
            const positions = DSEngine.bh.geometry.attributes.position.array;
            const colors = DSEngine.bh.geometry.attributes.color.array;
            const massFactor = parseFloat(DOM.bhMass.value) / 10;
            
            for(let i=0; i < DSEngine.bh.count; i++) {
                let x = positions[i*3], z = positions[i*3+2]; 
                let r = Math.sqrt(x*x + z*z); 
                let t = Math.atan2(z, x);
                
                // 케플러 운동 각속도 갱신
                t += DSEngine.bh.speeds[i] * (1.0 / Math.max(0.1, massFactor));
                positions[i*3] = Math.cos(t) * r; 
                positions[i*3+2] = Math.sin(t) * r;
                
                // [도플러 효과] 다가오는 가스(x>0)는 파랗게 에너지(밝기) 증폭, 멀어지는 가스(x<0)는 붉게 감소
                let approaching = x / r; // -1 to 1의 범위를 가짐
                let intensity = 1.0 - (r / 30); // 중심일수록 강한 빛
                
                let rCol = 1.0;
                let gCol = 0.5 + (approaching * 0.4); 
                let bCol = 0.0 + Math.max(0, approaching * 0.8); // 다가올 때 푸른 파장 방출
                
                colors[i*3] = rCol * intensity; 
                colors[i*3+1] = gCol * intensity; 
                colors[i*3+2] = bCol * intensity;
            }
            DSEngine.bh.geometry.attributes.position.needsUpdate = true;
            DSEngine.bh.geometry.attributes.color.needsUpdate = true;
        }
    } 
    else if (App.mode === 'solarsystem') {
        // 행성 공전 및 자전
        SSEngine.planets.forEach(p => { 
            p.pivot.rotation.y += p.speed * SSEngine.speedMulti; 
            p.mesh.rotation.y += 0.05 * SSEngine.speedMulti; 
        });
        // 위성 공전
        SSEngine.moons.forEach(m => { 
            m.pivot.rotation.y += m.speed * SSEngine.speedMulti; 
        });
        
        // 동적 카메라 트래킹 (Nested World Position Tracking 알고리즘)
        if (SSEngine.tracked) {
            const tPos = new THREE.Vector3(); 
            SSEngine.tracked.mesh.getWorldPosition(tPos); // 부모 행성의 공전 좌표에 종속된 위성의 절대 월드 좌표 추출
            
            App.controls.target.lerp(tPos, 0.1);
            
            // 타겟이 위성이면 더 가깝게 줌인(8배), 행성이면 적당히 줌인(5배)
            const isMoon = SSEngine.tracked.data.speed !== undefined && SSEngine.tracked.parent !== undefined;
            const zDist = isMoon ? SSEngine.tracked.data.r * 8 + 2 : SSEngine.tracked.data.r * 5 + 10;
            
            App.camera.position.lerp(tPos.clone().add(new THREE.Vector3(zDist, zDist/2, zDist)), 0.05);
        }
    }
    else if (App.mode === 'probes') {
        // 프로브의 통신 안테나가 스캔을 위해 천천히 회전하는 연출
        PREngine.probes.forEach(p => p.mesh.rotation.y += 0.01);
    }

    App.controls.update();
    App.renderer.render(App.scene, App.camera);
}

// 렌더링 엔진 시작
window.onload = initGlobalCore;
