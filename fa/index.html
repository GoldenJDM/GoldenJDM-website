/**
 * GoldenJDM Portfolio - Main JavaScript
 * Author: Amirhossein Zarniyan (@GoldenJDM)
 */

// ============================================
// 🎨 LIQUID AURORA CANVAS ANIMATION
// ============================================
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const PALETTE = [
    [110, 45, 220], [175, 30, 195], [210, 55, 130],
    [60, 55, 200], [145, 65, 230], [200, 100, 200]
  ];
  
  let blobs = [], W = 0, H = 0, raf, startTime = null;
  
  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;
  }
  
  function makeBlob(i) {
    const [r, g, b] = PALETTE[i % PALETTE.length];
    return {
      cx: W * (0.1 + Math.random() * 0.8),
      cy: H * (0.1 + Math.random() * 0.8),
      ax: W * (0.18 + Math.random() * 0.22),
      ay: H * (0.18 + Math.random() * 0.22),
      speed: 0.00035 + Math.random() * 0.00045,
      offset: Math.random() * Math.PI * 2,
      baseR: Math.min(W, H) * (0.40 + Math.random() * 0.25),
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.006 + Math.random() * 0.005,
      r, g, b
    };
  }
  
  function init() {
    blobs = [];
    for (let i = 0; i < 6; i++) blobs.push(makeBlob(i));
  }
  
  function tick(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#08000f';
    ctx.fillRect(0, 0, W, H);
    
    for (const b of blobs) {
      const angle = elapsed * b.speed + b.offset;
      const x = b.cx + Math.cos(angle) * b.ax;
      const y = b.cy + Math.sin(angle * 0.71) * b.ay;
      
      b.pulsePhase += b.pulseSpeed;
      const pulse = 1 + Math.sin(b.pulsePhase) * 0.10;
      const radius = b.baseR * pulse;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(${b.r},${b.g},${b.b}, 0.45)`);
      gradient.addColorStop(0.25, `rgba(${b.r},${b.g},${b.b}, 0.55)`);
      gradient.addColorStop(0.55, `rgba(${b.r},${b.g},${b.b}, 0.30)`);
      gradient.addColorStop(0.80, `rgba(${b.r},${b.g},${b.b}, 0.10)`);
      gradient.addColorStop(1, `rgba(${b.r},${b.g},${b.b}, 0)`);
      
      ctx.globalCompositeOperation = 'plus-lighter';
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
  });
  function applyProps(p){
    if(!sel) return;
    if(p.textContent!==undefined && sel.childElementCount===0) sel.textContent=p.textContent;
    if(p.innerHTML!==undefined) sel.innerHTML=p.innerHTML;
    var smap={color:'color',bg:'backgroundColor',fontSize:'fontSize',fontWeight:'fontWeight',
      fontFamily:'fontFamily',textAlign:'textAlign',lineHeight:'lineHeight',letterSpacing:'letterSpacing',
      padding:'padding',paddingTop:'paddingTop',paddingRight:'paddingRight',paddingBottom:'paddingBottom',paddingLeft:'paddingLeft',
      margin:'margin',marginTop:'marginTop',marginRight:'marginRight',marginBottom:'marginBottom',marginLeft:'marginLeft',
      width:'width',height:'height',maxWidth:'maxWidth',minHeight:'minHeight',display:'display',
      flexDirection:'flexDirection',justifyContent:'justifyContent',alignItems:'alignItems',gap:'gap',
      borderRadius:'borderRadius',border:'border',boxShadow:'boxShadow',opacity:'opacity',transform:'transform'};
    Object.keys(smap).forEach(function(k){if(p[k]!==undefined) sel.style[smap[k]]=p[k];});
    if(p.href!==undefined) sel.setAttribute('href',p.href);
    if(p.src!==undefined)  sel.setAttribute('src',p.src);
    if(p.alt!==undefined)  sel.setAttribute('alt',p.alt);
    if(p.placeholder!==undefined) sel.setAttribute('placeholder',p.placeholder);
    if(p.value!==undefined) sel.value=p.value;
    if(p.id!==undefined) sel.id=p.id;
    if(p.name!==undefined) sel.setAttribute('name',p.name);
    if(p.type!==undefined && sel.tagName==='INPUT') sel.type=p.type;
    if(p.target!==undefined) sel.setAttribute('target',p.target);
    if(p.className!==undefined) sel.className=p.className;
    emit();
  }
  function emit(){
    window.parent.postMessage({t:'html',html:document.documentElement.outerHTML},'*');
  }
  function getPath(el){
    var parts=[],cur=el;
    while(cur&&cur!==document.body&&cur.tagName){
      var idx=Array.from(cur.parentNode?cur.parentNode.children:[]).indexOf(cur);
      parts.unshift(cur.tagName.toLowerCase()+(idx>0?'['+idx+']':''));
      cur=cur.parentNode;
    }
    return parts.join(' > ');
  }
  function getCS(el,prop){return window.getComputedStyle(el)[prop]||'';}
  document.addEventListener('mouseover',function(e){
    if(!vm) return; e.stopPropagation();
    if(ov){ov.remove();}
    var el=e.target;
    if(el===document.body||el===document.documentElement) return;
    var r=el.getBoundingClientRect();
    ov=document.createElement('div');
    Object.assign(ov.style,{position:'fixed',pointerEvents:'none',zIndex:'99999',
      top:r.top+'px',left:r.left+'px',width:r.width+'px',height:r.height+'px',
      outline:'2px solid #e8a838',background:'rgba(232,168,56,.06)'});
    var label=document.createElement('div');
    Object.assign(label.style,{position:'absolute',top:'-20px',right:'0',
      background:'#e8a838',color:'#000',fontSize:'10px',padding:'1px 6px',
      fontFamily:'monospace',whiteSpace:'nowrap'});
    label.textContent='<'+el.tagName.toLowerCase()+'>';
    ov.appendChild(label);
    document.body.appendChild(ov);
    window.parent.postMessage({t:'hover',tag:el.tagName.toLowerCase()},'*');
  },true);
  document.addEventListener('mouseout',function(){
    if(ov){ov.remove();ov=null;}
    window.parent.postMessage({t:'hover',tag:null},'*');
  },true);
  document.addEventListener('click',function(e){
    if(!vm) return; e.preventDefault(); e.stopPropagation();
    sel=e.target;
    var cs=window.getComputedStyle(sel);
    function gs(p){return sel.style[p]||cs[p]||'';}
    window.parent.postMessage({t:'sel',
      tag:sel.tagName.toLowerCase(),
      path:getPath(sel),
      textContent:sel.childElementCount===0?sel.textContent:'',
      innerHTML:sel.innerHTML,
      href:sel.getAttribute('href')||'',
      src:sel.getAttribute('src')||'',
      alt:sel.getAttribute('alt')||'',
      placeholder:sel.getAttribute('placeholder')||'',
      value:sel.value||'',
      id:sel.id||'',
      name:sel.getAttribute('name')||'',
      type:sel.getAttribute('type')||'',
      target:sel.getAttribute('target')||'',
      className:sel.className||'',
      style:{
        color:sel.style.color||r2h(cs.color),
        bg:sel.style.backgroundColor||r2h(cs.backgroundColor),
        fontSize:sel.style.fontSize||cs.fontSize,
        fontWeight:sel.style.fontWeight||cs.fontWeight,
        fontFamily:sel.style.fontFamily||cs.fontFamily,
        textAlign:sel.style.textAlign||cs.textAlign,
        lineHeight:sel.style.lineHeight||cs.lineHeight,
        letterSpacing:sel.style.letterSpacing||cs.letterSpacing,
        padding:sel.style.padding||'',
        paddingTop:sel.style.paddingTop||cs.paddingTop,
        paddingRight:sel.style.paddingRight||cs.paddingRight,
        paddingBottom:sel.style.paddingBottom||cs.paddingBottom,
        paddingLeft:sel.style.paddingLeft||cs.paddingLeft,
        margin:sel.style.margin||'',
        marginTop:sel.style.marginTop||cs.marginTop,
        marginRight:sel.style.marginRight||cs.marginRight,
        marginBottom:sel.style.marginBottom||cs.marginBottom,
        marginLeft:sel.style.marginLeft||cs.marginLeft,
        width:sel.style.width||'',
        height:sel.style.height||'',
        maxWidth:sel.style.maxWidth||'',
        minHeight:sel.style.minHeight||'',
        display:sel.style.display||cs.display,
        flexDirection:sel.style.flexDirection||cs.flexDirection,
        justifyContent:sel.style.justifyContent||cs.justifyContent,
        alignItems:sel.style.alignItems||cs.alignItems,
        gap:sel.style.gap||cs.gap||'',
        borderRadius:sel.style.borderRadius||cs.borderRadius,
        border:sel.style.border||'',
        boxShadow:sel.style.boxShadow||'',
        opacity:sel.style.opacity||cs.opacity,
        transform:sel.style.transform||'',
      }
    },'*');
  },true);
  function r2h(s){if(!s||s.startsWith('#'))return s||'';var m=s.match(/\d+/g);if(!m||m.length<3)return s;return'#'+m.slice(0,3).map(function(x){return parseInt(x).toString(16).padStart(2,'0');}).join('');}
})();
