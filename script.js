// =======================================================================
// HAFS Grand Observatory (V13.0 Quantum Jump Edition)
// Advanced Mathematics: Logarithmic Spirals, Relativistic Beaming
// Comprehensive DB: All Moon Images Included
// =======================================================================

const App = { mode: 'lobby', scene: null, camera: null, renderer: null, controls: null };

// --- 1. 천문 대백과사전 데이터베이스 (모든 위성 사진 및 메트릭스 추가) ---
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
        { id: "earth", name: "EARTH (지구)", r: 2.0, d: 40, speed: 0.029, color: 0x3366ff, img: "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg", temp: "15°C", orb: "29.78", desc: "액체 상태의 물이 존재하는 생명체 거주 행성.", details: "다이나모 이론에 의한 자기장 형성으로 생명체를 보호합니다.", atm: [{n: "질소(N2)", p: 78, c: "#8892b0"}, {n: "산소(O2)", p: 21, c: "#66ccff"}], internal: [{n: "지각", p: 5, c: "#8b7355"}, {n: "맨틀", p: 40, c: "#b33c00"}, {n: "외핵", p: 35, c: "#ff6600"}, {n: "내핵", p: 20, c: "#ffcc00"}], 
          moons: [{id:"luna", name:"Luna", r:0.5, d:4, speed:0.08, color:0xaaaaaa, img: "https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg", desc:"지구와의 조석 고정(Tidal Locking)으로 항상 같은 면만 보입니다."}] },
        { id: "mars", name: "MARS (화성)", r: 1.5, d: 55, speed: 0.024, color: 0xff4422, img: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg", temp: "-63°C", orb: "24.07", desc: "산화철로 붉게 보이며 과거 물이 흘렀던 흔적이 있는 행성.", details: "지구의 1% 수준인 희박한 대기를 가졌습니다.", atm: [{n: "CO2", p: 95, c: "#ff6666"}, {n: "N2", p: 3, c: "#8892b0"}], internal: [{n: "지각", p: 10, c: "#cc4422"}, {n: "맨틀", p: 60, c: "#993311"}, {n: "코어", p: 30, c: "#551100"}], 
          moons: [{id:"phobos", name:"Phobos", r:0.2, d:2, speed:0.15, color:0x888888, img: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Phobos_colour_2008.jpg", desc:"점점 추락 중인 위성."}, {id:"deimos", name:"Deimos", r:0.15, d:3, speed:0.1, color:0x777777, img: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Deimos-MRO.jpg", desc:"작고 어두운 감자 모양의 위성."}] },
        { id: "jupiter", name: "JUPITER (목성)", r: 5.5, d: 85, speed: 0.013, color: 0xdda050, img: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg", temp: "-110°C", orb: "13.07", desc: "태양계에서 가장 거대한 가스 행성.", details: "액체 금속 수소 바다가 초강력 자기장을 만들어냅니다. 대적점이 특징입니다.", atm: [{n: "H2", p: 89, c: "#4da6ff"}, {n: "He", p: 10, c: "#ffcc99"}], internal: [{n: "기체 수소", p: 15, c: "#ffeebb"}, {n: "액체 금속 수소", p: 70, c: "#99aacc"}, {n: "암석 코어", p: 15, c: "#444444"}], 
          moons: [{id:"io", name:"Io", r:0.4, d:7, speed:0.12, color:0xffff00, img: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Io_highest_resolution_true_color.jpg", desc:"강력한 조석력으로 화산 활동이 가장 활발한 천체."}, {id:"europa", name:"Europa", r:0.35, d:9, speed:0.09, color:0xeeeeee, img: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Europa-moon.jpg", desc:"얼음 지각 아래 거대한 바다가 존재하여 생명체 탐사 1순위 위성입니다."}] },
        { id: "saturn", name: "SATURN (토성)", r: 4.5, d: 120, speed: 0.009, color: 0xead6b8, img: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg", temp: "-140°C", orb: "9.69", desc: "아름다운 고리 시스템을 가진 거대 가스 행성.", details: "밀도가 물보다 낮으며 얼음 조각으로 이루어진 고리가 있습니다.", atm: [{n: "H2", p: 96, c: "#4da6ff"}, {n: "He", p: 3, c: "#ffcc99"}], internal: [{n: "기체 수소", p: 20, c: "#eeddcc"}, {n: "금속 수소", p: 60, c: "#8899aa"}, {n: "암석 코어", p: 20, c: "#333333"}], hasRing: true, ringColor: 0xeeddcc, ringInner: 1.5, ringOuter: 2.8, 
          moons: [{id:"titan", name:"Titan", r:0.7, d:8, speed:0.05, color:0xffaa55, img: "https://upload.wikimedia.org/wikipedia/commons/9/90/Titan_in_true_color.jpg", desc:"짙은 대기와 메탄 호수를 가진 유일한 위성입니다."}, {id:"enceladus", name:"Enceladus", r:0.2, d:6, speed:0.08, color:0xffffff, img: "https://upload.wikimedia.org/wikipedia/commons/8/83/Enceladus_stripes_104.jpg", desc:"얼음 틈새로 물을 뿜어내는 간헐천이 발견되었습니다."}] },
        { id: "neptune", name: "NEPTUNE (해왕성)", r: 3.0, d: 165, speed: 0.005, color: 0x3333cc, img: "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg", temp: "-200°C", orb: "5.43", desc: "초음속 강풍이 부는 태양계 최외곽 얼음 거성.", details: "태양에서 가장 멀리 떨어져 폭력적인 바람이 붑니다.", atm: [{n: "H2", p: 80, c: "#4da6ff"}, {n: "He", p: 19, c: "#ffcc99"}, {n: "CH4", p: 1, c: "#66ffcc"}], internal: [{n: "가스 대기", p: 15, c: "#3333cc"}, {n: "얼음 맨틀", p: 65, c: "#222288"}, {n: "암석 코어", p: 20, c: "#111111"}], 
          moons: [{id:"triton", name:"Triton", r:0.4, d:5, speed:0.04, color:0xaabbcc, img: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Triton_moon_mosaic_Voyager_2_%28large%29.jpg", desc:"해왕성의 자전과 반대로 공전하는 역행 위성. 액체 질소 간헐천이 있습니다."}] }
    ],
    probes: [ /* 이전 탐사선 코드 동일 사용 */ 
        { id: "voyager1", name: "VOYAGER 1", launch: "1977", target: "Interstellar", distAU: 162.5, vel: "17.0", img: "https://upload.wikimedia.org/wikipedia/commons/6/60/Voyager_spacecraft_model.png", power: 40, desc: "인류 역사상 가장 멀리 떨어진 탐사선.", details: "성간 공간에 진입했습니다.", angle: Math.PI / 4 },
        { id: "voyager2", name: "VOYAGER 2", launch: "1977", target: "Outer Planets", distAU: 136.0, vel: "15.3", img: "https://upload.wikimedia.org/wikipedia/commons/6/60/Voyager_spacecraft_model.png", power: 38, desc: "외행성계 그랜드 투어 완수.", details: "목,토,천,해왕성 탐사.", angle: Math.PI * 1.8 },
        { id: "newhorizons", name: "NEW HORIZONS", launch: "2006", target: "Pluto/Kuiper", distAU: 58.0, vel: "13.8", img: "https://upload.wikimedia.org/wikipedia/commons/f/fb/New_Horizons_Transparent.png", power: 75, desc: "명왕성과 카이퍼 벨트를 탐사 중인 우주선.", details: "명왕성의 하트 모양 지형을 촬영했습니다.", angle: Math.PI }
    ]
};

// --- 엔진 메모리 ---
const DSEngine = { objects: {}, bh: { eh: null, ps: null, disk: null, speeds: [], count: 30000, geometry: null } };
const SSEngine = { planets: [], moons: [], tracked: null, speedMulti: 1.0 };
const PREngine = { probes: [], tracked: null };

// --- DOM 바인딩 ---
const DOM = {
    lobby: document.getElementById('ui-lobby'), btnHub: document.getElementById('btn-return-hub'),
    uiDS: document.getElementById('ui-deepspace'), uiSS: document.getElementById('ui-solarsystem'), uiPR: document.getElementById('ui-probes'),
    
    // DS
    dsTargets: document.querySelectorAll('.ds-target'), dsInfo: document.getElementById('ds-info'), dsTitle: document.getElementById('ds-title'), dsMedia: document.getElementById('ds-media'), dsDesc: document.getElementById('ds-desc'), dsDetails: document.getElementById('ds-details'),
    dsNormal: document.getElementById('ds-normal-info'), dsSubList: document.getElementById('ds-sub-list'), dsBHCtrl: document.getElementById('ds-bh-controls'), bhMass: document.getElementById('bh-mass'), bhDist: document.getElementById('bh-dist'),
    dsMetricsBar: document.getElementById('ds-metrics-bar'), dsMetricsLegend: document.getElementById('ds-metrics-legend'),
    
    // SS
    ssList: document.getElementById('ss-planet-list'), ssSpeed: document.getElementById('ss-speed'), ssBtnReset: document.getElementById('btn-ss-reset'),
    ssInfo: document.getElementById('ss-info'), ssName: document.getElementById('ss-name'), ssMedia: document.getElementById('ss-media'), ssDesc: document.getElementById('ss-desc'), ssDetails: document.getElementById('ss-details'),
    ssTemp: document.getElementById('ss-temp'), ssOrb: document.getElementById('ss-orb'), ssCompBar: document.getElementById('ss-comp-bar'), ssCompLegend: document.getElementById('ss-comp-legend'),
    ssInternalBar: document.getElementById('ss-internal-bar'), ssInternalLegend: document.getElementById('ss-internal-legend'), ssMoonsCont: document.getElementById('ss-moons-container'), ssMoonsList: document.getElementById('ss-moons-list'),
    
    // PR
    prList: document.getElementById('pr-list'), btnPrReset: document.getElementById('btn-pr-reset'),
    prInfo: document.getElementById('pr-info'), prName: document.getElementById('pr-name'), prMedia: document.getElementById('pr-media'), prDesc: document.getElementById('pr-desc'), prDetails: document.getElementById('pr-details'),
    prLaunch: document.getElementById('pr-launch'), prTarget: document.getElementById('pr-target'), prPowerBar: document.getElementById('pr-power-bar'),
    prDist: document.getElementById('pr-dist'), prVel: document.getElementById('pr-vel'), prDelay: document.getElementById('pr-delay')
};

// ================= [ 글로벌 초기화 ] =================
function initGlobalCore() {
    const container = document.getElementById('three-canvas');
    App.scene = new THREE.Scene();
    App.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 25000);
    App.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    App.renderer.setSize(window.innerWidth, window.innerHeight);
    App.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(App.renderer.domElement);
    App.controls = new THREE.OrbitControls(App.camera, App.renderer.domElement);
    App.controls.enableDamping = true; App.controls.dampingFactor = 0.05;

    buildLobbyBackground();
    window.addEventListener('resize', () => { App.camera.aspect = window.innerWidth / window.innerHeight; App.camera.updateProjectionMatrix(); App.renderer.setSize(window.innerWidth, window.innerHeight); });
    animate();
}

