/**
 * GoldenJDM Portfolio - Main JavaScript
 * Author: Amirhossein Zarniyan (@GoldenJDM)
 *
 * The hero canvas animation lives in the shared /js/hero-canvas.js.
 */

// ============================================
// 🧭 NAVIGATION SCROLL EFFECT
// ============================================
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }
}, { passive: true });

// ============================================
// 🍔 HAMBURGER MENU
// ============================================
(function initHamburger() {
  const hb = document.getElementById('hamburger');
  const nm = document.getElementById('navMenu');
  if (!hb || !nm) return;
  
  hb.addEventListener('click', () => {
    const isActive = hb.classList.toggle('active');
    nm.classList.toggle('active');
    hb.setAttribute('aria-expanded', isActive);
    if (isActive) nm.querySelector('a')?.focus();
  });
  
  nm.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nm.classList.remove('active');
      hb.classList.remove('active');
      hb.setAttribute('aria-expanded', 'false');
    });
  });
  
  document.addEventListener('click', e => {
    if (!e.target.closest('nav') && nm.classList.contains('active')) {
      nm.classList.remove('active');
      hb.classList.remove('active');
      hb.setAttribute('aria-expanded', 'false');
    }
  });
})();

// ============================================
// ✨ FADE-IN ON SCROLL
// ============================================
(function initFadeIn() {
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.fade-in-trigger').forEach(el => io.observe(el));
  } else {
    // Fallback for older browsers
    document.querySelectorAll('.fade-in-trigger').forEach(el => {
      el.classList.add('fade-in-visible');
    });
  }
})();

// ============================================
// 🎬 SPLASH SCREEN LOGIC (English Version)
// ============================================
(function initSplashScreen() {
  const splash = document.getElementById('splash-screen');
  if (!splash) return;
  
  // If user has seen splash before, remove it
  if (localStorage.getItem('goldenjdm_splash_seen_en')) {
    splash.remove();
    return;
  }
  
  // Otherwise: show splash + lock scroll
  document.body.classList.add('splash-active');
  
  // 2-second timer
  setTimeout(() => {
    splash.classList.add('hidden');
    
    // After fade-out animation completes
    setTimeout(() => {
      splash.style.display = 'none';
      splash.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('splash-active');
      
      // Save to localStorage
      try {
        localStorage.setItem('goldenjdm_splash_seen_en', 'true');
      } catch(e) {
        console.log('localStorage not available');
      }
    }, 600); // Match CSS transition duration
    
  }, 2000); // Display time: 2 seconds
})();

// ============================================
// 🔧 Vercel Editor Mode (Optional - Keep if needed)
// ============================================
(function initVercelEditor() {
  // Only load in development or if needed
  if (window.location.hostname !== 'localhost' && !window.location.href.includes('vercel.app')) return;
  
  var vm=false, sel=null, ov=null;
  window.addEventListener('message',function(e){
    var d=e.data; if(!d||!d.t) return;
    if(d.t==='mode'){vm=d.v; document.body.style.cursor=vm?'crosshair':''; if(!vm&&ov){ov.remove();ov=null;}}
    if(d.t==='apply') applyProps(d.p);
    if(d.t==='del'){if(sel){sel.remove();sel=null;emit();}}
    if(d.t==='dup'){if(sel){var c=sel.cloneNode(true);sel.parentNode.insertBefore(c,sel.nextSibling);emit();}}
    if(d.t==='up'){if(sel&&sel.previousElementSibling){sel.parentNode.insertBefore(sel,sel.previousElementSibling);emit();}}
    if(d.t==='dn'){if(sel&&sel.nextElementSibling){sel.parentNode.insertBefore(sel.nextElementSibling,sel);emit();}}
    if(d.t==='wrap'){if(sel){var w=document.createElement('div');w.style.cssText='padding:10px;border:1px dashed #aaa;';sel.parentNode.insertBefore(w,sel);w.appendChild(sel);emit();}}
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
