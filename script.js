// =======================================================================
// HAFS Grand Observatory (V10.0 Ultimate Engine)
// Moons, Rings, and Advanced Data Visualization
// =======================================================================

const App = { mode: 'lobby', scene: null, camera: null, renderer: null, controls: null, animationId: null };

// --- 1. 천문 대백과사전 데이터베이스 (심층 텍스트 및 위성 데이터 추가) ---
const DB = {
    deepspace: {
        'home': { 
            name: "MILKY WAY (우리은하)", type: "nebula", coords: new THREE.Vector3(0, 0, 0), color: 0x88bbff, count: 15000, 
            desc: "태양계가 속해 있는 지름 약 10만 광년의 막대 나선 은하입니다.", 
            details: "약 1,000억에서 4,000억 개의 항성으로 이루어져 있으며, 중심부에는 막대 모양의 별의 무리가 존재합니다. 태양계는 은하 중심에서 약 26,000광년 떨어진 '오리온자리 팔' 가장자리에 위치해 있으며, 약 2억 2천만 년을 주기로 은하 중심을 공전(은하년)합니다.",
            subs: [{t: "Orion Arm (오리온 팔)", d: "태양계와 지구를 품고 있는 나선팔"}, {t: "Galactic Halo (은하 헤일로)", d: "은하 원반을 둥글게 둘러싼 구형의 암흑물질과 구상성단 영역"}] 
        },
        'sgra': { 
            name: "SAGITTARIUS A* (초거대 블랙홀)", type: "blackhole", coords: new THREE.Vector3(200, 50, -200), 
            desc: "우리은하 중심의 초대질량 블랙홀입니다. 시공간을 극단적으로 왜곡합니다.",
            details: "질량은 태양의 약 430만 배에 달하지만, 크기는 수성 궤도보다 작습니다. 거대한 질량으로 인해 주변 별(S-star cluster)들이 초고속으로 궤도를 도는 것을 관측하여 존재가 입증되었으며, 2022년 사건지평선망원경(EHT)에 의해 실제 그림자(Shadow) 이미지가 촬영되었습니다." 
        },
        'carina': { 
            name: "CARINA NEBULA (용골자리 성운)", type: "nebula", coords: new THREE.Vector3(1200, 300, -800), color: 0xff5522, count: 20000, 
            desc: "지구에서 8,500광년 떨어진 거대한 별의 요람입니다.", 
            details: "오리온성운보다 4배나 더 크며, 우리은하에서 가장 활동적이고 거대한 항성 탄생 영역 중 하나입니다. 내부의 거대한 별들이 뿜어내는 강력한 항성풍과 자외선 복사가 성운의 가스를 조각하여 '우주 절벽(Cosmic Cliffs)'과 같은 기괴한 형태를 만들어냅니다.",
            subs: [{t: "Eta Carinae", d: "태양 밝기의 500만 배에 달하는 폭발 직전의 극대거성"}, {t: "Homunculus Nebula", d: "에타 카리나이의 폭발로 형성된 먼지 구름"}] 
        },
        'smacs': { 
            name: "SMACS 0723 (중력렌즈 은하단)", type: "nebula", coords: new THREE.Vector3(3500, -2000, -4000), color: 0x5544ff, count: 30000, 
            desc: "JWST가 관측한 최초의 딥 필드 이미지 대상입니다.",
            details: "46억 광년 떨어져 있는 이 은하단의 총 질량은 너무나 방대하여 시공간을 마치 돋보기 렌즈처럼 휘게 만듭니다(중력 렌즈 현상). 이로 인해 이 은하단 뒤편에 숨겨져 있던, 우주 탄생 초기(빅뱅 후 10억 년)에 만들어진 130억 광년 너머의 붉고 희미한 고대 은하들의 빛을 확대해서 볼 수 있습니다.",
            subs: [{t: "Gravitational Lensing Arcs", d: "시공간 왜곡으로 인해 배경 은하의 빛이 원호(Arc) 형태로 늘어난 모습"}] 
        }
    },
    solarsystem: [
        { 
            id: "earth", name: "EARTH (지구)", r: 2.0, d: 40, speed: 0.029, color: 0x3366ff, img: "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg", temp: "15°C (평균)", orb: "29.78", 
            desc: "액체 상태의 물이 존재하며 생명체가 서식하는 유일한 행성입니다.",
            details: "판 구조론이 활발하게 일어나는 지각을 가졌으며, 외핵의 액체 철 성분이 대류하면서 강력한 자기장(다이나모 이론)을 형성하여 태양풍으로부터 대기와 생명체를 보호합니다. 물의 비열과 온실효과 덕분에 생명체가 살기 적합한 온도를 유지합니다.",
            atm: [{n: "질소(N2)", p: 78, c: "#8892b0"}, {n: "산소(O2)", p: 21, c: "#66ccff"}, {n: "아르곤(Ar)", p: 1, c: "#d1b3ff"}],
            internal: [{n: "지각 (Crust)", p: 5, c: "#8b7355"}, {n: "맨틀 (Mantle)", p: 40, c: "#b33c00"}, {n: "외핵 (Outer Core)", p: 35, c: "#ff6600"}, {n: "내핵 (Inner Core)", p: 20, c: "#ffcc00"}],
            moons: [{id:"luna", name:"Luna (달)", r:0.5, d:4, speed:0.08, color:0xaaaaaa, desc:"지구의 유일한 자연위성으로, 지구와의 조석 고정(Tidal Locking)으로 인해 항상 같은 면만 보입니다. 지구의 자전축을 안정시키고 밀물/썰물을 일으킵니다."}]
        },
        { 
            id: "mars", name: "MARS (화성)", r: 1.5, d: 55, speed: 0.024, color: 0xff4422, img: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg", temp: "-63°C", orb: "24.07", 
            desc: "산화철로 붉게 보이며 과거 물이 흘렀던 흔적이 있는 행성입니다.",
            details: "지구의 1% 수준인 매우 희박한 대기를 가졌습니다. 태양계 최대 화산인 '올림푸스 몬스'와 거대한 '마리너스 협곡'이 존재합니다. 과거에는 두꺼운 대기와 자기장이 있었으나 내부가 식으면서 태양풍에 의해 대기를 잃어버린 것으로 추정됩니다.",
            atm: [{n: "이산화탄소(CO2)", p: 95, c: "#ff6666"}, {n: "질소(N2)", p: 3, c: "#8892b0"}, {n: "아르곤(Ar)", p: 2, c: "#d1b3ff"}],
            internal: [{n: "지각", p: 10, c: "#cc4422"}, {n: "고체 맨틀", p: 60, c: "#993311"}, {n: "고체 코어", p: 30, c: "#551100"}],
            moons: [{id:"phobos", name:"Phobos (포보스)", r:0.2, d:2, speed:0.15, color:0x888888, desc:"불규칙한 감자 모양의 위성. 점차 화성으로 추락하고 있습니다."}, {id:"deimos", name:"Deimos (데이모스)", r:0.15, d:3, speed:0.1, color:0x777777, desc:"매우 작고 어두운 화성의 두 번째 위성입니다."}]
        },
        { 
            id: "jupiter", name: "JUPITER (목성)", r: 5.5, d: 85, speed: 0.013, color: 0xdda050, img: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg", temp: "-110°C", orb: "13.07", 
            desc: "태양계에서 가장 거대한 가스 행성입니다.",
            details: "질량이 태양계 다른 모든 행성을 합친 것의 2.5배에 달합니다. 강력한 자전으로 인해 대기에 줄무늬가 생기며, 지구보다 큰 거대 폭풍 '대적점'이 수백 년간 유지되고 있습니다. 내부의 거대한 액체 금속 수소 바다가 초강력 자기장을 만들어냅니다.",
            atm: [{n: "수소(H2)", p: 89, c: "#4da6ff"}, {n: "헬륨(He)", p: 10, c: "#ffcc99"}, {n: "메탄(CH4)", p: 1, c: "#66ffcc"}],
            internal: [{n: "기체 수소", p: 15, c: "#ffeebb"}, {n: "액체 금속 수소", p: 70, c: "#99aacc"}, {n: "암석/얼음 코어", p: 15, c: "#444444"}],
            moons: [{id:"io", name:"Io (이오)", r:0.4, d:7, speed:0.12, color:0xffff00, desc:"목성의 강력한 조석력으로 인해 태양계에서 화산 활동이 가장 활발한 천체입니다."}, {id:"europa", name:"Europa (유로파)", r:0.35, d:9, speed:0.09, color:0xeeeeee, desc:"얼음 지각 아래에 지구보다 많은 양의 거대한 바다가 존재할 것으로 유력시되는 생명체 탐사 1순위 위성입니다."}, {id:"ganymede", name:"Ganymede (가니메데)", r:0.6, d:11, speed:0.06, color:0xaaaaaa, desc:"수성보다 큰 태양계 최대의 위성으로, 자체 자기장을 가지고 있습니다."}]
        },
        { 
            id: "saturn", name: "SATURN (토성)", r: 4.5, d: 120, speed: 0.009, color: 0xead6b8, img: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg", temp: "-140°C", orb: "9.69", 
            desc: "아름다운 고리 시스템을 가진 거대 가스 행성입니다.",
            details: "밀도가 물보다 낮아, 거대한 수조가 있다면 물에 뜰 수 있는 유일한 행성입니다. 토성의 고리는 대부분 순수한 얼음 조각들로 이루어져 있으며 매우 얇고 광대합니다. 북극에는 미스터리한 육각형 모양의 거대 제트기류가 존재합니다.",
            atm: [{n: "수소(H2)", p: 96, c: "#4da6ff"}, {n: "헬륨(He)", p: 3, c: "#ffcc99"}, {n: "기타", p: 1, c: "#aaaaaa"}],
            internal: [{n: "기체 수소", p: 20, c: "#eeddcc"}, {n: "액체 금속 수소", p: 60, c: "#8899aa"}, {n: "암석 코어", p: 20, c: "#333333"}],
            hasRing: true, ringColor: 0xeeddcc, ringInner: 1.5, ringOuter: 2.8,
            moons: [{id:"titan", name:"Titan (타이탄)", r:0.7, d:8, speed:0.05, color:0xffaa55, desc:"짙은 질소 대기를 가지고 있으며, 표면에 메탄과 에탄으로 이루어진 호수와 강이 흐르는 유일한 위성입니다."}, {id:"enceladus", name:"Enceladus (엔셀라두스)", r:0.2, d:6, speed:0.08, color:0xffffff, desc:"남극 표면 갈라진 틈에서 얼음 결정과 유기물이 우주로 뿜어져 나오는(간헐천) 경이로운 위성입니다."}]
        },
        { 
            id: "uranus", name: "URANUS (천왕성)", r: 3.2, d: 155, speed: 0.006, color: 0x66ccff, img: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg", temp: "-195°C", orb: "6.81", 
            desc: "자전축이 98도 기울어져 누운 채로 공전하는 얼음 거성입니다.",
            details: "대기 상층부의 메탄 가스가 붉은빛을 흡수해 아름다운 청록색으로 보입니다. 태양계 형성 초기에 지구 크기의 거대한 원시 행성과 충돌하여 자전축이 완전히 꺾인 것으로 추정됩니다. 희미하고 얇은 고리들을 가지고 있습니다.",
            atm: [{n: "수소(H2)", p: 83, c: "#4da6ff"}, {n: "헬륨(He)", p: 15, c: "#ffcc99"}, {n: "메탄(CH4)", p: 2, c: "#66ffcc"}],
            internal: [{n: "대기(H, He, CH4)", p: 20, c: "#66ccff"}, {n: "맨틀 (물/암모니아 얼음)", p: 60, c: "#3388cc"}, {n: "암석 코어", p: 20, c: "#222222"}],
            hasRing: true, ringColor: 0x888888, ringInner: 1.3, ringOuter: 1.4,
            moons: [] // 생략
        },
        { 
            id: "neptune", name: "NEPTUNE (해왕성)", r: 3.0, d: 185, speed: 0.005, color: 0x3333cc, img: "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg", temp: "-200°C", orb: "5.43", 
            desc: "초음속 강풍이 부는 태양계 최외곽 얼음 거성입니다.",
            details: "태양에서 가장 멀리 떨어져 있음에도 불구하고, 내부 열원으로 인해 시속 2,100km에 달하는 태양계에서 가장 빠르고 폭력적인 바람이 붑니다. '대암점'이라 불리는 거대한 폭풍이 생겼다 사라지곤 합니다.",
            atm: [{n: "수소(H2)", p: 80, c: "#4da6ff"}, {n: "헬륨(He)", p: 19, c: "#ffcc99"}, {n: "메탄", p: 1, c: "#66ffcc"}],
            internal: [{n: "가스 대기", p: 15, c: "#3333cc"}, {n: "얼음 맨틀 (다이아몬드 비)", p: 65, c: "#222288"}, {n: "암석 코어", p: 20, c: "#111111"}],
            moons: [{id:"triton", name:"Triton (트리톤)", r:0.4, d:5, speed:0.04, color:0xaabbcc, desc:"해왕성의 자전 방향과 반대로 공전(역행)하는 거대 위성. 카이퍼 벨트에서 포획된 천체로 추정되며 액체 질소 간헐천이 있습니다."}]
        }
    ]
};