function clearScene() {
    while(App.scene.children.length > 0) { App.scene.remove(App.scene.children[0]); }
    DSEngine.objects = {}; DSEngine.bh.disk = null; DSEngine.bh.geometry = null;
    SSEngine.planets = []; SSEngine.moons = []; SSEngine.tracked = null;
    PREngine.probes = []; PREngine.tracked = null;
}

function buildLobbyBackground() {
    App.scene.fog = new THREE.FogExp2(0x010204, 0.0005);
    const bgGeo = new THREE.BufferGeometry(); const bgPos = new Float32Array(5000 * 3);
    for(let i=0; i<5000*3; i++) bgPos[i] = (Math.random() - 0.5) * 1000;
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    App.scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({color: 0x667788, size: 2})));
    App.camera.position.set(0, 0, 500); App.controls.target.set(0, 0, 0);
}

// ================= [ MODULE 1: DEEP SPACE (Math Algorithms Upgraded) ] =================
function launchDeepSpace() {
    App.mode = 'deepspace'; clearScene(); App.scene.fog = new THREE.FogExp2(0x010204, 0.0001);
    
    // 우주 배경 먼지
    const bgGeo = new THREE.BufferGeometry(); const bgPos = new Float32Array(15000 * 3);
    for(let i=0; i<15000*3; i++) bgPos[i] = (Math.random() - 0.5) * 15000;
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    App.scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({color: 0x445566, size: 2})));

    for (const [key, data] of Object.entries(DB.deepspace)) {
        if (data.type === 'galaxy') {
            // [업그레이드 1] 은하의 대수 나선(Logarithmic Spiral) 렌더링
            const geo = new THREE.BufferGeometry(); const pos = new Float32Array(data.count * 3); const col = new Float32Array(data.count * 3);
            const baseCol = new THREE.Color(data.color); const arms = 4;
            for(let i=0; i<data.count; i++) {
                let r = Math.random() * 300; 
                let armOffset = (i % arms) * (Math.PI * 2 / arms);
                // 중심일수록 회전이 빽빽하고 멀수록 풀어지는 나선 수학 공식
                let theta = r * 0.03 + armOffset + (Math.random()-0.5)*0.8;
                let x = Math.cos(theta) * r;
                let z = Math.sin(theta) * r;
                // 중심부 벌지(Bulge)를 위해 중앙일수록 두께(y) 증가
                let y = (Math.random()-0.5) * (1500 / (r*r + 50)); 
                
                pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z;
                // 중앙은 밝은 노란색, 외곽은 푸른색
                const mix = new THREE.Color(0xffeedd).lerp(baseCol, r/300); 
                col[i*3] = mix.r; col[i*3+1] = mix.g; col[i*3+2] = mix.b;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
            const cloud = new THREE.Points(geo, new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending }));
            cloud.position.copy(data.coords); App.scene.add(cloud); DSEngine.objects[key] = cloud;
        } 
        else if (data.type === 'nebula' || data.type === 'cluster') {
            // 일반 성운 렌더링 (구형 군집)
            const geo = new THREE.BufferGeometry(); const pos = new Float32Array(data.count * 3); const col = new Float32Array(data.count * 3);
            const baseCol = new THREE.Color(data.color);
            for(let i=0; i<data.count * 3; i+=3) {
                const r = Math.pow(Math.random(), 2), t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
                const spread = 350; 
                pos[i] = r * Math.sin(p) * Math.cos(t) * spread; pos[i+1] = r * Math.sin(p) * Math.sin(t) * (spread * 0.4); pos[i+2] = r * Math.cos(p) * spread;
                const mix = new THREE.Color(0xffffff).lerp(baseCol, r); col[i] = mix.r; col[i+1] = mix.g; col[i+2] = mix.b;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
            const cloud = new THREE.Points(geo, new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }));
            cloud.position.copy(data.coords); App.scene.add(cloud); DSEngine.objects[key] = cloud;
        }
        else if (data.type === 'blackhole') {
            // [업그레이드 2] 블랙홀 안정화 원반 및 도플러 빔 기본 설정
            const bhGroup = new THREE.Group();
            DSEngine.bh.eh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), new THREE.MeshBasicMaterial({ color: 0x000000 }));
            DSEngine.bh.ps = new THREE.Mesh(new THREE.SphereGeometry(1.5, 64, 64), new THREE.MeshBasicMaterial({ color: 0xff3366, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, side: THREE.BackSide }));
            bhGroup.add(DSEngine.bh.eh); bhGroup.add(DSEngine.bh.ps);

            const geo = new THREE.BufferGeometry(); const pos = new Float32Array(DSEngine.bh.count * 3); const col = new Float32Array(DSEngine.bh.count * 3);
            for(let i=0; i < DSEngine.bh.count; i++) {
                // 완전히 무작위가 아닌, 중심으로 갈수록 밀도 높은 구조적 원반
                const r = 1.6 + Math.pow(Math.random(), 2) * 25; 
                const t = Math.random() * Math.PI * 2;
                pos[i*3] = Math.cos(t) * r; 
                pos[i*3+1] = (Math.random() - 0.5) * (1.5 / Math.sqrt(r)); // 얇고 평평한 원반
                pos[i*3+2] = Math.sin(t) * r;
                DSEngine.bh.speeds[i] = 2.5 / Math.pow(r, 1.5); // 케플러 제3법칙 속도
                
                // 색상은 animate 루프에서 실시간으로 도플러 연산을 통해 입혀집니다.
                col[i*3] = 1.0; col[i*3+1] = 0.5; col[i*3+2] = 0.0;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
            DSEngine.bh.geometry = geo; // 참조 저장
            DSEngine.bh.disk = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.25, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
            bhGroup.add(DSEngine.bh.disk); bhGroup.position.copy(data.coords); bhGroup.rotation.x = 0.15; 
            App.scene.add(bhGroup); DSEngine.objects[key] = bhGroup;
        }
    }
    App.camera.position.set(0, 0, 500); App.controls.target.set(0, 0, 0); dsWarpTo('home'); 
}

