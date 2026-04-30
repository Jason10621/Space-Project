// =======================================================================
// HAFS Grand Orbital Watch - Simulation Engine (Three.js & D3.js)
// =======================================================================

// --- DOM 요소 ---
const el = {
    modeSelect: document.getElementById('sim-mode'),
    modeDisplay: document.getElementById('mode-name-display'),
    
    // Panels
    solarControls: document.getElementById('solar-controls'),
    eclipseControls: document.getElementById('eclipse-controls'),
    solarInfo: document.getElementById('solar-info'),
    eclipseInfo: document.getElementById('eclipse-info'),
    
    // Containers
    threeContainer: document.getElementById('three-container'),
    d3Container: document.getElementById('d3-container'),
    
    // Inputs
    speedSlider: document.getElementById('speed-slider'),
    speedVal: document.getElementById('speed-val'),
    camView: document.getElementById('camera-view'),
    radioEclipse: document.getElementsByName('eclipse-type'),
    distSlider: document.getElementById('moon-dist-slider'),
    distVal: document.getElementById('moon-dist-val'),
    
    // Outputs
    simDate: document.getElementById('sim-date'),
    eclipseDesc: document.getElementById('eclipse-desc'),
    obscurationVal: document.getElementById('obscuration-val')
};

// ================= [ 모드 전환 로직 ] =================
let currentMode = 'solar-system';

el.modeSelect.addEventListener('change', (e) => {
    currentMode = e.target.value;
    if (currentMode === 'solar-system') {
        el.modeDisplay.textContent = "SOLAR SYSTEM ACTIVE";
        el.solarControls.style.display = 'block';
        el.solarInfo.style.display = 'block';
        el.threeContainer.style.display = 'block';
        
        el.eclipseControls.style.display = 'none';
        el.eclipseInfo.style.display = 'none';
        el.d3Container.style.display = 'none';
    } else {
        el.modeDisplay.textContent = "ECLIPSE MODELING ACTIVE";
        el.eclipseControls.style.display = 'block';
        el.eclipseInfo.style.display = 'block';
        el.d3Container.style.display = 'block';
        
        el.solarControls.style.display = 'none';
        el.solarInfo.style.display = 'none';
        el.threeContainer.style.display = 'none';
        initEclipseD3(); // 일식 모드 켤 때 D3 렌더링
    }
});

// ================= [ 모듈 1: 태양계 3D 오비탈 탐사 (Three.js) ] =================
let scene, camera, renderer, controls;
let planets = [];
let simDays = 0;
let animationId;

// 기초 천문 데이터 (상대적 거리, 크기, 공전 속도)
const solarData = [
    { name: "Mercury", r: 0.8, d: 10, speed: 0.04, color: 0xaaaaaa },
    { name: "Venus", r: 1.2, d: 15, speed: 0.015, color: 0xeeddcc },
    { name: "Earth", r: 1.5, d: 20, speed: 0.01, color: 0x3333ff },
    { name: "Mars", r: 1.0, d: 25, speed: 0.008, color: 0xff3300 },
    { name: "Jupiter", r: 3.5, d: 40, speed: 0.002, color: 0xffcc99 },
    { name: "Saturn", r: 3.0, d: 55, speed: 0.0009, color: 0xeedd88, hasRing: true },
    { name: "Uranus", r: 2.2, d: 70, speed: 0.0004, color: 0x66ccff },
    { name: "Neptune", r: 2.1, d: 85, speed: 0.0001, color: 0x3333cc }
];