const DSEngine = { objects: {}, bh: { eh: null, ps: null, disk: null, speeds: [], count: 35000 } };
const SSEngine = { planets: [], moons: [], tracked: null, speedMulti: 1.0 }; // 위성 배열 추가

const DOM = {
    lobby: document.getElementById('ui-lobby'), btnHub: document.getElementById('btn-return-hub'),
    uiDS: document.getElementById('ui-deepspace'), uiSS: document.getElementById('ui-solarsystem'),
    dsTargets: document.querySelectorAll('.ds-target'), dsInfo: document.getElementById('ds-info'), dsTitle: document.getElementById('ds-title'), dsDesc: document.getElementById('ds-desc'), dsDetails: document.getElementById('ds-details'),
    dsNormal: document.getElementById('ds-normal-info'), dsSubList: document.getElementById('ds-sub-list'), dsBHCtrl: document.getElementById('ds-bh-controls'), bhMass: document.getElementById('bh-mass'), bhDist: document.getElementById('bh-dist'),
    ssList: document.getElementById('ss-planet-list'), ssSpeed: document.getElementById('ss-speed'), ssBtnReset: document.getElementById('btn-ss-reset'),
    ssInfo: document.getElementById('ss-info'), ssName: document.getElementById('ss-name'), ssMedia: document.getElementById('ss-media'), ssDesc: document.getElementById('ss-desc'), ssDetails: document.getElementById('ss-details'),
    ssTemp: document.getElementById('ss-temp'), ssOrb: document.getElementById('ss-orb'), ssCompBar: document.getElementById('ss-comp-bar'), ssCompLegend: document.getElementById('ss-comp-legend'),
    ssInternalBar: document.getElementById('ss-internal-bar'), ssInternalLegend: document.getElementById('ss-internal-legend'),
    ssMoonsCont: document.getElementById('ss-moons-container'), ssMoonsList: document.getElementById('ss-moons-list')
};