function dsWarpTo(targetKey) {
    const data = DB.deepspace[targetKey]; const targetObj = DSEngine.objects[targetKey];
    DOM.dsInfo.style.opacity = "0";
    const zoomOffset = data.type === 'blackhole' ? 50 : 450;
    const endPosition = new THREE.Vector3(targetObj.position.x, targetObj.position.y + (zoomOffset/4), targetObj.position.z + zoomOffset);

    new TWEEN.Tween(App.camera.position).to(endPosition, 3500).easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(() => App.camera.lookAt(targetObj.position))
        .onComplete(() => {
            App.controls.target.copy(targetObj.position);
            DOM.dsTitle.textContent = data.name; DOM.dsMedia.style.backgroundImage = `url('${data.img}')`;
            DOM.dsDesc.textContent = data.desc; DOM.dsDetails.textContent = data.details;
            
            if (data.type === 'blackhole') {
                DOM.dsNormal.style.display = 'none'; DOM.dsBHCtrl.style.display = 'block'; dsUpdatePhysics();
            } else {
                DOM.dsNormal.style.display = 'block'; DOM.dsBHCtrl.style.display = 'none';
                
                // 데이터 메트릭스(Astro-metrics) 렌더링
                DOM.dsMetricsBar.innerHTML = ''; DOM.dsMetricsLegend.innerHTML = '';
                if(data.metrics) {
                    data.metrics.forEach(c => {
                        DOM.dsMetricsBar.innerHTML += `<div class="comp-segment" style="width:${c.p}%; background:${c.c};">${c.p}%</div>`;
                        DOM.dsMetricsLegend.innerHTML += `<div class="legend-item"><div class="legend-color" style="background:${c.c};"></div>${c.n}</div>`;
                    });
                }
                DOM.dsSubList.innerHTML = ''; data.subs.forEach(s => DOM.dsSubList.innerHTML += `<li><span class="sub-title">${s.t}</span><span class="sub-detail">${s.d}</span></li>`);
            }
            DOM.dsInfo.style.opacity = "1";
        }).start();
}