function initSolarSystem() {
    // 1. Scene 설정
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, el.threeContainer.clientWidth / el.threeContainer.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(el.threeContainer.clientWidth, el.threeContainer.clientHeight);
    el.threeContainer.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 80, 80);
    controls.update();

    // 2. 태양 생성 (발광체)
    const sunGeo = new THREE.SphereGeometry(5, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sun);

    // 태양빛
    const pointLight = new THREE.PointLight(0xffffff, 2, 300);
    scene.add(pointLight);
    const ambientLight = new THREE.AmbientLight(0x404040); // 부드러운 배경빛
    scene.add(ambientLight);

    // 3. 행성 및 궤도선 생성
    solarData.forEach(data => {
        // 행성 메쉬
        const geo = new THREE.SphereGeometry(data.r, 32, 32);
        const mat = new THREE.MeshPhongMaterial({ color: data.color });
        const mesh = new THREE.Mesh(geo, mat);
        
        // 토성 고리 예외 처리
        if(data.hasRing) {
            const ringGeo = new THREE.RingGeometry(data.r * 1.4, data.r * 2.2, 32);
            const ringMat = new THREE.MeshPhongMaterial({ color: data.color, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            mesh.add(ring);
        }

        // 궤도 축(Pivot) - 공전을 위해 중심점을 태양으로 잡음
        const pivot = new THREE.Group();
        pivot.add(mesh);
        scene.add(pivot);
        mesh.position.x = data.d;

        // 궤도선 그리기
        const pathGeo = new THREE.RingGeometry(data.d - 0.1, data.d + 0.1, 64);
        const pathMat = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide });
        const path = new THREE.Mesh(pathGeo, pathMat);
        path.rotation.x = Math.PI / 2;
        scene.add(path);

        planets.push({ mesh, pivot, speed: data.speed, data });
    });

    // 별 배경 파티클
    const starsGeo = new THREE.BufferGeometry();
    const starsArray = new Float32Array(3000);
    for(let i=0; i<3000; i++) { starsArray[i] = (Math.random() - 0.5) * 400; }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsArray, 3));
    const starsMat = new THREE.PointsMaterial({color: 0xffffff, size: 0.5});
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    animateSolar();
}

function animateSolar() {
    animationId = requestAnimationFrame(animateSolar);

    // 시뮬레이션 속도 제어
    const speedMultiplier = parseInt(el.speedSlider.value) / 10;
    simDays += speedMultiplier;
    el.simDate.textContent = `Day ${Math.floor(simDays)}`;

    // 행성 공전 업데이트
    planets.forEach(p => {
        p.pivot.rotation.y += p.speed * speedMultiplier * 0.1;
        p.mesh.rotation.y += 0.05; // 자전
    });

    // 카메라 시점 제어
    const view = el.camView.value;
    if(view === 'earth') {
        const earth = planets[2];
        const earthPos = new THREE.Vector3();
        earth.mesh.getWorldPosition(earthPos);
        controls.target.copy(earthPos); // 카메라가 지구를 바라봄
    } else if(view === 'sun') {
        controls.target.set(0,0,0);
        camera.position.set(0, 10, 20); // 태양 근접
    } else {
        controls.target.set(0,0,0); // 기본 조감도
    }

    controls.update();
    renderer.render(scene, camera);
}

// UI 이벤트
el.speedSlider.addEventListener('input', (e) => el.speedVal.textContent = `${e.target.value} days/s`);