// ================= [ 3. 글로벌 캔버스 초기화 ] =================
function initGlobalCore() {
    const container = document.getElementById('three-canvas');
    App.scene = new THREE.Scene();
    App.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 20000);
    App.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    App.renderer.setSize(window.innerWidth, window.innerHeight);
    App.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(App.renderer.domElement);
    App.controls = new THREE.OrbitControls(App.camera, App.renderer.domElement);
    App.controls.enableDamping = true; App.controls.dampingFactor = 0.05;

    buildLobbyBackground();

    window.addEventListener('resize', () => {
        App.camera.aspect = window.innerWidth / window.innerHeight;
        App.camera.updateProjectionMatrix();
        App.renderer.setSize(window.innerWidth, window.innerHeight);
    });
    animate();
}

function clearScene() {
    while(App.scene.children.length > 0) { App.scene.remove(App.scene.children[0]); }
    DSEngine.objects = {}; DSEngine.bh.disk = null;
    SSEngine.planets = []; SSEngine.moons = []; SSEngine.tracked = null;
}

function buildLobbyBackground() {
    App.scene.fog = new THREE.FogExp2(0x010205, 0.0005);
    const bgGeo = new THREE.BufferGeometry(); const bgPos = new Float32Array(5000 * 3);
    for(let i=0; i<5000*3; i++) bgPos[i] = (Math.random() - 0.5) * 1000;
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    App.scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({color: 0x888888, size: 2})));
    App.camera.position.set(0, 0, 500); App.controls.target.set(0, 0, 0);
}