function dsUpdatePhysics() {
    const mass = parseFloat(DOM.bhMass.value), dist = parseFloat(DOM.bhDist.value);
    const rs = mass * 3.0, scale = Math.max(1, mass / 10);
    if(DSEngine.bh.eh) { DSEngine.bh.eh.scale.set(scale, scale, scale); DSEngine.bh.ps.scale.set(scale, scale, scale); DSEngine.bh.disk.scale.set(scale, scale, scale); }
    const timeDilation = (dist * rs > rs) ? 1 / Math.sqrt(1 - (rs / (dist * rs))) : 0;
    document.getElementById('bh-mass-val').textContent = mass.toFixed(1); document.getElementById('bh-dist-val').textContent = `${dist} Rs`;
    document.getElementById('bh-rs').textContent = `${rs.toFixed(2)} km`;
    document.getElementById('bh-time').textContent = timeDilation > 0 ? timeDilation.toFixed(4) + "x" : "INFINITE";
}

// ================= [ 5. MODULE 2: SOLAR SYSTEM (위성 사진 추가 됨) ] =================
function launchSolarSystem() {
    App.mode = 'solarsystem'; clearScene(); App.scene.fog = new THREE.FogExp2(0x010205, 0.0005);
    
    const starsGeo = new THREE.BufferGeometry(); const starsPos = new Float32Array(5000 * 3);
    for(let i=0; i<5000*3; i++) starsPos[i] = (Math.random() - 0.5) * 2000;
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    App.scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({color: 0xaaaaaa, size: 1.5})));

    const sun = new THREE.Mesh(new THREE.SphereGeometry(8, 64, 64), new THREE.MeshBasicMaterial({ color: 0xffcc33 }));
    App.scene.add(sun); App.scene.add(new THREE.PointLight(0xffffff, 2, 800)); App.scene.add(new THREE.AmbientLight(0x333333));

    DOM.ssList.innerHTML = '';
    
    DB.solarsystem.forEach(pData => {
        const pMesh = new THREE.Mesh(new THREE.SphereGeometry(pData.r, 32, 32), new THREE.MeshStandardMaterial({ color: pData.color, roughness: 0.6 }));
        pMesh.position.x = pData.d;

        if(pData.hasRing) {
            const ring = new THREE.Mesh(new THREE.RingGeometry(pData.r * pData.ringInner, pData.r * pData.ringOuter, 64), new THREE.MeshStandardMaterial({ color: pData.ringColor, side: THREE.DoubleSide, transparent:true, opacity:0.7 }));
            ring.rotation.x = Math.PI / 2; pMesh.add(ring);
        }

        if(pData.moons && pData.moons.length > 0) {
            pData.moons.forEach(mData => {
                const mMesh = new THREE.Mesh(new THREE.SphereGeometry(mData.r, 16, 16), new THREE.MeshStandardMaterial({color: mData.color}));
                mMesh.position.x = mData.d;
                const mPivot = new THREE.Group(); mPivot.add(mMesh); pMesh.add(mPivot);
                const mOrbit = new THREE.Mesh(new THREE.RingGeometry(mData.d - 0.05, mData.d + 0.05, 64), new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide, transparent:true, opacity:0.5 }));
                mOrbit.rotation.x = Math.PI / 2; pMesh.add(mOrbit);
                SSEngine.moons.push({ id: mData.id, pivot: mPivot, mesh: mMesh, speed: mData.speed, parent: pMesh, data: mData });
            });
        }

        const pivot = new THREE.Group(); pivot.add(pMesh); App.scene.add(pivot);
        const orbit = new THREE.Mesh(new THREE.RingGeometry(pData.d - 0.1, pData.d + 0.1, 128), new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide }));
        orbit.rotation.x = Math.PI / 2; App.scene.add(orbit);

        SSEngine.planets.push({ id: pData.id, pivot, mesh: pMesh, speed: pData.speed, data: pData, type: 'planet' });

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

