
    // =============================================
    // ★★★ STAR / POINT SYSTEM ★★★
    // =============================================
    const STAR_KEY = 'duniaCeria_stars';
    const REWARDS_KEY = 'duniaCeria_rewards';
    const BADGES_KEY = 'duniaCeria_badges';

    function getStars() { return parseInt(localStorage.getItem(STAR_KEY) || '0'); }
    function saveStars(n) { localStorage.setItem(STAR_KEY, n); }
    function getRewards() { return JSON.parse(localStorage.getItem(REWARDS_KEY) || '[]'); }
    function saveRewards(r) { localStorage.setItem(REWARDS_KEY, JSON.stringify(r)); }
    function getBadges() { return JSON.parse(localStorage.getItem(BADGES_KEY) || '[]'); }
    function saveBadges(b) { localStorage.setItem(BADGES_KEY, JSON.stringify(b)); }

    function earnStars(amount, reason) {
        const prev = getStars();
        const next = prev + amount;
        saveStars(next);
        updateStarHUD();
        showStarEarned(amount);
        showToast(`+${amount} ⭐ ${reason}`, '⭐');
    }

    function spendStars(amount) {
        const current = getStars();
        if (current < amount) { showToast('Bintang kurang! Main dulu ya~ 🥺', '😢'); return false; }
        saveStars(current - amount);
        updateStarHUD();
        return true;
    }

    function showStarEarned(amount) {
        const hud = document.getElementById('starHud');
        const rect = hud.getBoundingClientRect();
        const el = document.createElement('div');
        el.className = 'star-earned-float';
        el.textContent = `+${amount}⭐`;
        el.style.left = (rect.left + rect.width / 2 - 30) + 'px';
        el.style.top = (rect.top - 10) + 'px';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }

    function updateStarHUD() {
        const count = getStars();
        document.getElementById('hudStarCount').textContent = count;
        document.getElementById('shopStarCount').textContent = count;
    }

    // =============================================
    // ★★★ REWARDS DEFINITION ★★★
    // =============================================
    const rewards = [
        { id: 'title_pangeran', name: 'Gelar "Pangeran Bintang"', desc: 'Kamu dapat gelar kerajaan!', cost: 10, emoji: '👑', type: 'badge' },
        { id: 'title_putri', name: 'Gelar "Putri Pelangi"', desc: 'Putri paling cantik sejagad!', cost: 10, emoji: '👸', type: 'badge' },
        { id: 'title_jago', name: 'Gelar "Jagoan Cilik"', desc: 'Superhero kecil yang hebat!', cost: 15, emoji: '🦸', type: 'badge' },
        { id: 'title_pilot', name: 'Gelar "Pilot Muda"', desc: 'Terbang tinggi ke awan!', cost: 15, emoji: '✈️', type: 'badge' },
        { id: 'cursor_rainbow', name: 'Kursor Pelangi', desc: 'Kursor jadi warna-warni!', cost: 20, emoji: '🌈', type: 'cursor' },
        { id: 'cursor_butterfly', name: 'Kursor Kupu-Kupu', desc: 'Kursor jadi kupu-kupu lucu!', cost: 20, emoji: '🦋', type: 'cursor' },
        { id: 'cursor_sparkle', name: 'Kursor Bintang', desc: 'Kursor berkilau bintang!', cost: 25, emoji: '💫', type: 'cursor' },
        { id: 'bg_sakura', name: 'Latar Sakura', desc: 'Background jadi bunga sakura!', cost: 30, emoji: '🌸', type: 'background' },
        { id: 'bg_galaxy', name: 'Latar Galaksi', desc: 'Background jadi galaksi angkasa!', cost: 30, emoji: '🌌', type: 'background' },
        { id: 'confetti_forever', name: 'Confetti Party!', desc: 'Confetti explosion sekarang juga!', cost: 5, emoji: '🎊', type: 'action' },
        { id: 'mega_balloon', name: 'Mega Balon!', desc: '18 balon sekaligus!', cost: 3, emoji: '🎈', type: 'action' },
    ];

    const allBadges = [
        { id: 'badge_first_star', name: 'Bintang Pertama', emoji: '🌟', condition: () => getStars() >= 1 },
        { id: 'badge_10_stars', name: 'Kolektor', emoji: '💫', condition: () => getStars() >= 10 },
        { id: 'badge_50_stars', name: 'Super Star', emoji: '⭐', condition: () => getStars() >= 50 },
        { id: 'badge_100_stars', name: 'Legenda', emoji: '🏆', condition: () => getStars() >= 100 },
        { id: 'title_pangeran', name: 'Pangeran', emoji: '👑' },
        { id: 'title_putri', name: 'Putri', emoji: '👸' },
        { id: 'title_jago', name: 'Jagoan', emoji: '🦸' },
        { id: 'title_pilot', name: 'Pilot', emoji: '✈️' },
    ];

    function checkAndAwardBadges() {
        const earned = getBadges();
        let newBadge = false;
        allBadges.forEach(b => {
            if (!earned.includes(b.id) && b.condition && b.condition()) {
                earned.push(b.id);
                newBadge = true;
                showToast(`Badge baru: ${b.emoji} ${b.name}!`, '🏅');
            }
        });
        if (newBadge) saveBadges(earned);
        renderBadges();
    }

    function renderBadges() {
        const earned = getBadges();
        ['heroBadges', 'shopBadges'].forEach(containerId => {
            const el = document.getElementById(containerId);
            if (!el) return;
            el.innerHTML = '';
            allBadges.forEach(b => {
                const isEarned = earned.includes(b.id);
                const div = document.createElement('div');
                div.className = `badge-icon ${isEarned ? 'earned' : 'locked'}`;
                div.textContent = b.emoji;
                div.title = isEarned ? b.name : '???';
                el.appendChild(div);
            });
        });
    }

    function openRewardShop() {
        updateStarHUD();
        renderBadges();
        renderRewardList();
        document.getElementById('rewardOverlay').classList.add('open');
    }
    function closeRewardShop() {
        document.getElementById('rewardOverlay').classList.remove('open');
    }

    function renderRewardList() {
        const owned = getRewards();
        const stars = getStars();
        const list = document.getElementById('rewardList');
        list.innerHTML = '';

        rewards.forEach(r => {
            const isOwned = owned.includes(r.id);
            const canAfford = stars >= r.cost;
            const card = document.createElement('div');
            card.className = `reward-card ${isOwned ? 'owned' : (!canAfford ? 'locked' : '')}`;
            card.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="text-3xl w-12 h-12 flex items-center justify-center rounded-xl ${isOwned ? 'bg-gradient-to-br from-pink-100 to-purple-100' : 'bg-gray-50'}">${r.emoji}</div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="font-bold text-purple-700 text-sm">${r.name}</span>
                            <span class="reward-badge ${isOwned ? 'bg-green-100 text-green-600' : 'bg-pink-100 text-pink-600'}">
                                ${isOwned ? '✓ Punya' : r.cost + ' ⭐'}
                            </span>
                        </div>
                        <p class="text-xs text-purple-400 mt-0.5">${r.desc}</p>
                    </div>
                    ${!isOwned ? `<button onclick="buyReward('${r.id}')" class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${canAfford ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:scale-105 transition-transform' : 'bg-gray-100 text-gray-400'}">
                        ${canAfford ? 'Beli!' : 'Kurang ⭐'}
                    </button>` : ''}
                </div>
            `;
            list.appendChild(card);
        });
    }

    function buyReward(id) {
        const reward = rewards.find(r => r.id === id);
        if (!reward) return;

        if (!spendStars(reward.cost)) return;

        const owned = getRewards();
        if (!owned.includes(id)) {
            owned.push(id);
            saveRewards(owned);
        }

        // Activate effect
        activateReward(id);
        renderRewardList();
        renderBadges();
        checkAndAwardBadges();
        showToast(`Kamu dapat ${reward.emoji} ${reward.name}!`, '🎉');
        launchConfetti();
    }

    function activateReward(id) {
        if (id === 'cursor_rainbow') {
            document.documentElement.style.setProperty('--custom-cursor', `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' style='font-size:24px'><text y='24'>🌈</text></svg>"), auto`);
            applyCustomCursor();
        } else if (id === 'cursor_butterfly') {
            document.documentElement.style.setProperty('--custom-cursor', `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' style='font-size:24px'><text y='24'>🦋</text></svg>"), auto`);
            applyCustomCursor();
        } else if (id === 'cursor_sparkle') {
            document.documentElement.style.setProperty('--custom-cursor', `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' style='font-size:24px'><text y='24'>💫</text></svg>"), auto`);
            applyCustomCursor();
        } else if (id === 'bg_sakura') {
            document.body.style.background = 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 40%, #FBCFE8 70%, #FDF2F8 100%)';
        } else if (id === 'bg_galaxy') {
            document.body.style.background = 'linear-gradient(135deg, #1E1B4B 0%, #312E81 30%, #4C1D95 60%, #1E1B4B 100%)';
        } else if (id === 'confetti_forever') {
            for (let i = 0; i < 3; i++) setTimeout(() => launchConfetti(), i * 400);
        } else if (id === 'mega_balloon') {
            const area = document.getElementById('balloonArea');
            area.innerHTML = '';
            const balloonEmojis = ['🎈', '🎀', '🌸', '💜', '💗', '⭐', '🦋', '🌺'];
            for (let i = 0; i < 18; i++) {
                const b = document.createElement('div');
                const size = 36 + Math.random() * 24;
                b.className = 'bounce-soft';
                b.style.cssText = `font-size:${size}px;animation-delay:${Math.random()*2}s;animation-duration:${1.5+Math.random()}s;filter:drop-shadow(0 4px 8px rgba(168,85,247,0.3));user-select:none;transition:transform 0.1s;`;
                b.textContent = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
                b.addEventListener('click', (e) => {
                    e.stopPropagation();
                    let score = parseInt(document.getElementById('balloonScore').textContent) + 1;
                    document.getElementById('balloonScore').textContent = score;
                    b.style.transform = 'scale(0)';
                    if (score % 5 === 0) earnStars(1, 'dari balon!');
                });
                area.appendChild(b);
            }
            scrollToSection('beranda');
            // Actually scroll to balloon section area — we'll just show toast
        }
    }

    function applyCustomCursor() {
        const cv = getComputedStyle(document.documentElement).getPropertyValue('--custom-cursor').trim();
        if (cv && cv !== 'none') {
            document.body.style.cursor = cv;
            document.querySelectorAll('a, button, [onclick]').forEach(el => el.style.cursor = cv);
        }
    }

    // Check active rewards on load
    function loadActiveRewards() {
        const owned = getRewards();
        if (owned.includes('cursor_rainbow') || owned.includes('cursor_butterfly') || owned.includes('cursor_sparkle')) {
            // Last cursor purchased wins — apply in order
            if (owned.includes('cursor_sparkle')) activateReward('cursor_sparkle');
            else if (owned.includes('cursor_butterfly')) activateReward('cursor_butterfly');
            else activateReward('cursor_rainbow');
        }
        if (owned.includes('bg_sakura')) activateReward('bg_sakura');
        if (owned.includes('bg_galaxy')) activateReward('bg_galaxy');
    }

    // =============================================
    // ORIGINAL FEATURES (with star integration)
    // =============================================

    // Bubbles
    function createBubbles() {
        const container = document.getElementById('bubbles');
        const colors = ['rgba(236,72,153,0.08)','rgba(168,85,247,0.08)','rgba(244,114,182,0.06)','rgba(192,132,252,0.06)'];
        for (let i = 0; i < 12; i++) {
            const b = document.createElement('div');
            b.className = 'bubble';
            const size = Math.random()*200+60;
            b.style.cssText = `width:${size}px;height:${size}px;background:${colors[i%colors.length]};left:${Math.random()*100}%;top:${Math.random()*100}%;animation:float ${5+Math.random()*5}s ease-in-out infinite;animation-delay:${Math.random()*3}s;filter:blur(${Math.random()*20+10}px);`;
            container.appendChild(b);
        }
    }
    createBubbles();

    // Heart click
    document.addEventListener('click', (e) => {
        if (e.target.closest('.reward-overlay') || e.target.closest('.star-hud') || e.target.closest('nav')) return;
        const hearts = ['💜','💗','🌸','✨','💖','⭐'];
        const h = document.createElement('div');
        h.textContent = hearts[Math.floor(Math.random()*hearts.length)];
        h.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;font-size:${16+Math.random()*16}px;pointer-events:none;z-index:9998;animation:heartFloat 1.2s ease-out forwards;`;
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 1200);
    });

    function toggleMobileMenu() { document.getElementById('mobileMenu').classList.toggle('hidden'); }
    function scrollToSection(id) { document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); }

    // Section reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));

    // Toast
    function showToast(msg, icon = '🎉') {
        const t = document.createElement('div');
        t.className = 'toast-msg px-5 py-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-pink-200 shadow-lg text-sm font-medium text-purple-700 flex items-center gap-2 whitespace-nowrap';
        t.innerHTML = `<span>${icon}</span> ${msg}`;
        document.getElementById('toastContainer').appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }

    // Confetti
    function launchConfetti() {
        const colors = ['#EC4899','#A855F7','#F472B6','#C084FC','#FBBF24','#34D399'];
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.className = 'confetti-piece';
            p.style.cssText = `left:${Math.random()*100}vw;top:-10px;width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>0.5?'50%':'2px'};animation-duration:${2+Math.random()*2}s;animation-delay:${Math.random()*0.5}s;`;
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 4000);
        }
    }

    // ===== MEMORY GAME (with stars) =====
    const memoryEmojis = ['🦄','🦋','🌺','🎀','🌈','🌸'];
    let memoryCards=[], flippedCards=[], matchedPairs=0, moves=0, canFlip=true;
    function initMemoryGame() {
        memoryCards = [...memoryEmojis,...memoryEmojis].sort(()=>Math.random()-0.5);
        flippedCards=[]; matchedPairs=0; moves=0; canFlip=true;
        document.getElementById('moveCount').textContent='0';
        document.getElementById('matchCount').textContent='0';
        const grid = document.getElementById('memoryGrid');
        grid.innerHTML='';
        memoryCards.forEach((emoji,i)=>{
            const card = document.createElement('div');
            card.className='memory-card aspect-square';
            card.dataset.index=i; card.dataset.emoji=emoji;
            card.innerHTML=`<div class="memory-card-inner"><div class="memory-card-front">❓</div><div class="memory-card-back">${emoji}</div></div>`;
            card.addEventListener('click',()=>flipCard(card));
            grid.appendChild(card);
        });
    }
    function flipCard(card) {
        if(!canFlip||card.classList.contains('flipped')||card.classList.contains('matched')) return;
        card.classList.add('flipped');
        flippedCards.push(card);
        if(flippedCards.length===2){
            moves++;
            document.getElementById('moveCount').textContent=moves;
            canFlip=false;
            if(flippedCards[0].dataset.emoji===flippedCards[1].dataset.emoji){
                flippedCards.forEach(c=>c.classList.add('matched'));
                matchedPairs++;
                document.getElementById('matchCount').textContent=matchedPairs;
                flippedCards=[]; canFlip=true;
                if(matchedPairs===6){
                    setTimeout(()=>{
                        launchConfetti();
                        earnStars(5, 'menang cocokkan gambar! 🧩');
                        showToast('Kamu menang! +5 ⭐', '🏆');
                        checkAndAwardBadges();
                    },500);
                }
            } else {
                setTimeout(()=>{ flippedCards.forEach(c=>c.classList.remove('flipped')); flippedCards=[]; canFlip=true; },800);
            }
        }
    }
    initMemoryGame();

    // ===== DRAWING (with stars) =====
    const canvas = document.getElementById('drawCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing=false, currentColor='#EC4899', currentBrushSize=8, lastX=0, lastY=0;

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio||1;
        canvas.width=rect.width*dpr; canvas.height=rect.height*dpr;
        ctx.scale(dpr,dpr);
        canvas.style.width=rect.width+'px'; canvas.style.height=rect.height+'px';
        ctx.fillStyle='white'; ctx.fillRect(0,0,rect.width,rect.height);
    }
    setTimeout(resizeCanvas,100);

    function getPos(e){ const rect=canvas.getBoundingClientRect(); const t=e.touches?e.touches[0]:e; return{x:t.clientX-rect.left,y:t.clientY-rect.top}; }
    canvas.addEventListener('mousedown',(e)=>{ isDrawing=true; const p=getPos(e); lastX=p.x; lastY=p.y; });
    canvas.addEventListener('mousemove',(e)=>{ if(!isDrawing)return; const p=getPos(e); ctx.beginPath(); ctx.moveTo(lastX,lastY); ctx.lineTo(p.x,p.y); ctx.strokeStyle=currentColor; ctx.lineWidth=currentBrushSize; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.stroke(); lastX=p.x; lastY=p.y; });
    canvas.addEventListener('mouseup',()=>isDrawing=false);
    canvas.addEventListener('mouseleave',()=>isDrawing=false);
    canvas.addEventListener('touchstart',(e)=>{ e.preventDefault(); isDrawing=true; const p=getPos(e); lastX=p.x; lastY=p.y; });
    canvas.addEventListener('touchmove',(e)=>{ e.preventDefault(); if(!isDrawing)return; const p=getPos(e); ctx.beginPath(); ctx.moveTo(lastX,lastY); ctx.lineTo(p.x,p.y); ctx.strokeStyle=currentColor; ctx.lineWidth=currentBrushSize; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.stroke(); lastX=p.x; lastY=p.y; });
    canvas.addEventListener('touchend',()=>isDrawing=false);

    function setColor(c){ currentColor=c; document.querySelectorAll('.color-btn').forEach(b=>b.classList.remove('active')); event.target.classList.add('active'); }
    function clearCanvas(){ const rect=canvas.getBoundingClientRect(); ctx.fillStyle='white'; ctx.fillRect(0,0,rect.width,rect.height); showToast('Kanvas dibersihkan!','🧹'); }
    function downloadCanvas(){
        const link=document.createElement('a'); link.download='gambar-ku.png'; link.href=canvas.toDataURL(); link.click();
        earnStars(3, 'menyimpan gambar! 🎨');
        checkAndAwardBadges();
    }

    // ===== ANIMALS (with stars) =====
    const animals = [
        {emoji:'🐱',name:'Kucing',sound:'Meong~ meong~'},{emoji:'🐶',name:'Anjing',sound:'Guk guk! Woof!'},
        {emoji:'🐮',name:'Sapi',sound:'Moooo~'},{emoji:'🐷',name:'Babi',sound:'Oink oink!'},
        {emoji:'🐔',name:'Ayam',sound:'Petok petok!'},{emoji:'🐸',name:'Katak',sound:'Kroak kroak!'},
        {emoji:'🦁',name:'Singa',sound:'Roaaarrr!'},{emoji:'🐘',name:'Gajah',sound:'Pruuut pruuut!'},
    ];
    function initAnimals(){
        const grid=document.getElementById('animalGrid');
        animals.forEach((a,i)=>{
            const card=document.createElement('div');
            card.className='card-fun rounded-3xl p-6 text-center group';
            card.innerHTML=`<div class="text-6xl mb-3 group-hover:scale-125 transition-transform duration-300">${a.emoji}</div><h3 class="font-bold text-purple-700 text-lg">${a.name}</h3><div class="text-sm text-pink-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Klik aku!</div><div id="animalSound${i}" class="mt-3 text-lg font-bold text-pink-500 hidden pop"></div>`;
            let earned = false;
            card.addEventListener('click',()=>{
                const s=document.getElementById(`animalSound${i}`);
                s.textContent=a.sound; s.classList.remove('hidden','pop');
                void s.offsetWidth; s.classList.add('pop');
                card.style.transform='scale(1.05) rotate(2deg)';
                setTimeout(()=>{card.style.transform='';},300);
                if(!earned){ earned=true; earnStars(1,`dari ${a.name}! ${a.emoji}`); checkAndAwardBadges(); }
            });
            grid.appendChild(card);
        });
    }
    initAnimals();

    // ===== STORIES (with stars) =====
    const stories = [
        {title:'🦄 Unicorn dan Bunga Pelangi',content:'Pada suatu hari, ada seekor unicorn bernama Lily. Lily punya surai berwarna pink dan ungu. Setiap hari, Lily berjalan di padang bunga dan membuat pelangi dengan tanduknya. Semua hewan di hutan suka bermain dengan Lily. Mereka tertawa, berlari, dan menari bersama di bawah pelangi yang indah. 💕'},
        {title:'🦋 Kupu-Kupu yang Ingin Terbang',content:'Ada seekor kupu-kupu kecil bernama Bella. Sayapnya berwarna ungu dengan bintik-bintik pink. Bella takut terbang tinggi. Tapi suatu hari, sahabatnya burung Pipit berkata, "Jangan takut Bella, aku akan menemanimu!" Akhirnya Bella terbang tinggi melewati awan-awan pink dan melihat dunia yang sangat indah dari atas. 🌸'},
        {title:'⭐ Bintang Kecil yang Sedih',content:'Di langit malam, ada bintang kecil bernama Twinkle. Twinkle sedih karena cahayanya kurang terang. Bulan tersenyum dan berkata, "Setiap bintang itu unik, Twinkle. Cahayamu mungkin kecil, tapi kamu bersinar untuk anak-anak yang sedang melihat langit." Twinkle tersenyum dan bersinar lebih terang dari sebelumnya. 🌙'}
    ];
    function initStories(){
        const container=document.getElementById('storyContainer');
        stories.forEach((s,i)=>{
            const card=document.createElement('div');
            card.className='card-fun rounded-3xl p-8';
            card.innerHTML=`<h3 class="text-xl font-bold text-purple-700 mb-4">${s.title}</h3><p class="text-purple-500/80 leading-relaxed text-[15px]" id="storyText${i}"></p><button onclick="typeStory(${i})" class="mt-4 btn-fun text-white px-6 py-2 rounded-full text-sm font-bold">✨ Baca Cerita (+2⭐)</button>`;
            container.appendChild(card);
        });
    }
    initStories();
    function typeStory(index){
        const el=document.getElementById(`storyText${index}`);
        if(el.textContent) return; // already read
        const text=stories[index].content;
        el.textContent=''; let i=0;
        function type(){ if(i<text.length){el.textContent+=text[i];i++;setTimeout(type,30);} else { earnStars(2,'membaca cerita! 📖'); checkAndAwardBadges(); } }
        type();
    }

    // ===== BALLOONS (with stars) =====
    let balloonScore = 0;
    const balloonEmojis = ['🎈','🎀','🌸','💜','💗','⭐','🦋','🌺'];
    function spawnBalloons(){
        const area=document.getElementById('balloonArea'); area.innerHTML='';
        for(let i=0;i<12;i++){
            const b=document.createElement('div');
            const size=36+Math.random()*24;
            b.className='bounce-soft';
            b.style.cssText=`font-size:${size}px;animation-delay:${Math.random()*2}s;animation-duration:${1.5+Math.random()}s;filter:drop-shadow(0 4px 8px rgba(168,85,247,0.3));user-select:none;transition:transform 0.1s;`;
            b.textContent=balloonEmojis[Math.floor(Math.random()*balloonEmojis.length)];
            b.addEventListener('click',(e)=>{
                e.stopPropagation();
                balloonScore++;
                document.getElementById('balloonScore').textContent=balloonScore;
                b.style.transform='scale(0)';
                const pop=document.createElement('div'); pop.textContent='💥';
                pop.style.cssText=`position:absolute;font-size:24px;pointer-events:none;animation:pop 0.3s ease-out forwards;left:${b.offsetLeft}px;top:${b.offsetTop}px;`;
                area.style.position='relative'; area.appendChild(pop);
                setTimeout(()=>pop.remove(),300);
                if(balloonScore%5===0){ earnStars(1,'dari balon! 🎈'); checkAndAwardBadges(); }
            });
            area.appendChild(b);
        }
    }
    spawnBalloons();

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
        a.addEventListener('click',function(e){ e.preventDefault(); const t=document.querySelector(this.getAttribute('href')); if(t)t.scrollIntoView({behavior:'smooth'}); });
    });

    // ===== INIT =====
    updateStarHUD();
    renderBadges();
    loadActiveRewards();
    checkAndAwardBadges();