// ================= [ 4. MODULE 1: DEEP SPACE ] =================
function launchDeepSpace() {
    App.mode = 'deepspace'; clearScene();
    App.scene.fog = new THREE.FogExp2(0x010205, 0.0001);
    
    const bgGeo = new THREE.BufferGeometry(); const bgPos = new Float32Array(15000 * 3);
    for(let i=0; i<15000*3; i++) bgPos[i] = (Math.random() - 0.5) * 15000;
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    App.scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({color: 0x555555, size: 2})));

    for (const [key, data] of Object.entries(DB.deepspace)) {
        if (data.type === 'nebula') buildDSNebula(key, data);
        else buildDSBlackHole(key, data);
    }
    App.camera.position.set(0, 0, 500); App.controls.target.set(0, 0, 0);
    dsWarpTo('home'); 
}

function buildDSNebula(key, data) {
    const geo = new THREE.BufferGeometry(); const pos = new Float32Array(data.count * 3); const col = new Float32Array(data.count * 3);
    const baseCol = new THREE.Color(data.color);
    for(let i=0; i<data.count * 3; i+=3) {
        const r = Math.pow(Math.random(), 2), t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
        const spread = key === 'home' ? 250 : 350; 
        pos[i] = r * Math.sin(p) * Math.cos(t) * spread; pos[i+1] = r * Math.sin(p) * Math.sin(t) * (spread * 0.3); pos[i+2] = r * Math.cos(p) * spread;
        const mix = new THREE.Color(0xffffff).lerp(baseCol, r); col[i] = mix.r; col[i+1] = mix.g; col[i+2] = mix.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const cloud = new THREE.Points(geo, new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }));
    cloud.position.copy(data.coords); App.scene.add(cloud); DSEngine.objects[key] = cloud;
}