function ssUpdatePlanetInfo(pData) {
    DOM.ssName.textContent = pData.name; DOM.ssMedia.style.backgroundImage = `url('${pData.img}')`; 
    DOM.ssDesc.textContent = pData.desc; DOM.ssDetails.textContent = pData.details;
    DOM.ssTemp.textContent = pData.temp; DOM.ssOrb.textContent = `${pData.orb} km/s`;

    DOM.ssCompBar.innerHTML = ''; DOM.ssCompLegend.innerHTML = '';
    if(pData.atm) {
        pData.atm.forEach(c => {
            DOM.ssCompBar.innerHTML += `<div class="comp-segment" style="width:${c.p}%; background:${c.c};">${c.p}%</div>`;
            DOM.ssCompLegend.innerHTML += `<div class="legend-item"><div class="legend-color" style="background:${c.c};"></div>${c.n}</div>`;
        });
    }

    DOM.ssInternalBar.innerHTML = ''; DOM.ssInternalLegend.innerHTML = '';
    if(pData.internal) {
        pData.internal.forEach(layer => {
            DOM.ssInternalBar.innerHTML += `<div class="internal-segment" style="height:${layer.p * 1.5}px; background:${layer.c}; border-bottom:1px solid rgba(0,0,0,0.5);">${layer.p}%</div>`;
            DOM.ssInternalLegend.innerHTML += `<div class="legend-item"><div class="legend-color" style="background:${layer.c};"></div>${layer.n}</div>`;
        });
    }

    if(pData.moons && pData.moons.length > 0) {
        DOM.ssMoonsCont.style.display = 'block'; DOM.ssMoonsList.innerHTML = '';
        pData.moons.forEach(mData => {
            const btn = document.createElement('button'); btn.className = 'moon-btn'; btn.textContent = mData.name;
            btn.onclick = () => {
                document.querySelectorAll('.moon-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active');
                SSEngine.tracked = SSEngine.moons.find(m => m.id === mData.id);
                // 위성 데이터로 UI 덮어쓰기 (사진 포함)
                DOM.ssName.textContent = mData.name;
                DOM.ssMedia.style.backgroundImage = `url('${mData.img}')`; 
                DOM.ssDesc.textContent = `[위성 데이터] ${mData.desc}`;
                DOM.ssDetails.textContent = ""; // 위성은 세부설명 생략
            };
            DOM.ssMoonsList.appendChild(btn);
        });
    } else {
        DOM.ssMoonsCont.style.display = 'none';
    }
    DOM.ssInfo.style.opacity = "1";
}