// ================= [ 모듈 2: 정밀 일식 모델링 (D3.js) ] =================
function initEclipseD3() {
    el.d3Container.innerHTML = ''; // 초기화
    
    const width = el.d3Container.clientWidth;
    const height = el.d3Container.clientHeight;
    
    const svg = d3.select("#d3-container")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);

    // 태양, 달, 지구 크기 비율 (시뮬레이션용 스케일 조정)
    const R_sun = 80;
    const R_earth = 40;
    let R_moon = 38; // 달의 거리 조절에 따라 겉보기 크기(시직경) 변화
    
    const cx = width / 2;
    const cy = height / 2;

    // 1. 태양 그리기 (왼쪽)
    svg.append("circle")
       .attr("cx", 100)
       .attr("cy", cy)
       .attr("r", R_sun)
       .attr("fill", "#ffcc00")
       .style("filter", "drop-shadow(0 0 20px rgba(255, 204, 0, 0.8))");

    // 2. 지구 그리기 (오른쪽)
    svg.append("circle")
       .attr("cx", width - 150)
       .attr("cy", cy)
       .attr("r", R_earth)
       .attr("fill", "#3366ff");

    // 빛의 경로 (그림자 구역 렌더링)을 위한 그룹
    const shadowGroup = svg.append("g");
    
    // 3. 달 그리기 (중간에서 이동)
    const moon = svg.append("circle")
                    .attr("cx", cx)
                    .attr("cy", cy)
                    .attr("r", R_moon)
                    .attr("fill", "#555555");

    function updateEclipsePhysics() {
        const type = document.querySelector('input[name="eclipse-type"]:checked').value;
        const moonDist = parseInt(el.distSlider.value);
        
        // 달-지구 거리에 따른 달의 시직경(크기) 변화 모델링
        // 거리가 멀면(405k) 작아지고, 가까우면(360k) 커짐
        R_moon = 38 * (384 / moonDist); 
        moon.attr("r", R_moon);

        let moonY = cy; // 기본은 완벽한 정렬 (개기/금환)
        let desc = "";
        let obscuration = "100.0%";
        let shadowColor = "rgba(0,0,0,0.8)"; // 본그림자(Umbra)

        if (type === 'total') {
            desc = "개기일식(Total Eclipse): 달이 지구에 충분히 가까워, 달의 겉보기 크기가 태양을 완전히 가립니다. 지표면에 짙은 본그림자(Umbra)가 생깁니다.";
            el.distSlider.value = 365; // 근지점 근처
            moon.attr("r", 38 * (384 / 365));
            obscuration = "100.0%";
        } else if (type === 'annular') {
            desc = "금환일식(Annular Eclipse): 달이 지구에서 멀어져(원지점), 겉보기 크기가 태양보다 작습니다. 태양의 가장자리가 금반지처럼 남는 반그림자(Antumbra) 현상이 발생합니다.";
            el.distSlider.value = 405; // 원지점
            moon.attr("r", 38 * (384 / 405));
            obscuration = "92.4%";
            shadowColor = "rgba(50,50,50,0.6)"; // 반영
        } else if (type === 'partial') {
            desc = "부분일식(Partial Eclipse): 태양-달-지구가 완벽한 일직선이 아니어서, 달이 태양의 일부분만 가립니다.";
            moonY = cy - 40; // 궤도 평면 엇갈림 시뮬레이션
            moon.attr("cy", moonY);
            obscuration = "45.2%";
            shadowColor = "rgba(100,100,100,0.4)";
        }

        // 달의 y위치 초기화 복구 로직 (개기, 금환일 때)
        if(type !== 'partial') { moon.attr("cy", cy); }

        el.eclipseDesc.textContent = desc;
        el.obscurationVal.textContent = obscuration;
        el.distVal.textContent = `${el.distSlider.value},000 km`;

        // 그림자 지오메트리 업데이트 (수학적 빔 프로젝션 시뮬레이션)
        shadowGroup.selectAll("*").remove(); // 기존 그림자 삭제
        
        // 본그림자(Umbra) 또는 반영(Penumbra) 폴리곤 그리기
        shadowGroup.append("polygon")
                   .attr("points", `
                        ${cx},${moonY - R_moon} 
                        ${cx},${moonY + R_moon} 
                        ${width - 150},${cy + (type === 'annular' ? 20 : -10)} 
                        ${width - 150},${cy - (type === 'annular' ? 20 : -10)}
                   `)
                   .attr("fill", shadowColor);
    }

    // UI 이벤트 바인딩
    el.radioEclipse.forEach(r => r.addEventListener('change', updateEclipsePhysics));
    el.distSlider.addEventListener('input', updateEclipsePhysics);
    
    // 초기 실행
    updateEclipsePhysics();
}

// ================= [ 시스템 기동 ] =================
window.onload = () => {
    initSolarSystem();
};
// 브라우저 리사이즈 대응
window.addEventListener('resize', () => {
    if(currentMode === 'solar-system') {
        camera.aspect = el.threeContainer.clientWidth / el.threeContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(el.threeContainer.clientWidth, el.threeContainer.clientHeight);
    } else {
        initEclipseD3(); // D3는 리사이즈 시 다시 그리는 것이 깔끔함
    }
});