function buildDSBlackHole(key, data) {
    const bhGroup = new THREE.Group();
    DSEngine.bh.eh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    DSEngine.bh.ps = new THREE.Mesh(new THREE.SphereGeometry(1.5, 64, 64), new THREE.MeshBasicMaterial({ color: 0xff3366, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, side: THREE.BackSide }));
    bhGroup.add(DSEngine.bh.eh); bhGroup.add(DSEngine.bh.ps);

    const geo = new THREE.BufferGeometry(); const pos = new Float32Array(DSEngine.bh.count * 3); const col = new Float32Array(DSEngine.bh.count * 3);
    for(let i=0; i < DSEngine.bh.count; i++) {
        const r = 2 + Math.random() * 30, t = Math.random() * Math.PI * 2;
        pos[i*3] = Math.cos(t) * r; pos[i*3+1] = (Math.random() - 0.5) * (r * 0.05); pos[i*3+2] = Math.sin(t) * r;
        DSEngine.bh.speeds[i] = 1.8 / Math.sqrt(r);
        const intensity = 1.0 - (r / 32); col[i*3] = 1.0; col[i*3+1] = 0.3 + (intensity * 0.5); col[i*3+2] = intensity * 1.0;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    DSEngine.bh.disk = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.2, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    
    bhGroup.add(DSEngine.bh.disk); bhGroup.position.copy(data.coords); bhGroup.rotation.x = 0.2; 
    App.scene.add(bhGroup); DSEngine.objects[key] = bhGroup;
}

function dsWarpTo(targetKey) {
    const data = DB.deepspace[targetKey]; const targetObj = DSEngine.objects[targetKey];
    DOM.dsInfo.style.opacity = "0";
    const zoomOffset = data.type === 'blackhole' ? 50 : 400;
    const endPosition = new THREE.Vector3(targetObj.position.x, targetObj.position.y + (zoomOffset/3), targetObj.position.z + zoomOffset);

    new TWEEN.Tween(App.camera.position).to(endPosition, 3000).easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(() => App.camera.lookAt(targetObj.position))
        .onComplete(() => {
            App.controls.target.copy(targetObj.position);
            DOM.dsTitle.textContent = data.name; DOM.dsDesc.textContent = data.desc; DOM.dsDetails.textContent = data.details;
            
            if (data.type === 'blackhole') {
                DOM.dsNormal.style.display = 'none'; DOM.dsBHCtrl.style.display = 'block'; dsUpdatePhysics();
            } else {
                DOM.dsNormal.style.display = 'block'; DOM.dsBHCtrl.style.display = 'none';
                DOM.dsSubList.innerHTML = ''; data.subs.forEach(s => DOM.dsSubList.innerHTML += `<li><span class="sub-title">${s.t}</span><span class="sub-detail">${s.d}</span></li>`);
            }
            DOM.dsInfo.style.opacity = "1";
        }).start();
}

function dsUpdatePhysics() {
    const mass = parseFloat(DOM.bhMass.value), dist = parseFloat(DOM.bhDist.value);
    const rs = mass * 3.0, scale = Math.max(1, mass / 10);
    if(DSEngine.bh.eh) {
        DSEngine.bh.eh.scale.set(scale, scale, scale); DSEngine.bh.ps.scale.set(scale, scale, scale); DSEngine.bh.disk.scale.set(scale, scale, scale);
    }
    const timeDilation = (dist * rs > rs) ? 1 / Math.sqrt(1 - (rs / (dist * rs))) : 0;
    document.getElementById('bh-mass-val').textContent = mass.toFixed(1); document.getElementById('bh-dist-val').textContent = `${dist} Rs`;
    document.getElementById('bh-rs').textContent = `${rs.toFixed(2)} km`;
    document.getElementById('bh-time').textContent = timeDilation > 0 ? timeDilation.toFixed(4) + "x" : "INFINITE";
}

// ================= [ 5. MODULE 2: SOLAR SYSTEM (위성 & 고리 포함) ] =================
function launchSolarSystem() {
    App.mode = 'solarsystem'; clearScene();
    App.scene.fog = new THREE.FogExp2(0x010205, 0.0005);
    
    const starsGeo = new THREE.BufferGeometry(); const starsPos = new Float32Array(5000 * 3);
    for(let i=0; i<5000*3; i++) starsPos[i] = (Math.random() - 0.5) * 2000;
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    App.scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({color: 0xaaaaaa, size: 1.5})));

    const sun = new THREE.Mesh(new THREE.SphereGeometry(8, 64, 64), new THREE.MeshBasicMaterial({ color: 0xffcc33 }));
    App.scene.add(sun); App.scene.add(new THREE.PointLight(0xffffff, 2, 800)); App.scene.add(new THREE.AmbientLight(0x333333));

    DOM.ssList.innerHTML = '';
    
    DB.solarsystem.forEach(pData => {
        // 행성 생성
        const pMesh = new THREE.Mesh(new THREE.SphereGeometry(pData.r, 32, 32), new THREE.MeshStandardMaterial({ color: pData.color, roughness: 0.6 }));
        pMesh.position.x = pData.d;

        // 고리 생성
        if(pData.hasRing) {
            const ring = new THREE.Mesh(new THREE.RingGeometry(pData.r * pData.ringInner, pData.r * pData.ringOuter, 64), new THREE.MeshStandardMaterial({ color: pData.ringColor, side: THREE.DoubleSide, transparent:true, opacity:0.7 }));
            ring.rotation.x = Math.PI / 2; pMesh.add(ring);
        }

        // 위성 시스템(Moons) 생성 (행성 메쉬에 종속됨)
        if(pData.moons && pData.moons.length > 0) {
            pData.moons.forEach(mData => {
                const mMesh = new THREE.Mesh(new THREE.SphereGeometry(mData.r, 16, 16), new THREE.MeshStandardMaterial({color: mData.color}));
                mMesh.position.x = mData.d;
                const mPivot = new THREE.Group(); mPivot.add(mMesh); pMesh.add(mPivot);
                
                // 위성 궤도선
                const mOrbit = new THREE.Mesh(new THREE.RingGeometry(mData.d - 0.05, mData.d + 0.05, 64), new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide, transparent:true, opacity:0.5 }));
                mOrbit.rotation.x = Math.PI / 2; pMesh.add(mOrbit);

                SSEngine.moons.push({ id: mData.id, pivot: mPivot, mesh: mMesh, speed: mData.speed, parent: pMesh, data: mData });
            });
        }

        const pivot = new THREE.Group(); pivot.add(pMesh); App.scene.add(pivot);
        const orbit = new THREE.Mesh(new THREE.RingGeometry(pData.d - 0.1, pData.d + 0.1, 128), new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide }));
        orbit.rotation.x = Math.PI / 2; App.scene.add(orbit);

        SSEngine.planets.push({ id: pData.id, pivot, mesh: pMesh, speed: pData.speed, data: pData, type: 'planet' });

        // 행성 선택 버튼
        const btn = document.createElement('button'); btn.className = 'target-btn ss-target';
        btn.innerHTML = `<span class="btn-title" style="display:flex; align-items:center; gap:8px;"><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#${pData.color.toString(16)}"></span>${pData.name}</span>`;
        btn.onclick = () => {
            document.querySelectorAll('.ss-target').forEach(b => b.classList.remove('active')); btn.classList.add('active');
            SSEngine.tracked = SSEngine.planets.find(p => p.id === pData.id);
            ssUpdatePlanetInfo(pData);
        };
        DOM.ssList.appendChild(btn);
    });

    App.camera.position.set(0, 150, 200); App.controls.target.set(0, 0, 0);
}

