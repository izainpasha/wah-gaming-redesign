import * as THREE from './vendor/three.module.min.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const menu = document.querySelector('.menu');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  document.querySelector('nav').classList.toggle('open', open);
});
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => {
  document.querySelector('nav').classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation');
}));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => {
    b.classList.toggle('active', b === button);
    b.setAttribute('aria-pressed', String(b === button));
  });
  document.querySelectorAll('.product').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
  });
  if (window.gsap && !reduced) gsap.fromTo('.product:not([hidden])', {opacity:0,y:18}, {opacity:1,y:0,duration:.4,stagger:.06,clearProps:'all'});
  window.ScrollTrigger?.refresh();
}));

if (window.gsap && !reduced) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('header', {y:-15,opacity:0,duration:.7});
  gsap.from('h1', {y:60,opacity:0,duration:1.1,ease:'power3.out',delay:.15});
  gsap.from('.hero-bottom', {y:20,opacity:0,duration:.8,delay:.6});
  document.querySelectorAll('.section').forEach(section => {
    gsap.from(section.querySelectorAll('h2, .section-top, .experience-copy > p, .setup-card'), {scrollTrigger:{trigger:section,start:'top 87%'},y:32,opacity:0,duration:.8,stagger:.08,ease:'power2.out'});
  });
  gsap.to('.keycap', {y:-25,scrollTrigger:{trigger:'.experience',start:'top bottom',end:'bottom top',scrub:1}});
}

// Real, procedurally modelled WebGL keyboard; no model downloads required.
try {
  const canvas = document.querySelector('#webgl');
  const stage = document.querySelector('#stage');
  const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
  renderer.setClearColor(0x000000,0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34,1,.1,100);
  camera.position.set(0,8.5,12.5); camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xe6f3ce,0x172111,3));
  const light = new THREE.DirectionalLight(0xffffff,4);light.position.set(-4,7,4);scene.add(light);
  const rim = new THREE.PointLight(0xbdff42,45,22);rim.position.set(4,2,-2);scene.add(rim);
  const keyboard = new THREE.Group();scene.add(keyboard);
  const mat = (color,metalness=.1,roughness=.45) => new THREE.MeshStandardMaterial({color,metalness,roughness});
  const charcoal = mat(0x282f27,.55), dark = mat(0x3b4438), pale = mat(0xb8c2a4), lime = mat(0xd2fc55,.15);
  const box = (w,h,d,material,x,y,z) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
    mesh.position.set(x,y,z);keyboard.add(mesh);return mesh;
  };
  box(10.5,.38,3.95,charcoal,0,-.15,0);
  box(10.38,.06,3.83,lime,0,-.33,0);
  box(10.2,.14,3.7,dark,0,.07,0);
  const labels=['ESC','1','2','3','4','5','6','7','8','9','0','−','⌫','TAB','Q','W','E','R','T','Y','U','I','O','P','[',']','CAPS','A','S','D','F','G','H','J','K','L',';','ENTER','SHIFT','Z','X','C','V','B','N','M',',','.','↑','SHIFT'];
  const textureCanvas = document.createElement('canvas');textureCanvas.width=1024;textureCanvas.height=512;
  const ctx = textureCanvas.getContext('2d');
  // One texture atlas keeps the 3D scene light enough for mobile devices.
  ctx.fillStyle='#b9c7aa';ctx.font='500 22px monospace';ctx.textAlign='left';ctx.textBaseline='top';
  labels.forEach((label,i) => ctx.fillText(label,(i%13)*78+9,Math.floor(i/13)*100+20));
  const atlas = new THREE.CanvasTexture(textureCanvas);atlas.colorSpace=THREE.SRGBColorSpace;
  const labelMat = new THREE.MeshBasicMaterial({map:atlas,transparent:true,depthWrite:false});
  for(let row=0;row<4;row++) for(let col=0;col<13;col++){
    const x=(col-6)*.765, z=(row-2)*.72;
    const accent=(row===0&&col===0)||(row===2&&col===12)||(row===3&&col===11);
    const material=accent?lime:((col>10||col===0)?pale:dark);
    box(.69,.26,.64,material,x,.28,z);
    if(!accent){
      const geometry=new THREE.PlaneGeometry(.66,.61);
      const uv=geometry.attributes.uv;
      for(let j=0;j<uv.count;j++){uv.setXY(j,(col*78+uv.getX(j)*78)/1024,1-(row*100+(1-uv.getY(j))*100)/512);}
      const label=new THREE.Mesh(geometry,labelMat);label.rotation.x=-Math.PI/2;label.position.set(x,.416,z);keyboard.add(label);
    }
  }
  for(let col=0;col<4;col++)box(.69,.26,.62,pale,-4.59+col*.765,.28,1.44);
  box(4.45,.26,.62,dark,.35,.28,1.44);
  for(let col=0;col<3;col++)box(.69,.26,.62,col===1?lime:pale,3.06+col*.765,.28,1.44);
  keyboard.rotation.set(.05,-.12,-.15);keyboard.position.x=.75;
  let px=0,py=0,visible=true;
  stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();px=(e.clientX-r.left)/r.width-.5;py=(e.clientY-r.top)/r.height-.5;});
  stage.addEventListener('pointerleave',()=>{px=0;py=0;});
  const resize=()=>{const {width,height}=stage.getBoundingClientRect();renderer.setSize(width,height,false);camera.aspect=width/height;camera.position.set(0,width<650?10.5:8.5,width<650?16:12.5);camera.lookAt(0,0,0);camera.updateProjectionMatrix();};
  new ResizeObserver(resize).observe(stage);resize();
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(stage);
  const start=performance.now();
  renderer.setAnimationLoop(()=>{
    if(!visible||document.hidden)return;
    const t=(performance.now()-start)/1000;
    if(!reduced){keyboard.rotation.y+=(-.12+px*.28-keyboard.rotation.y)*.035;keyboard.rotation.x+=(.05+py*.13-keyboard.rotation.x)*.035;keyboard.position.y=Math.sin(t*.8)*.11;}
    renderer.render(scene,camera);
  });
  document.body.classList.add('webgl-ready');
  canvas.addEventListener('webglcontextlost',()=>{document.body.classList.remove('webgl-ready');renderer.setAnimationLoop(null);});
} catch(error) { console.info('WebGL unavailable; using the static keyboard illustration.',error.message); }
