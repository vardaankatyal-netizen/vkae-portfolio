document.addEventListener("DOMContentLoaded",()=>{
  setTimeout(()=>document.body.classList.add("ready"),1700);
  document.getElementById("year").textContent=new Date().getFullYear();

  const progress=document.querySelector(".progress");
  addEventListener("scroll",()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.width=(max?scrollY/max*100:0)+"%";
  },{passive:true});

  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");obs.unobserve(e.target)}});
  },{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>obs.observe(el));

  if(matchMedia("(pointer:fine)").matches){
    document.querySelectorAll(".tilt").forEach(card=>{
      card.addEventListener("pointermove",e=>{
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`perspective(900px) rotateX(${y*-5}deg) rotateY(${x*7}deg) translateY(-6px)`;
      });
      card.addEventListener("pointerleave",()=>card.style.transform="");
    });
    const visual=document.getElementById("visual");
    let tx=0,ty=0,x=0,y=0;
    addEventListener("pointermove",e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
    function loop(){x+=(tx-x)*.035;y+=(ty-y)*.035;visual.style.transform=`perspective(1000px) rotateX(${y*-3}deg) rotateY(${x*5}deg)`;requestAnimationFrame(loop)}loop();
  }

  // Procedural AI-style cyber visual: no external image assets required.
  const c=document.getElementById("space"),ctx=c.getContext("2d");
  let w,h,dots=[];
  function resize(){w=c.width=c.clientWidth*devicePixelRatio;h=c.height=c.clientHeight*devicePixelRatio;dots=Array.from({length:180},()=>({x:Math.random()*w,y:Math.random()*h,z:Math.random()*2+.2,v:Math.random()*.45+.1}))}
  function draw(){
    ctx.clearRect(0,0,w,h);
    const cx=w/2,cy=h/2;
    for(const p of dots){
      p.y-=p.v*p.z;
      if(p.y<0)p.y=h;
      const s=p.z*1.4;
      ctx.fillStyle=`rgba(76,231,255,${.1+p.z*.18})`;ctx.fillRect(p.x,p.y,s,s);
      const dx=p.x-cx,dy=p.y-cy,dist=Math.hypot(dx,dy);
      if(dist<150){ctx.strokeStyle=`rgba(139,92,246,${(1-dist/150)*.12})`;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(cx,cy);ctx.stroke()}
    }
    requestAnimationFrame(draw);
  }
  resize();addEventListener("resize",resize);draw();
});

// Cinematic cursor glow + magnetic buttons
(function(){
  if (!window.matchMedia('(pointer:fine)').matches) return;
  const glow=document.createElement('div');
  glow.className='cursor-glow';
  document.body.appendChild(glow);
  let mx=innerWidth/2,my=innerHeight/2,gx=mx,gy=my;
  addEventListener('pointermove',e=>{
    mx=e.clientX; my=e.clientY;
    document.body.classList.add('cursor-active');
  },{passive:true});
  function animateCursor(){
    gx+=(mx-gx)*.12; gy+=(my-gy)*.12;
    glow.style.left=gx+'px'; glow.style.top=gy+'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('.btn,.social a,.channel').forEach(el=>{
    el.classList.add('magnetic');
    el.addEventListener('pointermove',e=>{
      const r=el.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)*.18;
      const y=(e.clientY-r.top-r.height/2)*.18;
      el.style.transform=`translate(${x}px,${y}px)`;
    });
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });
})();