// 행성 상세 정보 렌더링 (대기, 내부구조, 위성)
function ssUpdatePlanetInfo(pData) {
    DOM.ssName.textContent = pData.name; DOM.ssMedia.style.backgroundImage = `url('${pData.img}')`; 
    DOM.ssDesc.textContent = pData.desc; DOM.ssDetails.textContent = pData.details;
    DOM.ssTemp.textContent = pData.temp; DOM.ssOrb.textContent = `${pData.orb} km/s`;

    // 1. 대기 성분 막대
    DOM.ssCompBar.innerHTML = ''; DOM.ssCompLegend.innerHTML = '';
    pData.atm.forEach(c => {
        DOM.ssCompBar.innerHTML += `<div class="comp-segment" style="width:${c.p}%; background:${c.c};">${c.p}%</div>`;
        DOM.ssCompLegend.innerHTML += `<div class="legend-item"><div class="legend-color" style="background:${c.c};"></div>${c.n}</div>`;
    });

    // 2. 내부 구조 층상형 막대 (높이로 표현)
    DOM.ssInternalBar.innerHTML = ''; DOM.ssInternalLegend.innerHTML = '';
    pData.internal.forEach(layer => {
        // 높이를 %로 주어 단면도처럼 보이게 함
        DOM.ssInternalBar.innerHTML += `<div class="internal-segment" style="height:${layer.p * 1.5}px; background:${layer.c}; border-bottom:1px solid rgba(0,0,0,0.5);">${layer.p}%</div>`;
        DOM.ssInternalLegend.innerHTML += `<div class="legend-item"><div class="legend-color" style="background:${layer.c};"></div>${layer.n}</div>`;
    });

    // 3. 위성 시스템 리스트
    if(pData.moons && pData.moons.length > 0) {
        DOM.ssMoonsCont.style.display = 'block';
        DOM.ssMoonsList.innerHTML = '';
        pData.moons.forEach(mData => {
            const btn = document.createElement('button'); btn.className = 'moon-btn'; btn.textContent = mData.name;
            btn.onclick = () => {
                document.querySelectorAll('.moon-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active');
                SSEngine.tracked = SSEngine.moons.find(m => m.id === mData.id); // 위성으로 카메라 트래킹 변경
                DOM.ssDesc.textContent = `[위성 데이터] ${mData.desc}`; // 위성 설명으로 덮어쓰기
            };
            DOM.ssMoonsList.appendChild(btn);
        });
    } else {
        DOM.ssMoonsCont.style.display = 'none';
    }

    DOM.ssInfo.style.opacity = "1";
}

