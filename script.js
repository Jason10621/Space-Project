// =======================================================================
// HAFS Deep Space Navigator - Macro to Micro Engine
// =======================================================================

// --- 1. 우주 데이터베이스 (거시적 위치 및 미시적 내부 구조) ---
const UNIVERSE_DATA = {
    'home': {
        name: "MILKY WAY (우리은하)",
        distance: "0 Light Years", scale: "100,000 Light Years",
        desc: "우리가 속해 있는 막대 나선 은하입니다. 이 거대한 우주 지도의 기준점(Origin) 역할을 합니다.",
        coords: new THREE.Vector3(0, 0, 0),
        color: 0x88bbff, particleCount: 15000,
        subSystems: [
            { title: "Orion Arm (오리온자리 팔)", detail: "태양계가 위치한 나선팔 구조입니다." },
            { title: "Sagittarius A* (궁수자리 A*)", detail: "우리은하 중심에 위치한 초거대 질량 블랙홀입니다." }
        ]
    },
    'carina': {
        name: "CARINA NEBULA (용골자리 성운)",
        distance: "8,500 Light Years", scale: "460 Light Years",
        desc: "가스와 먼지로 이루어진 거대한 별의 요람입니다. JWST가 촬영한 '우주 절벽(Cosmic Cliffs)'이 이곳에 있습니다.",
        coords: new THREE.Vector3(1200, 300, -800), // 우주 맵 상의 거시적 좌표
        color: 0xff5522, particleCount: 20000,
        subSystems: [
            { title: "Eta Carinae (에타 카리나이)", detail: "태양 질량의 100배가 넘는, 폭발 직전의 극대거성 쌍성계입니다." },
            { title: "Trumpler 14 (트럼플러 14)", detail: "성운 중심부에 위치한, 태어난 지 50만 년밖에 안 된 젊고 뜨거운 산개성단입니다." },
            { title: "Cosmic Cliffs (우주 절벽)", detail: "뜨거운 자외선 복사로 인해 가스가 깎여나가는 거대한 별 탄생 영역입니다." }
        ]
    },
    'stephan': {
        name: "STEPHAN'S QUINTET (오중주 은하군)",
        distance: "290 Million Light Years", scale: "300,000 Light Years",
        desc: "5개의 은하가 중력으로 얽혀 충돌하고 병합하는 역동적인 은하군입니다. 우주 진화의 핵심 연구 대상입니다.",
        coords: new THREE.Vector3(-2000, 1500, 1200),
        color: 0xffcc77, particleCount: 25000,
        subSystems: [
            { title: "NGC 7318a & NGC 7318b", detail: "서로 충돌하며 거대한 충격파(가스 꼬리)를 만들어내는 두 개의 나선 은하입니다." },
            { title: "NGC 7319", detail: "중심부에 활발한 초거대 블랙홀(AGN)을 품고 있는 은하입니다." },
            { title: "NGC 7320", detail: "나머지 4개와 달리, 지구에서 4천만 광년 떨어져 있어 우연히 겹쳐 보이는 전경(Foreground) 은하입니다." }
        ]
    },
    'smacs': {
        name: "SMACS 0723 (중력렌즈 은하단)",
        distance: "4.6 Billion Light Years", scale: "Unknown (Galaxy Cluster)",
        desc: "JWST의 첫 번째 딥 필드 이미지입니다. 전면에 있는 은하단의 엄청난 질량이 시공간을 휘게 만들어, 뒤편의 초기 우주 은하들을 확대해 보여줍니다(중력 렌즈 현상).",
        coords: new THREE.Vector3(3500, -2000, -4000),
        color: 0x5544ff, particleCount: 30000,
        subSystems: [
            { title: "Gravitational Lensing Arcs", detail: "중력 렌즈 현상으로 인해 시공간이 휘어져, 배경 은하들의 빛이 활처럼 휘어보이는 현상입니다." },
            { title: "Ancient Red Galaxies", detail: "적색편이(Redshift)가 매우 커서 우주 나이 10억 년 미만일 때 존재했던 초기 은하들입니다." }
        ]
    }
};