// ================= [ 6. MODULE 3: INTERSTELLAR PROBES ] =================
function launchProbes() {
    App.mode = 'probes'; clearScene(); App.scene.fog = new THREE.FogExp2(0x010205, 0.0001); 
    
    const starsGeo = new THREE.BufferGeometry(); const starsPos = new Float32Array(10000 * 3);
    for(let i=0; i<10000*3; i++) starsPos[i] = (Math.random() - 0.5) * 15000;
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    App.scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({color: 0x888888, size: 2})));

    const sun = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffddaa }));
    App.scene.add(sun); App.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const refOrbits = [0.39, 0.72, 1.0, 1.52, 5.2, 9.5, 19.2, 30.1]; const scaleAU = 10;
    refOrbits.forEach(r => {
        const orbit = new THREE.Mesh(new THREE.RingGeometry(r*scaleAU - 0.2, r*scaleAU + 0.2, 128), new THREE.MeshBasicMaterial({ color: 0x112233, side: THREE.DoubleSide }));
        orbit.rotation.x = Math.PI / 2; App.scene.add(orbit);
    });

    DOM.prList.innerHTML = '';
    
    DB.probes.forEach(pData => {
        const dist = pData.distAU * scaleAU;
        const x = Math.cos(pData.angle) * dist;
        const z = Math.sin(pData.angle) * dist;
        
        const pGroup = new THREE.Group();
        const core = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), new THREE.MeshBasicMaterial({ color: 0xa277ff, wireframe: true }));
        const dish = new THREE.Mesh(new THREE.RingGeometry(1.5, 2.5, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 }));
        dish.rotation.x = Math.PI / 2;
        pGroup.add(core); pGroup.add(dish);
        pGroup.position.set(x, 0, z);
        App.scene.add(pGroup);

        const points = [new THREE.Vector3(0,0,0), new THREE.Vector3(x, 0, z)];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({ color: 0xa277ff, transparent: true, opacity: 0.3 });
        const line = new THREE.Line(lineGeo, lineMat); App.scene.add(line);

        PREngine.probes.push({ id: pData.id, mesh: pGroup, data: pData });

        const btn = document.createElement('button'); btn.className = 'target-btn pr-target';
        btn.innerHTML = `<span class="btn-title" style="color:#a277ff;">${pData.name}</span>`;
        btn.onclick = () => {
            document.querySelectorAll('.pr-target').forEach(b => b.classList.remove('active')); btn.classList.add('active');
            PREngine.tracked = PREngine.probes.find(p => p.id === pData.id);
            prUpdateInfo(pData);
        };
        DOM.prList.appendChild(btn);
    });
    App.camera.position.set(0, 500, 800); App.controls.target.set(0, 0, 0);
}