DOM.ssBtnReset.addEventListener('click', () => {
    SSEngine.tracked = null; document.querySelectorAll('.ss-target, .moon-btn').forEach(b => b.classList.remove('active')); DOM.ssInfo.style.opacity = "0";
    new TWEEN.Tween(App.camera.position).to(new THREE.Vector3(0, 150, 200), 1500).start();
    new TWEEN.Tween(App.controls.target).to(new THREE.Vector3(0,0,0), 1500).start();
});

DOM.ssSpeed.addEventListener('input', e => { SSEngine.speedMulti = parseFloat(e.target.value) / 10; document.getElementById('ss-speed-val').textContent = `${(SSEngine.speedMulti*10).toFixed(1)}x`; });


// ================= [ 6. 글로벌 라우팅 및 애니메이션 루프 ] =================
document.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('click', () => {
        DOM.lobby.style.opacity = "0";
        setTimeout(() => {
            DOM.lobby.style.display = "none"; DOM.btnHub.style.display = "block"; 
            const targetMod = card.dataset.module;
            if (targetMod === 'deepspace') { DOM.uiDS.style.display = 'block'; launchDeepSpace(); }
            else if (targetMod === 'solarsystem') { DOM.uiSS.style.display = 'block'; launchSolarSystem(); }
        }, 500);
    });
});