// --- 2. 3D 엔진 초기화 ---
const container = document.getElementById('three-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x02050a, 0.0001); // 깊이감을 위한 우주 안개

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
camera.position.set(0, 0, 500); // 초기 위치 (우리은하 관측)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 10000;

const celestialObjects = {}; // 생성된 3D 객체 저장소

// --- 3. 거시 및 미시 파티클 구조 생성기 ---
function initUniverseMap() {
    // 1. 전체 우주 배경 별 (Macro Starfield)
    const bgGeo = new THREE.BufferGeometry();
    const bgPos = new Float32Array(15000 * 3);
    for(let i=0; i<15000*3; i++) bgPos[i] = (Math.random() - 0.5) * 15000;
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    const bgMat = new THREE.PointsMaterial({color: 0x555555, size: 2});
    scene.add(new THREE.Points(bgGeo, bgMat));

    // 2. 각 관측 타겟의 미시적 구조(Particle Cloud) 생성 및 배치
    for (const [key, data] of Object.entries(UNIVERSE_DATA)) {
        const geo = new THREE.BufferGeometry();
        const posArray = new Float32Array(data.particleCount * 3);
        const colorArray = new Float32Array(data.particleCount * 3);
        
        const baseColor = new THREE.Color(data.color);
        const secondColor = new THREE.Color(0xffffff);

        for(let i=0; i<data.particleCount * 3; i+=3) {
            // 중심부로 갈수록 밀집되는 가우스 분포 난수
            const r = Math.pow(Math.random(), 2);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            // 은하의 형태에 따라 분산 범위 조절
            const spread = key === 'home' || key === 'stephan' ? 200 : 300; 
            
            let x = r * Math.sin(phi) * Math.cos(theta) * spread;
            let y = r * Math.sin(phi) * Math.sin(theta) * (spread * 0.3); // 원반 형태를 위해 Y축 압축
            let z = r * Math.cos(phi) * spread;

            // 좌표 저장
            posArray[i] = x; posArray[i+1] = y; posArray[i+2] = z;

            // 색상 혼합 (중심부는 하얗고 밝게, 외곽은 베이스 컬러)
            const mixRatio = r; 
            const c = secondColor.clone().lerp(baseColor, mixRatio);
            colorArray[i] = c.r; colorArray[i+1] = c.g; colorArray[i+2] = c.b;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const mat = new THREE.PointsMaterial({
            size: 1.5, vertexColors: true, transparent: true, opacity: 0.8,
            blending: THREE.AdditiveBlending // 빛이 겹치면 밝아지는 우주 효과
        });

        const cloud = new THREE.Points(geo, mat);
        // 거시적 우주 맵 상의 좌표로 이동
        cloud.position.copy(data.coords);
        
        scene.add(cloud);
        celestialObjects[key] = cloud;
    }
}

// --- 4. 초공간 도약 (Warp Drive / Tweening) 로직 ---
function warpToTarget(targetKey) {
    const data = UNIVERSE_DATA[targetKey];
    const targetCloud = celestialObjects[targetKey];

    // 상태 표시 UI 업데이트
    document.getElementById('status-text').textContent = "CALCULATING HYPERSPACE JUMP...";
    document.getElementById('status-text').style.color = "var(--color-accent-gold)";
    document.getElementById('info-hud').style.opacity = "0";

    // 카메라 도약 도착 지점 계산 (은하 중심에서 약간 떨어져서 바라보도록)
    const endPosition = new THREE.Vector3(
        targetCloud.position.x, 
        targetCloud.position.y + 150, 
        targetCloud.position.z + 400
    );

    // 카메라 위치 이동 애니메이션 (TWEEN)
    new TWEEN.Tween(camera.position)
        .to(endPosition, 4000) // 4초 동안 비행
        .easing(TWEEN.Easing.Cubic.InOut) // 처음엔 천천히, 중간에 빠르게, 끝에 천천히
        .onUpdate(() => {
            // 날아가는 동안 카메라가 타겟을 쳐다보도록
            camera.lookAt(targetCloud.position);
        })
        .onComplete(() => {
            // 도착 후 컨트롤러 타겟 재설정 및 UI 표출
            controls.target.copy(targetCloud.position);
            document.getElementById('status-text').textContent = "ORBIT ESTABLISHED";
            document.getElementById('status-text').style.color = "var(--color-status-green)";
            showTargetInfo(data);
        })
        .start();
}

// 도착 후 미시적 상세 정보 패널 업데이트
function showTargetInfo(data) {
    document.getElementById('info-title').textContent = data.name;
    document.getElementById('info-desc').textContent = data.desc;
    document.getElementById('info-scale').textContent = data.scale;
    
    const ul = document.getElementById('sub-systems-list');
    ul.innerHTML = '';
    data.subSystems.forEach(sub => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="sub-title">${sub.title}</span><span class="sub-detail">${sub.detail}</span>`;
        ul.appendChild(li);
    });

    document.getElementById('info-hud').style.opacity = "1";
    document.getElementById('info-hud').style.pointerEvents = "auto";
}

// --- 5. UI 이벤트 및 렌더링 루프 ---
document.querySelectorAll('.target-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // 버튼 활성화 스타일 변경
        document.querySelectorAll('.target-btn').forEach(b => b.classList.remove('active'));
        const currentBtn = e.target.closest('.target-btn');
        currentBtn.classList.add('active');
        
        // 초공간 도약 실행
        warpToTarget(currentBtn.dataset.target);
    });
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update(); // 애니메이션 프레임 업데이트 필수
    
    // 우주 천체들의 은은한 자전 효과
    Object.values(celestialObjects).forEach(obj => {
        obj.rotation.y += 0.0002;
    });

    controls.update();
    renderer.render(scene, camera);
}

// 런타임 시작
initUniverseMap();
animate();
showTargetInfo(UNIVERSE_DATA['home']); // 첫 화면 우리은하 정보 표출