function prUpdateInfo(pData) {
    DOM.prName.textContent = pData.name; DOM.prMedia.style.backgroundImage = `url('${pData.img}')`; 
    DOM.prDesc.textContent = pData.desc; DOM.prDetails.textContent = pData.details;
    DOM.prLaunch.textContent = pData.launch; DOM.prTarget.textContent = pData.target;
    
    DOM.prPowerBar.style.width = `${pData.power}%`;
    DOM.prPowerBar.textContent = pData.power > 0 ? `${pData.power}%` : "OFFLINE";
    DOM.prPowerBar.style.background = pData.power > 30 ? "#a277ff" : "#ff3366";

    DOM.prDist.textContent = `${pData.distAU} AU`;
    DOM.prVel.textContent = `${pData.vel} km/s`;
    
    const distKm = pData.distAU * 1.496e8; const seconds = distKm / 300000;
    DOM.prDelay.textContent = `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;

    DOM.prInfo.style.opacity = "1";

    const tPos = PREngine.tracked.mesh.position;
    new TWEEN.Tween(App.controls.target).to(tPos, 1500).start();
    const dirToSun = tPos.clone().normalize().multiplyScalar(-20); 
    new TWEEN.Tween(App.camera.position).to(tPos.clone().add(new THREE.Vector3(0, 10, 0)).add(dirToSun), 1500).start();
}

// ================= [ 7. 글로벌 라우팅 및 애니메이션 루프 ] =================
document.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('click', () => {
        DOM.lobby.style.opacity = "0";
        setTimeout(() => {
            DOM.lobby.style.display = "none"; DOM.btnHub.style.display = "block"; 
            const targetMod = card.dataset.module;
            if (targetMod === 'deepspace') { DOM.uiDS.style.display = 'block'; launchDeepSpace(); }
            else if (targetMod === 'solarsystem') { DOM.uiSS.style.display = 'block'; launchSolarSystem(); }
            else if (targetMod === 'probes') { DOM.uiPR.style.display = 'block'; launchProbes(); }
        }, 500);
    });
});

DOM.btnHub.addEventListener('click', () => {
    DOM.uiDS.style.display = 'none'; DOM.uiSS.style.display = 'none'; DOM.uiPR.style.display = 'none'; DOM.btnHub.style.display = 'none';
    App.mode = 'lobby'; clearScene(); buildLobbyBackground();
    DOM.lobby.style.display = 'flex'; setTimeout(() => DOM.lobby.style.opacity = "1", 100);
});

DOM.dsTargets.forEach(btn => btn.addEventListener('click', (e) => { DOM.dsTargets.forEach(b => b.classList.remove('active')); e.target.closest('.target-btn').classList.add('active'); dsWarpTo(e.target.closest('.target-btn').dataset.target); }));
DOM.bhMass.addEventListener('input', dsUpdatePhysics); DOM.bhDist.addEventListener('input', dsUpdatePhysics);

DOM.ssBtnReset.addEventListener('click', () => {
    SSEngine.tracked = null; document.querySelectorAll('.ss-target, .moon-btn').forEach(b => b.classList.remove('active')); DOM.ssInfo.style.opacity = "0";
    new TWEEN.Tween(App.camera.position).to(new THREE.Vector3(0, 150, 200), 1500).start(); new TWEEN.Tween(App.controls.target).to(new THREE.Vector3(0,0,0), 1500).start();
});
DOM.ssSpeed.addEventListener('input', e => { SSEngine.speedMulti = parseFloat(e.target.value) / 10; document.getElementById('ss-speed-val').textContent = `${(SSEngine.speedMulti*10).toFixed(1)}x`; });

DOM.btnPrReset.addEventListener('click', () => {
    PREngine.tracked = null; document.querySelectorAll('.pr-target').forEach(b => b.classList.remove('active')); DOM.prInfo.style.opacity = "0";
    new TWEEN.Tween(App.camera.position).to(new THREE.Vector3(0, 500, 800), 1500).start(); new TWEEN.Tween(App.controls.target).to(new THREE.Vector3(0,0,0), 1500).start();
});

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update(); 

    if (App.mode === 'lobby') { App.scene.rotation.y += 0.0005; } 
    else if (App.mode === 'deepspace') {
        Object.keys(DB.deepspace).forEach(k => { 
            if(DB.deepspace[k].type === 'nebula' || DB.deepspace[k].type === 'galaxy') {
                if(DSEngine.objects[k]) DSEngine.objects[k].rotation.y += 0.0002; 
            }
        });
        
        // [핵심] 블랙홀 상대론적 도플러 빔 연산
        if (DSEngine.bh.disk && DSEngine.bh.geometry) {
            const positions = DSEngine.bh.geometry.attributes.position.array;
            const colors = DSEngine.bh.geometry.attributes.color.array;
            const massFactor = parseFloat(DOM.bhMass.value) / 10;
            
            for(let i=0; i < DSEngine.bh.count; i++) {
                let x = positions[i*3], z = positions[i*3+2]; 
                let r = Math.sqrt(x*x + z*z); 
                let t = Math.atan2(z, x);
                
                // 안정적인 케플러 회전
                t += DSEngine.bh.speeds[i] * (1.0 / Math.max(0.1, massFactor));
                positions[i*3] = Math.cos(t) * r; 
                positions[i*3+2] = Math.sin(t) * r;
                
                // 상대론적 도플러 효과 (다가오는 쪽 x>0 은 파랗고 밝게, 멀어지는 쪽 x<0 은 붉고 어둡게)
                // 카메라가 기본적으로 +z에서 -z를 본다고 가정
                let approaching = x / r; // -1 to 1
                let intensity = 1.0 - (r / 30); // 중심일수록 밝음
                
                let rCol = 1.0;
                let gCol = 0.5 + (approaching * 0.4); // 다가오면 g증가 (노랑/흰색)
                let bCol = 0.0 + Math.max(0, approaching * 0.8); // 다가오면 b급증 (푸른색)
                
                colors[i*3] = rCol * intensity; 
                colors[i*3+1] = gCol * intensity; 
                colors[i*3+2] = bCol * intensity;
            }
            DSEngine.bh.geometry.attributes.position.needsUpdate = true;
            DSEngine.bh.geometry.attributes.color.needsUpdate = true;
        }
    } 
    else if (App.mode === 'solarsystem') {
        SSEngine.planets.forEach(p => { p.pivot.rotation.y += p.speed * SSEngine.speedMulti; p.mesh.rotation.y += 0.05 * SSEngine.speedMulti; });
        SSEngine.moons.forEach(m => { m.pivot.rotation.y += m.speed * SSEngine.speedMulti; });
        if (SSEngine.tracked) {
            const tPos = new THREE.Vector3(); SSEngine.tracked.mesh.getWorldPosition(tPos); 
            App.controls.target.lerp(tPos, 0.1);
            const isMoon = SSEngine.tracked.data.speed !== undefined && SSEngine.tracked.parent !== undefined;
            const zDist = isMoon ? SSEngine.tracked.data.r * 8 + 2 : SSEngine.tracked.data.r * 5 + 10;
            App.camera.position.lerp(tPos.clone().add(new THREE.Vector3(zDist, zDist/2, zDist)), 0.05);
        }
    }
    else if (App.mode === 'probes') {
        PREngine.probes.forEach(p => p.mesh.rotation.y += 0.01);
    }

    App.controls.update();
    App.renderer.render(App.scene, App.camera);
}

window.onload = initGlobalCore;