DOM.btnHub.addEventListener('click', () => {
    DOM.uiDS.style.display = 'none'; DOM.uiSS.style.display = 'none'; DOM.btnHub.style.display = 'none';
    App.mode = 'lobby'; clearScene(); buildLobbyBackground();
    DOM.lobby.style.display = 'flex'; setTimeout(() => DOM.lobby.style.opacity = "1", 100);
});

DOM.dsTargets.forEach(btn => btn.addEventListener('click', (e) => {
    DOM.dsTargets.forEach(b => b.classList.remove('active')); e.target.closest('.target-btn').classList.add('active');
    dsWarpTo(e.target.closest('.target-btn').dataset.target);
}));
DOM.bhMass.addEventListener('input', dsUpdatePhysics); DOM.bhDist.addEventListener('input', dsUpdatePhysics);

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update(); 

    if (App.mode === 'lobby') {
        App.scene.rotation.y += 0.0005;
    } 
    else if (App.mode === 'deepspace') {
        Object.keys(DB.deepspace).forEach(k => { if(DB.deepspace[k].type === 'nebula' && DSEngine.objects[k]) DSEngine.objects[k].rotation.y += 0.0002; });
        if (DSEngine.bh.disk) {
            const positions = DSEngine.bh.disk.geometry.attributes.position.array;
            const currentScale = DSEngine.bh.eh.scale.x; const massFactor = parseFloat(DOM.bhMass.value) / 10;
            for(let i=0; i < DSEngine.bh.count; i++) {
                const x = positions[i*3], z = positions[i*3+2]; const r = Math.sqrt(x*x + z*z); let t = Math.atan2(z, x);
                t += DSEngine.bh.speeds[i] * (1.2 / massFactor);
                let nR = r - 0.01; if (nR < 1.1 * currentScale) nR = (10 + Math.random() * 20) * currentScale; 
                positions[i*3] = Math.cos(t) * nR; positions[i*3+2] = Math.sin(t) * nR;
            }
            DSEngine.bh.disk.geometry.attributes.position.needsUpdate = true;
        }
    } 
    else if (App.mode === 'solarsystem') {
        // 행성 공전/자전
        SSEngine.planets.forEach(p => { p.pivot.rotation.y += p.speed * SSEngine.speedMulti; p.mesh.rotation.y += 0.05 * SSEngine.speedMulti; });
        // 위성 공전
        SSEngine.moons.forEach(m => { m.pivot.rotation.y += m.speed * SSEngine.speedMulti; });

        // 행성 또는 위성 카메라 트래킹
        if (SSEngine.tracked) {
            const tPos = new THREE.Vector3(); 
            SSEngine.tracked.mesh.getWorldPosition(tPos); // 월드 절대좌표 추출 (위성의 경우 행성 공전 + 위성 공전이 합쳐짐)
            
            App.controls.target.lerp(tPos, 0.1);
            
            // 타겟이 위성인지 행성인지에 따라 카메라 줌 거리 조절
            const isMoon = SSEngine.tracked.data.speed !== undefined && SSEngine.tracked.parent !== undefined;
            const zDist = isMoon ? SSEngine.tracked.data.r * 8 + 2 : SSEngine.tracked.data.r * 5 + 10;
            
            App.camera.position.lerp(tPos.clone().add(new THREE.Vector3(zDist, zDist/2, zDist)), 0.05);
        }
    }

    App.controls.update();
    App.renderer.render(App.scene, App.camera);
}

window.onload = initGlobalCore;