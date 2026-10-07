/* =========================================================
   Canelada — landing page (v2)
   Built on the Canelada design system. One scroll value
   drives the story; PT/EN switch on the fly.
   ========================================================= */
import { CHARS, BADGES, PLAYERS, av } from './data.js';
import { hydrateIcons } from './icons.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = t => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));
const ramp = (v, a, b) => smooth(clamp((v - a) / (b - a)));
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hoverDevice = matchMedia('(hover: hover)').matches;
let isMobile = innerWidth <= 760;

/* =========================================================
   Copy
   ========================================================= */
const I18N = {
  pt: {
    loader: 'Acendendo os refletores', drag: 'Arraste', scroll: 'Role pra descer', 'cur.you': 'Você', 'cur.go': 'Ir', 'cur.open': 'Abrir ↗', 'cur.click': 'Clique', 'cur.see': 'Ver', 'cur.enter': 'Entrar', 'cur.play': 'Bora!',
    'nav.how': 'Como funciona', 'nav.app': 'O app', 'nav.chars': 'Personagens', 'nav.medals': 'Medalhas', 'nav.draw': 'Sorteio', 'nav.open': 'Entrar',
    'hero.tag': 'No ar desde agosto · Salvador', 'hero.title': 'O baba virou resenha.',
    'hero.sub': 'Depois do jogo, a galera vota em quem foi o craque, o paredão e o bagre da noite. Os votos viram ranking, medalha e assunto pra semana inteira.',
    'hero.cta1': 'Abrir o Canelada', 'hero.cta2': 'Ver como funciona',
    'frag.toastT': 'Você foi eleito Paredão', 'frag.toastD': '5 votos · Baba de quarta', 'frag.rounds': 'RODADAS', 'frag.player': 'JOGADOR', 'frag.points': 'PONTOS',
    'frag.legendary': 'Lendária', 'frag.medal': 'Lenda do Baba',
    'how.eyebrow': 'Como funciona', 'how.title': 'Como uma pelada vira campeonato toda segunda e quarta',
    'how.s1t': 'Joga', 'how.s1d': 'O admin confirma quem apareceu e o app sorteia times equilibrados pelo overall.',
    'how.s2t': 'Vota', 'how.s2d': 'A votação abre 22:30. Cada um escolhe o personagem de cada jogador, do Categoria ao Bagre da Noite.',
    'how.s3t': 'Sobe no ranking', 'how.s3d': 'Personagem bom vale ponto. O MVP sai sozinho da soma e o ranking nunca desce.',
    'app.today': 'Baba de hoje', 'app.presTitle': 'Quem jogou?', 'app.draw': 'Sortear times', 'app.confirm': 'Confirmar voto',
    'app.season': 'Temporada 2026', 'app.rankTitle': 'Ranking', 'app.general': 'Geral', 'app.month': 'Mês', 'app.round': 'Rodada',
    'note.0': n => 'Rodada criada', 'note.1': 'Votação aberta', 'note.2': 'Overall subiu pra 90', 'how.m1': 'Seg e qua · 20h', 'how.m2': 'Abre 22:30 · fecha 20h', 'how.m3': 'Atualiza no fim da votação',
    'stats.votes': 'votos computados', 'stats.players': 'jogadores no grupo', 'stats.chars': 'personagens', 'stats.medals': 'medalhas',
    'stats.note': 'Números reais do baba que usa o Canelada em Salvador, desde agosto de 2026.',
    band: ['Vota', 'Zoa', 'Sobe', 'Repete'], sticker: 'BORA PRO BABA · CANELADA.APP.BR · ',
    'medals.tracks': 'As cinco trilhas',
    tracks: [['Presença', 'Aparecer conta. De Primeira Pelada a Lenda do Baba.', 7], ['Performance', 'MVPs por pontos, até o Craque Histórico.', 5], ['Sequências', 'Rodadas seguidas com personagem bom.', 5], ['Reconhecimento', 'O que a galera vota em você.', 4], ['Coleção', 'Medalha por juntar medalhas.', 3]],
    rail: ['Início', 'Como funciona', 'O app', 'Números', 'Personagens', 'Craque e bagre', 'Medalhas', 'Sorteio', 'Resenha', 'Bora'],
    'app2.eyebrow': 'O app de verdade', 'app2.title': 'Isso aqui já roda num baba de verdade',
    gallery: [['Votação: os 5 da noite', 'Toca no jogador, confirma e vai pro próximo.'], ['Quem foi o bagre?', 'O personagem que todo mundo quer evitar.'], ['Outros personagens', 'Positivos e negativos, todos opcionais.'], ['Personagem da semana', 'Quem levou cada personagem e com quantos votos.'], ['Medalha desbloqueada', 'Cada medalha tem categoria, raridade e vira post.'], ['O grupo', 'Só entra quem recebe o convite do admin.']],
    'chars.eyebrow': 'Personagens', 'chars.title': 'Quem foi o craque? E quem foi o cone?',
    'chars.body': 'Tem o craque, o paredão e o garçom. Tem também o cone, o chorão e o bagre da noite. Toda rodada, cada um leva um.',
    'chars.all': 'Todos', 'chars.pos': 'Futebol', 'chars.soc': 'Resenha', 'chars.neg': 'Negativos', 'chars.hint': 'Arraste para o lado',
    group: { pos: 'Futebol', soc: 'Resenha', neg: 'Negativo' },
    'duel.eyebrow': 'Craque e bagre', 'duel.title': 'No fim da noite, alguém leva a coroa e alguém leva o peixe', 'duel.mvp': 'MVP da rodada', 'duel.mvpSub': 'Somou mais pontos que todo mundo',
    'duel.goal': 'Gol mais bonito', 'duel.bagre': 'Bagre da Noite', 'duel.bagreSub': 'Não tira ponto. Só fica no perfil.', 'duel.votes': 'votos',
    'medals.eyebrow': 'Medalhas', 'medals.title': '24 medalhas pra quem aparece, joga bem ou só faz resenha', 'medals.legend': '100 rodadas, 5 MVPs e 50 personagens bons. Poucos chegam lá.',
    'medals.progress': 'Seu progresso', 'medals.unlocked': 'Desbloqueadas', 'medals.common': 'Comum', 'medals.rare': 'Rara', 'medals.epic': 'Épica',
    'medals.seq': 'Sequência', 'medals.bagreT': 'Virada de Chave', 'medals.bagreD': 'Foi Bagre numa rodada e craque na seguinte. A melhor resposta é em campo.',
    'draw.eyebrow': 'Sorteio', 'draw.title': 'O sorteio que acabou com a discussão do par ou ímpar', 'draw.body': 'O sorteio usa o overall de cada um pra montar dois times parelhos. O Paneleiro que lute.',
    'draw.again': 'Sortear de novo', 'draw.teamA': 'Time Vermelho', 'draw.teamB': 'Time Azul', 'draw.avg': 'Média', 'draw.balance': 'Equilíbrio', 'draw.perfect': 'perfeito', 'draw.diff': d => `${d} ${d === 1 ? 'ponto' : 'pontos'} de diferença`, 'draw.gk': 'Goleiro', 'draw.gkTag': '(goleiro)', 'draw.waGroup': 'Baba de quarta ⚽', 'draw.waSub': '32 participantes', 'draw.paste': 'Colou a lista, o app escala',
    'res.eyebrow': 'Resenha', 'res.title': 'A resenha continua no grupo até a próxima rodada', 'res.body': 'Cada personagem vira um card pronto pro story. E o app avisa todo mundo quando a votação abre e quando sai o resultado.',
    'res.shareDesc': 'Intransponível na defesa. Fechou o gol e salvou o time nos momentos decisivos.', 'res.shareWho': '<em>Caju</em> foi eleito <em>Paredão</em> do jogo por 5 jogadores.',
    'res.share': 'Compartilhar', 'res.shareFoot': '5 VOTOS · PERSONAGEM DA SEMANA',
    notifs: [['22:30', '⚽ Votação aberta!', 'Vote nos melhores e piores do baba de hoje!'], ['20:00', '🏆 Saíram os resultados!', 'A votação encerrou. Vem ver quem foi o craque e quem foi o bagre! 😂'], ['20:00', '🏅 Nova badge!', 'Você desbloqueou "Em Chamas"!']], 'push.now': 'agora',
    'final.tag': 'Só por convite', 'final.title': 'Bora pro baba?', 'final.body': 'Peça o convite pro admin do seu grupo e entre com a sua conta Google.', 'final.cta': 'Abrir o Canelada',
    'foot.credit': 'Produto, design e código por <a href="https://arthurfonseca.framer.website/" target="_blank" rel="noopener" data-hover>Arthur Fonseca</a> · <a href="https://campanarobr.github.io/canelada/" target="_blank" rel="noopener" data-hover>Design system ↗</a>',
    'foot.note': 'Jogadores fictícios. Imagens geradas com IA e dirigidas pelo autor.',
    live: { open: 'Votação aberta · fecha em', next: 'Próximo baba em' },
    voteQ: n => `Quem foi o ${n}?`,
  },
  en: {
    loader: 'Turning on the floodlights', drag: 'Drag', scroll: 'Scroll down', 'cur.you': 'You', 'cur.go': 'Go', 'cur.open': 'Open ↗', 'cur.click': 'Click', 'cur.see': 'See', 'cur.enter': 'Sign in', 'cur.play': 'Let’s go!',
    'nav.how': 'How it works', 'nav.app': 'The app', 'nav.chars': 'Characters', 'nav.medals': 'Medals', 'nav.draw': 'Team draw', 'nav.open': 'Sign in',
    'hero.tag': 'Live since August · Salvador', 'hero.title': 'Pickup football, now with banter.',
    'hero.sub': 'After the game, everyone votes on who was the star, the wall and the catfish of the night. Votes turn into a ranking, medals and a week of jokes.',
    'hero.cta1': 'Open Canelada', 'hero.cta2': 'See how it works',
    'frag.toastT': 'You were voted The Wall', 'frag.toastD': '5 votes · Wednesday game', 'frag.rounds': 'ROUNDS', 'frag.player': 'PLAYER', 'frag.points': 'POINTS',
    'frag.legendary': 'Legendary', 'frag.medal': 'Legend of the Baba',
    'how.eyebrow': 'How it works', 'how.title': 'How a pickup game turns into a league every Monday and Wednesday',
    'how.s1t': 'Play', 'how.s1d': 'The admin confirms who showed up and the app draws teams balanced by overall.',
    'how.s2t': 'Vote', 'how.s2d': 'Voting opens at 10:30 pm. Everyone picks a character for every player, from Pure Class to the Catfish of the Night.',
    'how.s3t': 'Climb the ranking', 'how.s3d': 'Good characters score points. The MVP falls out of the sum, and the ranking only goes up.',
    'app.today': 'Tonight’s game', 'app.presTitle': 'Who played?', 'app.draw': 'Draw teams', 'app.confirm': 'Confirm vote',
    'app.season': 'Season 2026', 'app.rankTitle': 'Ranking', 'app.general': 'Overall', 'app.month': 'Month', 'app.round': 'Round',
    'note.0': n => 'Round created', 'note.1': 'Voting is open', 'note.2': 'Overall up to 90', 'how.m1': 'Mon & Wed · 8 pm', 'how.m2': 'Opens 10:30 pm · closes 8 pm', 'how.m3': 'Updates when voting closes',
    'stats.votes': 'votes cast', 'stats.players': 'players in the group', 'stats.chars': 'characters', 'stats.medals': 'medals',
    'stats.note': 'Real numbers from the pickup group using Canelada in Salvador since August 2026.',
    band: ['Vote', 'Joke', 'Climb', 'Repeat'], sticker: 'GAME ON · CANELADA.APP.BR · ',
    'medals.tracks': 'The five tracks',
    tracks: [['Attendance', 'Showing up counts. From First Game to Legend of the Baba.', 7], ['Performance', 'MVPs by points, all the way to All-Time Great.', 5], ['Streaks', 'Rounds in a row with a good character.', 5], ['Recognition', 'What your friends vote for you.', 4], ['Collection', 'A medal for collecting medals.', 3]],
    rail: ['Home', 'How it works', 'The app', 'Numbers', 'Characters', 'Star and catfish', 'Medals', 'Team draw', 'Banter', 'Game on'],
    'app2.eyebrow': 'The real app', 'app2.title': 'This already runs a real weekly game',
    gallery: [['Voting: the night’s top 5', 'Tap a player, confirm, move to the next.'], ['Who was the catfish?', 'The character nobody wants to get.'], ['Other characters', 'Good and bad, all of them optional.'], ['Character of the week', 'Who got each character, and with how many votes.'], ['Medal unlocked', 'Every medal has a category, a rarity, and shares.'], ['The group', 'Only people with the admin’s invite can join.']],
    'chars.eyebrow': 'Characters', 'chars.title': 'Who was the star? And who was the cone?',
    'chars.body': 'There’s the star, the wall and the playmaker. There’s also the cone, the crybaby and the catfish of the night. Every round, everyone gets one.',
    'chars.all': 'All', 'chars.pos': 'Football', 'chars.soc': 'Banter', 'chars.neg': 'Low lights', 'chars.hint': 'Drag sideways',
    group: { pos: 'Football', soc: 'Banter', neg: 'Low light' },
    'duel.eyebrow': 'Star and catfish', 'duel.title': 'By the end of the night, someone gets the crown and someone gets the fish', 'duel.mvp': 'Round MVP', 'duel.mvpSub': 'Scored more points than anyone',
    'duel.goal': 'Goal of the night', 'duel.bagre': 'Catfish of the Night', 'duel.bagreSub': 'Costs no points. Just stays on the profile.', 'duel.votes': 'votes',
    'medals.eyebrow': 'Medals', 'medals.title': '24 medals for showing up, playing well or just bringing the jokes', 'medals.legend': '100 rounds, 5 MVPs and 50 good characters. Few get there.',
    'medals.progress': 'Your progress', 'medals.unlocked': 'Unlocked', 'medals.common': 'Common', 'medals.rare': 'Rare', 'medals.epic': 'Epic',
    'medals.seq': 'Streak', 'medals.bagreT': 'Turnaround', 'medals.bagreD': 'Catfish one round, star the next. The best reply is on the pitch.',
    'draw.eyebrow': 'Team draw', 'draw.title': 'The team draw that ended the arguments', 'draw.body': 'The draw uses each player’s overall to build two even sides. Sorry, Clique Guy.',
    'draw.again': 'Draw again', 'draw.teamA': 'Red team', 'draw.teamB': 'Blue team', 'draw.avg': 'Average', 'draw.balance': 'Balance', 'draw.perfect': 'perfect', 'draw.diff': d => `${d} ${d === 1 ? 'point' : 'points'} apart`, 'draw.gk': 'Keeper', 'draw.gkTag': '(keeper)', 'draw.waGroup': 'Wednesday game ⚽', 'draw.waSub': '32 members', 'draw.paste': 'Paste the list, the app picks the teams',
    'res.eyebrow': 'Banter', 'res.title': 'The jokes keep going in the group chat until the next game', 'res.body': 'Every character becomes a card ready for your story. And the app pings everyone when voting opens and when the results are in.',
    'res.shareDesc': 'Unbeatable at the back. Shut the goal and saved the team when it mattered.', 'res.shareWho': '<em>Caju</em> was voted <em>The Wall</em> by 5 players.',
    'res.share': 'Share', 'res.shareFoot': '5 VOTES · CHARACTER OF THE WEEK',
    notifs: [['10:30 pm', '⚽ Voting is open!', 'Vote for the best and worst of tonight’s game!'], ['8:00 pm', '🏆 Results are in!', 'Voting is closed. Come see who was the star and who was the catfish! 😂'], ['8:00 pm', '🏅 New badge!', 'You unlocked "On Fire"!']], 'push.now': 'now',
    'final.tag': 'Invite only', 'final.title': 'Game on?', 'final.body': 'Ask your group admin for an invite and sign in with your Google account.', 'final.cta': 'Open Canelada',
    'foot.credit': 'Product, design and code by <a href="https://arthurfonseca.framer.website/en/" target="_blank" rel="noopener" data-hover>Arthur Fonseca</a> · <a href="https://campanarobr.github.io/canelada/" target="_blank" rel="noopener" data-hover>Design system ↗</a>',
    'foot.note': 'Players are fictional. Imagery generated with AI and art-directed by the author.',
    live: { open: 'Voting open · closes in', next: 'Next game in' },
    voteQ: n => `Who was the ${n.replace(/^The /, '')}?`,
  },
};
let lang = 'pt';
{ let saved = null; try { saved = localStorage.getItem('canelada-lang'); } catch {} lang = saved || ((navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en'); }
const T = k => I18N[lang][k];

/* =========================================================
   Reveals
   ========================================================= */
function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map(w => `<span class="wl"><span class="w">${w}</span></span>`).join(' ');
  return [...el.querySelectorAll('.w')];
}
const shows = $$('[data-show]').map(el => {
  const [a, b, c, d] = el.dataset.show.split(',').map(Number);
  return { el, sec: el.closest('section'), a, b, c, d, split: el.hasAttribute('data-split'), words: null, last: -1 };
});
function updateShows(s) {
  for (const it of shows) {
    const vin = clamp((s - (it.top + it.a)) / (it.b - it.a));
    const vout = isNaN(it.c) ? 0 : clamp((s - (it.top + it.c)) / (it.d - it.c));
    const key = Math.round(vin * 400) * 1000 + Math.round(vout * 400);
    if (key === it.last) continue; it.last = key;
    if (it.words) {
      const n = it.words.length;
      it.words.forEach((w, k) => {
        const pi = smooth(clamp(vin * (1 + n * .08) - k * .08)), po = smooth(clamp(vout * (1 + n * .05) - k * .05));
        w.style.transform = `translate3d(0,${po > 0 ? -po * 112 : (1 - pi) * 112}%,0)`;
      });
      it.el.style.visibility = vin > 0 && vout < 1 ? 'visible' : 'hidden';
    } else {
      const e = smooth(vin * (1 - vout));
      it.el.style.opacity = e;
      it.el.style.transform = `translate3d(0,${vout > 0 ? -vout * 20 : (1 - vin) * 28}px,0)`;
      it.el.style.visibility = e > .001 ? 'visible' : 'hidden';
    }
  }
}
const SEC = {};
let railMax = 0;
function measure() {
  ['hero', 'how', 'app', 'stats', 'chars', 'duel', 'medals', 'draw', 'resenha', 'final'].forEach(id => {
    const el = document.getElementById(id); SEC[id] = { el, top: el.offsetTop / innerHeight, h: el.offsetHeight / innerHeight };
  });
  shows.forEach(it => { it.top = it.sec.offsetTop / innerHeight; it.last = -1; });
  railMax = Math.max(0, rail.scrollWidth - railWrap.clientWidth);
}

/* =========================================================
   Marquee
   ========================================================= */
const marquee = $('#marquee');
{
  const items = CHARS.map(c => `<span class="mq${c[3] === 'neg' ? ' neg' : ''}"><img src="img/mascots/${c[2]}.webp" alt="" loading="lazy">${c[4]}<i></i></span>`).join('');
  marquee.innerHTML = items + items;
}

/* =========================================================
   How it works: live phone
   ========================================================= */
const phone = $('#howPhone');
const presList = $('#presList');
presList.innerHTML = PLAYERS.slice(0, 7).map(p => `<li>${av(p)}<span class="nm">${p.n}<small>OVR ${p.ovr}</small></span><i class="ck"></i></li>`).join('');
const presItems = [...presList.children];
const voteGrid = $('#voteGrid');
const VOTE_PICKS = [['matador', 1], ['paredao', 7], ['bagre', 5]];
voteGrid.innerHTML = [1, 2, 0, 5, 7, 3].map(k => `<div data-k="${k}">${av(PLAYERS[k])}<span>${PLAYERS[k].n}</span></div>`).join('');
const voteState = { j: -1 };
const rankList = $('#rankList');
const RANK_START = [0, 1, 2, 3, 4, 6], RANK_END = [1, 0, 2, 3, 4, 6], PTS = [26, 22, 21, 19, 17, 14];
const rankTop = ['matador', 'garcom', 'categoria', 'paredao', 'xerife', 'racudo', 'driblador'];
rankList.innerHTML = RANK_START.map(k => `<li data-k="${k}"><span class="pos"></span>${av(PLAYERS[k])}<span class="nm">${PLAYERS[k].n}<small></small></span><span class="up">▲ 1</span><em class="pts"></em></li>`).join('');
const rankItems = [...rankList.children];
let noteState = -1, noteStep = -1;

function updateHow(r) {
  const step = clamp(Math.floor(r / .95), 0, 2), p = clamp((r - step * .95) / .95);
  phone.dataset.screen = step;
  $$('.step').forEach((el, i) => { el.classList.toggle('on', i === step); el.classList.toggle('done', i < step); el.querySelector('.st-bar b').style.transform = `scaleX(${i < step ? 1 : i === step ? p : 0})`; });
  $('#steps').style.setProperty('--rail', clamp(r / 2.85));
  const k = Math.round(ramp(r, .05, .75) * 10);
  presItems.forEach((li, i) => li.classList.toggle('in', i < k));
  $('#presN').textContent = k; $('#presBar').style.width = k * 10 + '%';
  $('#presCta').classList.toggle('disabled', k < 10);
  const vr = clamp((r - .95) / .95), j = clamp(Math.floor(vr * 3), 0, 2), jp = vr * 3 - j;
  if (j !== voteState.j) {
    voteState.j = j;
    const c = CHARS.find(x => x[0] === VOTE_PICKS[j][0]);
    const img = $('#voteMascot'); img.src = `img/mascots/${c[2]}.webp`;
    if (window.gsap) gsap.fromTo(img, { scale: .6, opacity: 0, y: 24 }, { scale: 1, opacity: 1, y: 0, duration: .7, ease: 'back.out(2)' });
    const name = lang === 'pt' ? c[4] : c[5];
    $('#voteName').textContent = name; $('#voteQ').textContent = I18N[lang].voteQ(name);
    const tag = $('#voteTag'); tag.textContent = T('group')[c[3]]; tag.className = 'tag sm ' + (c[3] === 'neg' ? 'tag-bagre' : c[3] === 'soc' ? 'tag-gold' : 'tag-soft');
    $('#voteHero').style.setProperty('--vc', c[8]);
  }
  const picked = jp > .45 && r >= .95;
  [...voteGrid.children].forEach(d => d.classList.toggle('sel', +d.dataset.k === VOTE_PICKS[j][1] && picked));
  $('#voteConfirm').classList.toggle('disabled', !picked);
  $$('#voteSteps i').forEach((el, i) => el.classList.toggle('on', i < j || (i === j && picked)));
  const climbed = r > 2.25;
  const order = climbed ? RANK_END : RANK_START;
  rankItems.forEach(li => {
    const kk = +li.dataset.k, pos = order.indexOf(kk);
    li.style.transform = `translateY(${pos * 66}px)`;
    li.querySelector('.pos').textContent = pos + 1;
    li.classList.toggle('first', pos === 0); li.classList.toggle('climb', climbed && kk === 1);
    const pts = kk === 1 && climbed ? 30 : PTS[RANK_START.indexOf(kk)];
    const e = li.querySelector('.pts'); e.textContent = pts; e.className = 'pts' + (pos === 0 ? ' p-gold' : '');
    const c = CHARS.find(x => x[0] === rankTop[RANK_START.indexOf(kk)]);
    li.querySelector('small').textContent = lang === 'pt' ? c[4] : c[5];
  });
  const ns = step * 100 + (step === 0 ? k : 0);
  if (ns !== noteState) {
    noteState = ns;
    const note = T('note.' + step);
    $('#howNoteTxt').textContent = typeof note === 'function' ? note(k) : note;
    if (window.gsap && step !== noteStep) gsap.fromTo('#howNote .iconbox', { scale: .5 }, { scale: 1, duration: .5, ease: 'back.out(3)' });
    noteStep = step;
  }
}

/* =========================================================
   Characters: draggable rail with tilt cards
   ========================================================= */
const rail = $('#rail'), railWrap = $('#railWrap');
let railX = 0, railTarget = 0, railVel = 0, railDrag = null, filter = 'all';
function buildRail() {
  rail.innerHTML = CHARS.map(c => `
    <article class="ccard" data-g="${c[3]}"${filter !== 'all' && filter !== c[3] ? ' hidden' : ''}>
      <div class="art" style="background-image:url(img/cardbg/${c[2]}.webp)"></div>
      <img class="mascot" src="img/mascots/${c[2]}.webp" alt="" loading="lazy" draggable="false">
      <div class="info"><span class="tag sm ${c[3] === 'neg' ? 'tag-bagre' : c[3] === 'soc' ? 'tag-gold' : 'tag-soft'}">${T('group')[c[3]]}</span>
        <b>${lang === 'pt' ? c[4] : c[5]}</b>${lang === 'pt' ? '' : `<small>${c[4]}</small>`}<p>${lang === 'pt' ? c[6] : c[7]}</p></div>
      <i class="shine"></i>
    </article>`).join('');
  [...rail.children].forEach(card => {
    card.addEventListener('pointermove', e => {
      const b = card.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      card.style.setProperty('--mx', `${x * 100}%`); card.style.setProperty('--my', `${y * 100}%`);
      card.dataset.tx = (x - .5) * 14; card.dataset.ty = (y - .5) * -14;
    });
    card.addEventListener('pointerleave', () => { card.dataset.tx = 0; card.dataset.ty = 0; });
  });
  railMax = Math.max(0, rail.scrollWidth - railWrap.clientWidth);
}
railWrap.addEventListener('pointerdown', e => { railDrag = { x: e.clientX, start: railTarget }; railVel = 0; railWrap.setPointerCapture(e.pointerId); });
railWrap.addEventListener('pointermove', e => { if (!railDrag) return; railVel = e.movementX || 0; railTarget = clamp(railDrag.start + (e.clientX - railDrag.x), -railMax, 0); });
const endRail = () => { if (!railDrag) return; railDrag = null; railTarget = clamp(railTarget + railVel * 12, -railMax, 0); };
railWrap.addEventListener('pointerup', endRail); railWrap.addEventListener('pointercancel', endRail);
railWrap.addEventListener('wheel', e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); railTarget = clamp(railTarget - e.deltaX, -railMax, 0); } }, { passive: false });
railWrap.addEventListener('pointerenter', () => { if (hoverDevice) cursor.classList.add('drag'); });
railWrap.addEventListener('pointerleave', () => cursor.classList.remove('drag'));
$$('.tab').forEach(b => b.addEventListener('click', () => {
  filter = b.dataset.f;
  $$('.tab').forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); });
  [...rail.children].forEach((c, i) => {
    const show = filter === 'all' || c.dataset.g === filter;
    c.hidden = !show; c.classList.remove('enter');
    if (show) { void c.offsetWidth; c.style.animationDelay = (i % 8) * .04 + 's'; c.classList.add('enter'); }
  });
  railTarget = 0; railX = 0;
  requestAnimationFrame(() => { railMax = Math.max(0, rail.scrollWidth - railWrap.clientWidth); });
}));
function updateRail(dt) {
  railX = damp(railX, railTarget, railDrag ? 22 : 8, dt);
  rail.style.transform = `translate3d(${railX}px,0,0)`;
  $('#railBar').style.width = `${(railMax ? -railX / railMax : 0) * 100}%`;
  const vx = (railTarget - railX) * .02;
  [...rail.children].forEach(c => {
    const tx = +(c.dataset.tx || 0), ty = +(c.dataset.ty || 0);
    c._rx = damp(c._rx || 0, ty, 8, dt); c._ry = damp(c._ry || 0, tx - vx * 6, 8, dt);
    c.style.transform = `perspective(900px) rotateX(${c._rx}deg) rotateY(${c._ry}deg)`;
  });
}

/* =========================================================
   Duel: vote bars
   ========================================================= */
const BAD_VOTES = [['Pedrão', 7], ['Binho', 3], ['Dudu', 2]];
$('#voteBars').innerHTML = BAD_VOTES.map(v => `<div class="vbar"><span>${v[0]}</span><div class="pbar"><i></i></div><b>${v[1]}</b></div>`).join('');
const vbars = $$('.vbar .pbar i');

/* =========================================================
   Medals
   ========================================================= */
const hexgrid = $('#hexgrid'), tip = $('#badgeTip');
const OFFICIAL = ['primeiro-baba', 'veterano', 'casca-grossa', 'mais-presente', 'alma-do-grupo', 'hall-da-fama', 'lenda-do-baba', 'mvp', 'rei-absoluto', 'craque-da-galera', 'rei-do-mes', 'craque-historico', 'em-chamas', 'imparavel', 'invicto', 'virada-de-chave', 'consistente', 'operario', 'racudo-do-mes', 'resenha-forte', 'querido-da-galera', 'colecionador', 'mestre-da-resenha', 'completo'];
const BADGE_ORDER = OFFICIAL;
hexgrid.innerHTML = BADGE_ORDER.map(k => `<div class="hex" data-k="${k}"><img src="img/badges/${k}.webp" alt="" loading="lazy"></div>`).join('');
const hexes = [...hexgrid.children];
const UNLOCK = hexes.map((h, i) => ({ h, o: (i * 7919) % 97 + (h.dataset.k === 'completo' ? 999 : h.dataset.k === 'lenda-do-baba' ? 500 : 0) })).sort((a, b) => a.o - b.o).map(x => x.h);
let unlocked = -1;
hexes.forEach(h => {
  h.addEventListener('pointerenter', () => { const b = BADGES[h.dataset.k]; tip.querySelector('b').textContent = lang === 'pt' ? b[0] : b[1]; tip.querySelector('span').textContent = lang === 'pt' ? b[2] : b[3]; tip.classList.add('on'); });
  h.addEventListener('pointerleave', () => tip.classList.remove('on'));
});
function updateMedals(r) {
  const n = Math.round(ramp(r, -.6, .55) * 18);
  if (n !== unlocked) {
    UNLOCK.forEach((h, i) => {
      const on = i < n;
      if (on && !h.classList.contains('on')) { h.classList.add('on', 'pop'); setTimeout(() => h.classList.remove('pop'), 700); }
      if (!on) h.classList.remove('on');
    });
    unlocked = n; $('#unlockN').textContent = n;
  }
  const leg = Math.round(ramp(r, -.55, .3) * 78);
  $('#legN').textContent = leg; $('#legBar').style.width = leg + '%';
}

/* =========================================================
   Team draw: the WhatsApp list becomes two balanced teams (same model as the app)
   ========================================================= */
const GK = { 7: true, 9: true }; // Pedrão and Dudu keep goal
const waList = $('#waList'), teamUl = [$('#team0'), $('#team1')];
const pRow = {};
PLAYERS.forEach((p, i) => {
  const li = document.createElement('li'); li.className = 'trow2'; li.dataset.i = i;
  li.innerHTML = `${av(p)}<span class="tn2"><b>${p.n}</b>${GK[i] ? `<small class="gk"></small>` : ''}</span><em>${p.ovr}</em>`;
  pRow[i] = li;
});
function balanceTeams(random) {
  // keep one keeper per side, then snake the rest by overall with a random tiebreak
  let best = null;
  for (let t = 0; t < (random ? 300 : 1); t++) {
    const field = PLAYERS.map((p, i) => i).filter(i => !GK[i]);
    if (random) field.sort(() => Math.random() - .5); else field.sort((a, b) => PLAYERS[b].ovr - PLAYERS[a].ovr);
    const A = [7], B = [9];
    field.forEach((i, k) => ((random ? Math.random() < .5 : [0, 3, 4, 7].includes(k)) ? (A.length < 5 ? A : B) : (B.length < 5 ? B : A)).push(i));
    const sa = A.reduce((s, i) => s + PLAYERS[i].ovr, 0), sb = B.reduce((s, i) => s + PLAYERS[i].ovr, 0), diff = Math.abs(sa - sb);
    if (!best || diff < best.diff) best = { A, B, sa, sb, diff };
    if (random && diff <= 1 && t > 30) break;
  }
  return best;
}
/* pitch tokens: each name flies from the WhatsApp list onto the pitch */
const JERSEY = '<svg viewBox="0 0 32 30" aria-hidden="true"><path d="M11 2 L6 5 L2 9.5 L6.6 11.2 L6.6 27 L25.4 27 L25.4 11.2 L30 9.5 L26 5 L21 2 C20 4.2 18.2 5.2 16 5.2 C13.8 5.2 12 4.2 11 2Z"/></svg>';
// a lista do grupo continua legível: quem já foi escalado ganha a camisa do time ao lado do nome
waList.innerHTML = PLAYERS.map((p, i) => `<span class="wl-line" data-i="${i}"><span>${i + 1}. ${p.n}${GK[i] ? ' <em class="wl-gk" data-i18n="draw.gkTag">(goleiro)</em>' : ''}</span><i class="wl-tag" aria-hidden="true">${JERSEY}</i></span>`).join('');
const dstage = $('#dstage'), dpitch = $('#dpitch'), drawx = $('#drawx');
// formation per side, x/y as fraction of the pitch (left side; right side mirrors x)
const FORM = [[.075, .5], [.21, .27], [.21, .73], [.37, .36], [.37, .64]];
const tokens = PLAYERS.map((p, i) => {
  const el = document.createElement('div'); el.className = 'tok';
  el.innerHTML = `<i class="tok-j">${JERSEY}<span>${p.ovr}</span></i><b class="tok-n">${p.n}</b>`;
  dstage.appendChild(el); return { el, i, slot: [0, 0], x: 0, y: 0, k: 0, init: false };
});
const drawPlay = { p: 0, started: false };
function updateDrawFlow(dt) {
  const box = drawx.getBoundingClientRect();
  if (box.bottom < -200 || box.top > innerHeight + 200) return;
  const pr = dpitch.getBoundingClientRect();
  // play once, in time, as soon as the pitch is well inside the viewport
  if (!drawPlay.started && pr.top < innerHeight * .62) { drawPlay.started = true; gsap.to(drawPlay, { p: 1, duration: reduceMotion ? .01 : 2.6, ease: 'power1.inOut' }); }
  const p = drawPlay.p;
  const W = pr.width, H = pr.height, js = clamp(W / 18, 30, 52);
  tokens.forEach(t => {
    const line = waList.querySelector(`[data-i="${t.i}"]`).getBoundingClientRect();
    const [team, k] = t.slot, f = FORM[k], fx = team ? 1 - f[0] : f[0];
    const tx = pr.left - box.left + fx * W, ty = pr.top - box.top + f[1] * H;
    const sx = line.left - box.left + line.width / 2, sy = line.top - box.top + line.height / 2;
    const kk = smooth(clamp(p * 1.9 - t.i * .09));
    if (!drawPlay.started) { t.el.style.opacity = 0; return; }
    // curved flight: lift in the middle of the path
    const ex = lerp(sx, tx, kk), ey = lerp(sy, ty, kk) - Math.sin(kk * Math.PI) * 60;
    if (!t.init) { t.x = ex; t.y = ey; t.init = true; }
    t.x = damp(t.x, ex, 9, dt); t.y = damp(t.y, ey, 9, dt);
    t.el.style.setProperty('--js', js + 'px');
    t.el.style.transform = `translate3d(${t.x}px,${t.y}px,0) translate(-50%,-50%) scale(${lerp(.55, 1, kk)})`;
    t.el.style.opacity = kk > .02 ? 1 : 0;
    t.el.classList.toggle('t1', team === 1); t.el.classList.toggle('gk', !!GK[t.i]); t.el.classList.toggle('landed', kk > .96);
    const wl = waList.querySelector(`[data-i="${t.i}"]`); wl.classList.toggle('sent', kk > .5); wl.classList.toggle('t1', team === 1); wl.classList.toggle('gk', !!GK[t.i]);
  });
}
let drawResult = null;
function renderDraw(res, animate) {
  const first = {};
  if (animate) Object.entries(pRow).forEach(([i, li]) => { if (li.isConnected) first[i] = li.getBoundingClientRect(); });
  [res.A, res.B].forEach((team, t) => { team.sort((a, b) => (GK[b] ? 1 : 0) - (GK[a] ? 1 : 0) || PLAYERS[b].ovr - PLAYERS[a].ovr); team.forEach(i => teamUl[t].appendChild(pRow[i])); });
  if (animate && window.gsap) Object.entries(pRow).forEach(([i, li]) => {
    const f = first[i]; if (!f) return; const l = li.getBoundingClientRect();
    gsap.fromTo(li, { x: f.left - l.left, y: f.top - l.top }, { x: 0, y: 0, duration: .9, ease: 'expo.inOut', delay: Math.random() * .12 });
  });
  const avgA = (res.sa / 5).toFixed(1), avgB = (res.sb / 5).toFixed(1);
  const fa = avgA.replace('.', lang === 'pt' ? ',' : '.'), fb = avgB.replace('.', lang === 'pt' ? ',' : '.');
  $('#avg0').textContent = fa; $('#avg1').textContent = fb; $$('.avgc').forEach(e => e.textContent = e.dataset.t === '0' ? fa : fb);
  res.A.forEach((i, k) => tokens[i].slot = [0, k]); res.B.forEach((i, k) => tokens[i].slot = [1, k]);
  $('#eqA').style.flexGrow = res.sa; $('#eqB').style.flexGrow = res.sb;
  const d = res.diff, eq = $('#eqTxt');
  eq.textContent = d === 0 ? T('draw.perfect') : T('draw.diff')(d);
  eq.style.color = d <= 5 ? 'var(--brand)' : d <= 15 ? '#f0a44a' : '#ff8a80';
  drawResult = res;
}
function labelDraw() { $$('.trow2 .gk').forEach(g => g.textContent = T('draw.gk')); if (drawResult) renderDraw(drawResult, false); }
renderDraw(balanceTeams(false), false);
$('#reshuffle').addEventListener('click', () => renderDraw(balanceTeams(true), true));


/* =========================================================
   Resenha notifications
   ========================================================= */
const notifs = $('#notifs');
function buildNotifs() {
  notifs.innerHTML = T('notifs').map(n => `<div class="push"><img src="img/logo.webp" alt=""><div class="push-b"><div class="push-top"><span>CANELADA</span><time>${n[0]}</time></div><b>${n[1]}</b><p>${n[2]}</p></div></div>`).join('');
}

/* =========================================================
   Language
   ========================================================= */
function applyLang(l, animate) {
  lang = l;
  document.documentElement.lang = l === 'pt' ? 'pt-BR' : 'en';
  try { localStorage.setItem('canelada-lang', l); } catch {}
  const swap = () => {
    $$('[data-i18n]').forEach(el => { const v = I18N[l][el.dataset.i18n]; if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-html]').forEach(el => { el.innerHTML = I18N[l][el.dataset.i18nHtml]; });
    hydrateIcons();
    shows.forEach(it => { if (it.split) it.words = splitWords(it.el); it.last = -1; });
    buildRail(); buildNotifs(); labelStickers(); labelDraw(); buildTracks(); $('#stickerTxt').textContent = T('sticker').repeat(2); voteState.j = -1; noteState = -1; gIdx = -1; tagKey = ''; setTag(tagEl);
    document.title = l === 'pt' ? 'Canelada — O baba virou resenha' : 'Canelada — Pickup football, now with banter';
  };
  $$('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === l));
  $('.lang').dataset.l = l;
  requestAnimationFrame(placeLangPill); if (typeof tickLive === 'function') setTimeout(tickLive, 0);
  if (animate && window.gsap) gsap.timeline().to('main', { opacity: 0, duration: .2, ease: 'power2.in' }).add(swap).to('main', { opacity: 1, duration: .45, ease: 'power2.out' });
  else swap();
}

/* =========================================================
   Pointer, cursor, magnets, spotlight cards
   ========================================================= */
const mouse = { x: 0, y: 0, sx: 0, sy: 0, px: innerWidth / 2, py: innerHeight / 2 };
addEventListener('pointermove', e => {
  mouse.px = e.clientX; mouse.py = e.clientY; mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = e.clientY / innerHeight * 2 - 1;
  if (tip.classList.contains('on')) tip.style.transform = `translate(${e.clientX + 18}px,${e.clientY + 18}px)`;
}, { passive: true });
const cursor = $('.cursor'), cDot = $('.c-dot'), cRing = $('.c-ring'), ringPos = { x: mouse.px, y: mouse.py };
// cursor etiqueta (padrão; ?cursor=antigo volta o anel): a seta fica exata no ponteiro; a etiqueta segue com atraso, inclina com a velocidade e troca o texto pelo alvo
const TAG = hoverDevice && new URLSearchParams(location.search).get('cursor') !== 'antigo';
const cArrow = $('.c-arrow'), cTag = $('.c-tag'), cTagT = $('.c-tag-t'), tagPos = { x: mouse.px, y: mouse.py, r: 0 };
let tagKey = '', tagEl = null;
function tagLabel(el) {
  if (cursor.classList.contains('drag')) return '↔ ' + T('drag');
  if (!el) return T('cur.you');
  if (el.dataset.cur) return T('cur.' + el.dataset.cur);
  if (el.matches('.hs, .hex')) return T('cur.see');
  if (el.matches('a[href^="#"]')) return T('cur.go');
  if (el.matches('a[href^="http"]')) return T('cur.open');
  return T('cur.click');
}
function setTag(el) {
  if (!TAG) return; tagEl = el; const t = tagLabel(el); if (t === tagKey) return; tagKey = t; cTagT.textContent = t;
  if (!reduceMotion) gsap.fromTo(cTag, { scale: .7 }, { scale: 1, duration: .45, ease: 'back.out(3)' });
}
if (TAG) {
  document.documentElement.classList.add('cur-tag');
  document.addEventListener('pointerover', e => setTag(e.target.closest('a, button, [data-hover], .hs, .hex')));
  addEventListener('pointerdown', () => cursor.classList.add('press')); addEventListener('pointerup', () => cursor.classList.remove('press'));
  new MutationObserver(() => setTag(tagEl)).observe(cursor, { attributes: true, attributeFilter: ['class'] });
}
document.addEventListener('pointerover', e => cursor.classList.toggle('hover', !!e.target.closest('[data-hover], .hex')));
$$('.spot').forEach(el => el.addEventListener('pointermove', e => {
  const r = el.getBoundingClientRect(); el.style.setProperty('--mx', `${e.clientX - r.left}px`); el.style.setProperty('--my', `${e.clientY - r.top}px`);
}));
function magnets() {
  $$('[data-magnet]').forEach(el => {
    const inner = el.firstElementChild;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: dx * .22, y: dy * .32, duration: .5, ease: 'power3.out' }); gsap.to(inner, { x: dx * .08, y: dy * .1, duration: .5, ease: 'power3.out' });
    });
    el.addEventListener('pointerleave', () => gsap.to([el, inner], { x: 0, y: 0, duration: .9, ease: 'elastic.out(1,.4)' }));
  });
}
$$('.lang button').forEach(b => b.addEventListener('click', () => { if (b.dataset.lang !== lang) applyLang(b.dataset.lang, true); }));
{
  const c = document.createElement('canvas'); c.width = c.height = 160; const g = c.getContext('2d'), d = g.createImageData(160, 160);
  for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255 | 0; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  g.putImageData(d, 0, 0); $('#grain').style.backgroundImage = `url(${c.toDataURL()})`;
}

/* =========================================================
   Hero v3: hotspots over the squad image (positions in image pixels, 1453x774)
   ========================================================= */
const HOT = [['racudo', 98, 500], ['corpo-mole', 0, 0], ['bragueiro', 218, 495], ['firuleiro', 288, 468], ['driblador', 378, 470], ['gol-mais-bonito', 392, 280],
  ['categoria', 468, 520], ['matador', 628, 500], ['bagre', 826, 540], ['paneleiro', 956, 520], ['cone', 1020, 540], ['reclamao', 1096, 490],
  ['chorao', 1176, 450], ['garcom', 1256, 440], ['paredao', 1214, 590], ['xerife', 1360, 580]].filter(h => h[1]);
const hotEl = $('#hotspots'), heroBgImg = $('.hero-bg img');
const hots = HOT.map(([slug, ix, iy]) => {
  const c = CHARS.find(k => k[2] === slug); const el = document.createElement('i'); el.className = 'hs'; el.dataset.hover = '';
  el.addEventListener('pointerenter', e => { squadTip.querySelector('b').textContent = lang === 'pt' ? c[4] : c[5]; squadTip.querySelector('span').textContent = lang === 'pt' ? c[6] : c[7]; squadTip.classList.add('on'); });
  el.addEventListener('pointermove', e => { squadTip.style.transform = `translate(${e.clientX}px,${e.clientY - 22}px) translate(-50%,-100%)`; });
  el.addEventListener('pointerleave', () => squadTip.classList.remove('on'));
  hotEl.appendChild(el); return { el, ix, iy };
});
function updateHotspots(e) {
  const r = heroBgImg.getBoundingClientRect(), sx = r.width / 1461;
  hots.forEach(h => { h.el.style.left = (r.left + (h.ix + 4) / 1461 * r.width) + 'px'; h.el.style.top = (r.top + (h.iy + 2) / 812 * r.height) + 'px'; h.el.style.setProperty('--s', Math.max(60, 110 * sx) + 'px'); });
  hotEl.style.opacity = 1 - ramp(e, .2, .6); hotEl.style.pointerEvents = e > .5 ? 'none' : '';
}

/* =========================================================
   Hero: sticker album. 19 stickers burst out of the pack, can be dragged,
   tilt with a holographic sheen, and flip on click.
   ========================================================= */
const BANDS = { pos: ['#9fe870', '#1998ad', '#f0c86a'], soc: ['#f0c86a', '#ff8a5b', '#c9a7ff'], neg: ['#ef4444', '#7fd3ff', '#1e1e1e'] };
const FOIL = ['categoria', 'bagre', 'gol-mais-bonito'];
// desktop slots: [x, y (0-1 of viewport), rotation, depth]
const SLOTS_D = [
  [.05, .7, -14, .3], [.115, .76, 8, .5], [.045, .9, -4, .7], [.13, .94, 12, .85], [.205, .86, -9, .6],
  [.95, .7, 13, .3], [.885, .76, -7, .5], [.955, .9, 5, .7], [.87, .94, -11, .85], [.795, .86, 9, .6],
  [.355, .92, -14, .75], [.405, .88, -8, .8], [.455, .86, -3, .9], [.5, .885, 0, 1], [.545, .86, 3, .9], [.595, .88, 8, .8], [.645, .92, 14, .75],
  [.285, .9, -6, .55], [.715, .9, 6, .55],
];
const SLOTS_M = [[.2, .76, -12, .6], [.5, .745, 0, .9], [.8, .76, 12, .6], [.3, .88, -6, .8], [.7, .88, 6, .8], [.5, .9, 2, 1]];
const ORDER = ['frangueiro', 'firuleiro', 'paneleiro', 'garcom', 'xerife', 'cone', 'chorao', 'reclamao', 'driblador', 'delegado', 'pregueiro', 'paredao', 'matador', 'categoria', 'bagre', 'racudo', 'bragueiro', 'resenha-forte', 'gol-mais-bonito'];
const albumEl = $('#album') || document.createElement('div'), squadTip = $('#squadTip');
const stickers = ORDER.map((slug, i) => {
  const c = CHARS.find(k => k[2] === slug), num = String(i + 1).padStart(2, '0'), b = BANDS[c[3]];
  const el = document.createElement('div'); el.className = 'stk' + (FOIL.includes(slug) ? ' foil' : ''); el.dataset.hover = '';
  el.style.setProperty('--c', c[8]); el.style.setProperty('--b1', b[0]); el.style.setProperty('--b2', b[1]); el.style.setProperty('--b3', b[2]);
  el.innerHTML = `<div class="stk-in"><div class="stk-f"><div class="stk-art"><span class="stk-num">${num}</span><i class="stk-crest"></i><img class="stk-m" src="img/mascots/${slug}.webp" alt="" draggable="false"><div class="stk-plate"><b></b><small><i>CNL ${num}</i><span></span></small></div></div><i class="stk-holo"></i><i class="stk-glare"></i></div>
    <div class="stk-b"><img src="img/logo.webp" alt=""><b></b><p></p><em>CANELADA · 2026</em></div></div>`;
  albumEl.appendChild(el);
  const st = { el, slug, c, i, k: 0, dx: 0, dy: 0, drag: null, tx: 0, ty: 0, rx: 0, ry: 0, lift: 0, phase: Math.random() * 6.28 };
  el.addEventListener('pointerdown', e => { st.drag = { x: e.clientX - st.dx, y: e.clientY - st.dy, sx: e.clientX, sy: e.clientY }; el.setPointerCapture(e.pointerId); el.style.zIndex = 900 + (++topZ); squadTip.classList.remove('on'); });
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    st.tx = (py - .5) * -22; st.ty = (px - .5) * 26;
    el.style.setProperty('--hx', `${px * 100}%`); el.style.setProperty('--hy', `${py * 100}%`); el.style.setProperty('--gx', `${px * 100}%`); el.style.setProperty('--gy', `${py * 100}%`);
    if (st.drag) { st.dx = e.clientX - st.drag.x; st.dy = e.clientY - st.drag.y; }
    else if (!squadTip.classList.contains('on')) showTip(st);
    moveTip(e);
  });
  el.addEventListener('pointerup', e => { if (st.drag && Math.hypot(e.clientX - st.drag.sx, e.clientY - st.drag.sy) < 5) el.classList.toggle('flip'); st.drag = null; });
  el.addEventListener('pointerenter', () => { st.lift = 1; el.style.setProperty('--go', 1); showTip(st); });
  el.addEventListener('pointerleave', () => { st.lift = 0; st.tx = st.ty = 0; el.style.setProperty('--go', 0); squadTip.classList.remove('on'); });
  return st;
});
let topZ = 0;
function showTip(st) { squadTip.querySelector('b').textContent = lang === 'pt' ? st.c[4] : st.c[5]; squadTip.querySelector('span').textContent = (FOIL.includes(st.slug) ? (lang === 'pt' ? 'Brilhante · ' : 'Foil · ') : '') + (lang === 'pt' ? 'clique pra virar' : 'click to flip'); squadTip.classList.add('on'); }
function moveTip(e) { squadTip.style.transform = `translate(${e.clientX}px,${e.clientY - 18}px) translate(-50%,-100%)`; }
function labelStickers() {
  stickers.forEach(st => {
    const name = lang === 'pt' ? st.c[4] : st.c[5];
    st.el.querySelector('.stk-plate b').textContent = name;
    st.el.querySelector('.stk-plate small span').textContent = T('group')[st.c[3]].toUpperCase();
    st.el.querySelector('.stk-b b').textContent = name;
    st.el.querySelector('.stk-b p').textContent = lang === 'pt' ? st.c[6] : st.c[7];
  });
}
const albumIn = { t: 0 };
function updateAlbum(r, mx, my, dt) {
  const W = innerWidth, H = innerHeight, mob = isMobile, slots = mob ? SLOTS_M : SLOTS_D;
  const out = ramp(r, .1, .7);
  stickers.forEach((st, i) => {
    const slot = mob ? (i >= ORDER.length - slots.length ? slots[i - (ORDER.length - slots.length)] : null) : slots[i];
    if (!slot) { st.el.style.display = 'none'; return; } st.el.style.display = '';
    const [sx, sy, rot, d] = slot;
    const w = (mob ? lerp(70, 92, d) : lerp(84, 116, d) * Math.min(1.15, W / 1440 * 1.08));
    st.el.style.setProperty('--w', w + 'px');
    const appear = clamp(albumIn.t * 2.2 - i * .055); st.k = 1 - Math.pow(1 - appear, 3);
    st.rx = damp(st.rx, st.drag ? 0 : st.tx, 10, dt); st.ry = damp(st.ry, st.drag ? 0 : st.ty, 10, dt);
    st.lv = damp(st.lv || 0, st.lift || (st.drag ? 1 : 0), 10, dt);
    // burst from the pack below the fold, spin into place
    const fromX = W / 2, fromY = H * 1.15;
    const x = lerp(fromX, sx * W, st.k) + st.dx + mx * (4 + d * 14);
    const y = lerp(fromY, sy * H, st.k) + st.dy + my * (2 + d * 8) - out * (120 + d * 260) - Math.sin(time * 1.3 + st.phase) * 3 * (reduceMotion ? 0 : 1);
    const spin = (1 - st.k) * (i % 2 ? 260 : -260);
    st.el.style.transform = `translate3d(${x - w / 2}px,${y - w * .7}px,${st.lv * 60}px) rotate(${rot * (1 - st.lv * .7) + spin + out * rot}deg) rotateX(${st.rx}deg) rotateY(${st.ry}deg) scale(${(.4 + .6 * st.k) * (1 + st.lv * .1)})`;
    st.el.style.opacity = st.k * (1 - out * .9);
    if (!st.el.style.zIndex || st.el.style.zIndex < 900) st.el.style.zIndex = Math.round(d * 100) + (st.lift ? 500 : 0);
  });
}

/* =========================================================
   Hero squad: every character standing on the pitch, in perspective
   ========================================================= */
// [slug, x (0-1 of width), y (0-1 of height, feet), depth 0 back .. 1 front]
const SQUAD = [
  ['frangueiro', .5, .772, 0], ['paredao', .37, .775, .03], ['cone', .63, .776, .03],
  ['pregueiro', .23, .8, .2], ['xerife', .12, .805, .18], ['chorao', .77, .8, .2], ['reclamao', .88, .805, .18],
  ['firuleiro', .3, .85, .4], ['bragueiro', .7, .85, .4], ['garcom', .42, .86, .45], ['delegado', .58, .86, .45],
  ['driblador', .18, .9, .6], ['resenha-forte', .82, .9, .6], ['paneleiro', .06, .93, .68], ['racudo', .94, .93, .68],
  ['matador', .34, .985, .88], ['categoria', .585, 1.0, 1], ['bagre', .77, .985, .88], ['gol-mais-bonito', .14, 1.0, .92],
];
const SQUAD_M = ['paredao', 'garcom', 'resenha-forte', 'matador', 'categoria', 'bagre', 'cone'];
const squadEl = document.createElement('div');
const squad = SQUAD.map(([slug, x, y, d], i) => {
  const c = CHARS.find(k => k[2] === slug);
  const el = document.createElement('div'); el.className = 'pl'; el.dataset.hover = '';
  el.innerHTML = `<img class="fig" src="img/mascots/${slug}.webp" alt="${c ? c[4] : ''}" draggable="false">`;
  squadEl.appendChild(el);
  el.addEventListener('pointerenter', () => { const n = lang === 'pt' ? c[4] : c[5]; squadTip.querySelector('b').textContent = n; squadTip.querySelector('span').textContent = T('group')[c[3]]; squadTip.classList.add('on'); p.hover = 1; });
  el.addEventListener('pointerleave', () => { squadTip.classList.remove('on'); p.hover = 0; });
  const p = { el, slug, x, y, d, i, k: 0, hover: 0, hv: 0, phase: Math.random() * 6.28, mob: SQUAD_M.includes(slug) };
  return p;
});
const squadIn = { t: 0 };
function updateSquad(r, mx, my, dt) {
  const W = innerWidth, H = innerHeight, mob = isMobile;
  const e = ramp(r, 0, 1), out = ramp(r, .15, .75);
  let tipEl = null;
  squad.forEach(p => {
    if (mob && !p.mob) { p.el.style.display = 'none'; return; } p.el.style.display = '';
    const appear = clamp(squadIn.t * 1.9 - (1 - p.d) * .9 - p.i * .015);
    p.k = 1 - Math.pow(1 - appear, 3);
    p.hv = damp(p.hv, p.hover, 10, dt);
    const base = mob ? lerp(62, 118, p.d) : lerp(70, 168, p.d) * Math.min(1, W / 1440 * 1.1);
    p.el.style.setProperty('--w', base + 'px');
    p.el.style.setProperty('--lit', (.72 + p.d * .22).toFixed(2)); p.el.style.setProperty('--blur', ((1 - p.d) * 1.2).toFixed(2) + 'px');
    const spread = 1 + out * (.25 + p.d * .5);
    const x = W / 2 + (p.x - .5) * W * spread + mx * (6 + p.d * 26);
    const y = H * (mob ? lerp(.72, .96, (p.y - .772) / .228) : p.y) + my * (3 + p.d * 10) + out * p.d * 90;
    const bob = Math.abs(Math.sin(time * 2.2 + p.phase)) * 5 * (reduceMotion ? 0 : 1) * (1 - p.hv);
    const drop = (1 - p.k) * -120;
    p.el.style.transform = `translate3d(${x}px,${y - base * 1.0 + drop - bob - p.hv * 14}px,0) scale(${(.3 + .7 * p.k) * (1 + p.hv * .12)}) rotate(${Math.sin(time * 1.1 + p.phase) * 2 * (reduceMotion ? 0 : 1)}deg)`;
    p.el.style.opacity = p.k * (1 - out * (1 - p.d * .3));
    p.el.style.zIndex = Math.round(p.y * 1000);
    if (p.hover) tipEl = { x, y: y - base * 1.0 - 14 };
  });
  if (tipEl) squadTip.style.transform = `translate(${tipEl.x}px,${tipEl.y}px) translate(-50%,-100%)`;
}

/* =========================================================
   Craft details: odometer, big band, medal tracks, sticker, trail, side rail
   ========================================================= */
function buildOdos() {
  $$('.odo').forEach(o => {
    const to = String(o.dataset.to), sep = o.dataset.sep || '';
    const str = sep && to.length > 3 ? to.slice(0, -3) + sep + to.slice(-3) : to;
    o.innerHTML = [...str].map(ch => /\d/.test(ch) ? `<span class="dg"><i>${[...Array(10).keys(), ...Array(10).keys()].map(n => `<span>${n}</span>`).join('')}</i></span>` : `<span class="sep">${ch}</span>`).join('');
    o.dataset.str = str;
  });
}
buildOdos();
const odoIO = new IntersectionObserver(es => es.forEach(e => {
  const o = e.target, digits = [...o.dataset.str].filter(c => /\d/.test(c));
  [...o.querySelectorAll('.dg i')].forEach((col, k) => { col.style.transitionDelay = (k * .12) + 's'; col.style.transform = e.isIntersecting ? `translateY(${-(10 + +digits[k]) * .9}em)` : 'translateY(0)'; });
}), { threshold: .5 });
$$('.odo').forEach(o => odoIO.observe(o));

const tracksEl = $('#tracks'), revealFloat = $('#revealFloat');
const TRACK_MEDALS = [['primeiro-baba', 'veterano', 'lenda-do-baba'], ['mvp', 'rei-absoluto', 'craque-historico'], ['em-chamas', 'imparavel', 'invicto'], ['operario', 'resenha-forte', 'querido-da-galera'], ['colecionador', 'mestre-da-resenha', 'completo']];
function buildTracks() {
  tracksEl.querySelectorAll('.trow').forEach(r => r.remove());
  T('tracks').forEach((t, i) => {
    const row = document.createElement('div'); row.className = 'trow'; row.dataset.hover = '';
    row.innerHTML = `<span class="tn">0${i + 1}</span><span class="tt">${t[0]}</span><span class="td">${t[1]}</span><span class="tc">${t[2]}</span>`;
    row.addEventListener('pointerenter', () => {
      revealFloat.innerHTML = TRACK_MEDALS[i].map((m, k) => `<img src="img/badges/${m}.webp" alt="" style="transform:translate(${(k - 1) * 62}px,${Math.abs(k - 1) * 14}px) rotate(${(k - 1) * 12}deg) scale(${k === 1 ? 1.15 : .95})">`).join('');
      revealFloat.classList.add('on');
    });
    row.addEventListener('pointerleave', () => revealFloat.classList.remove('on'));
    tracksEl.appendChild(row);
  });
}
const rf = { x: 0, y: 0 };
const RAIL_IDS = ['hero', 'how', 'app', 'stats', 'chars', 'duel', 'medals', 'draw', 'resenha', 'final'];

/* =========================================================
   Real app gallery: phones fan out, then a carousel focuses each screen
   ========================================================= */
const gphones = $$('.gphone'), gdots = $$('#gdots i');
let gIdx = -1;
function updateGallery(r, mx, my) {
  const n = gphones.length, fan = ramp(r, -.6, .25);            // stack -> row
  const pos = clamp((r - .25) / 1.9) * (n - 1);                 // which screen is in focus
  const W = innerWidth, gap = isMobile ? W * .6 : Math.min(300, W * .2);
  gphones.forEach((ph, i) => {
    const d = i - pos, ad = Math.abs(d);
    const x = lerp((i - (n - 1) / 2) * 14, d * gap, fan);
    const y = lerp(40 + i * 6, ad * ad * 14, fan);
    const rz = lerp((i - (n - 1) / 2) * 5, d * 2.5, fan), ry = lerp(0, clamp(-d * 22, -40, 40), fan);
    const sc = lerp(.82, 1.08 - Math.min(ad, 2) * .14, fan);
    ph.style.transform = `translate3d(calc(-50% + ${x + mx * (8 + ad * 6)}px), calc(-50% + ${y + my * 6}px), ${-ad * 120 * fan}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`;
    ph.style.zIndex = 100 - Math.round(ad * 10);
    ph.style.filter = `brightness(${1 - Math.min(ad, 2) * .28 * fan})`;
  });
  const idx = Math.round(pos);
  if (idx !== gIdx) {
    gIdx = idx; const g = T('gallery')[idx];
    $('#gcapN').textContent = `${String(idx + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
    $('#gcapT').textContent = g[0]; $('#gcapD').textContent = g[1];
    gdots.forEach((dt, i) => dt.classList.toggle('on', i === idx));
    if (window.gsap) gsap.fromTo('#gcap > div:nth-child(2)', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'power3.out' });
  }
  $('.app-bgword').style.transform = `translate3d(${(.5 - clamp(r / 2.4)) * 30}%,-50%,0)`;
}

/* =========================================================
   Header: sliding pill, flags toggle, live scoreboard, auto-hide
   ========================================================= */
const nav = $('#nav'), links = $('#links'), linkPill = $('#linkPill'), langBox = $('.lang');
function movePill(a) {
  if (!a) { linkPill.style.opacity = 0; return; }
  const lb = links.getBoundingClientRect(), b = a.getBoundingClientRect();
  linkPill.style.opacity = 1; linkPill.style.width = b.width + 'px'; linkPill.style.transform = `translateX(${b.left - lb.left}px)`;
}
let activeLink = null;
$$('.links a').forEach(a => { a.addEventListener('pointerenter', () => movePill(a)); });
links.addEventListener('pointerleave', () => movePill(activeLink));
function placeLangPill() {
  const on = langBox.querySelector('button.on'); if (!on) return;
  langBox.style.setProperty('--lw', on.offsetWidth + 'px'); langBox.style.setProperty('--lx', (on.offsetLeft - 3) + 'px');
}
// Games are Monday and Wednesday at 20:00. Voting opens 22:30 that night and closes 20:00 the next day.
function liveStatus(now = new Date()) {
  const day = now.getDay(), t = now.getHours() * 60 + now.getMinutes();
  const at = (d, h, m) => { const x = new Date(now); x.setDate(now.getDate() + d); x.setHours(h, m, 0, 0); return x; };
  const openWindow = (day === 1 || day === 3) && t >= 22 * 60 + 30 ? at(1, 20, 0) : (day === 2 || day === 4) && t < 20 * 60 ? at(0, 20, 0) : null;
  if (openWindow) return { open: true, target: openWindow };
  for (let d = 0; d < 8; d++) { const x = at(d, 20, 0), wd = x.getDay(); if ((wd === 1 || wd === 3) && x > now) return { open: false, target: x }; }
  return { open: false, target: at(1, 20, 0) };
}
function tickLive() {
  const st = liveStatus(), ms = Math.max(0, st.target - new Date());
  const h = Math.floor(ms / 3.6e6), m = Math.floor(ms / 6e4) % 60, sec = Math.floor(ms / 1e3) % 60, p2 = n => String(n).padStart(2, '0');
  $('#live').classList.toggle('open', st.open);
  $('#liveLabel').textContent = st.open ? T('live').open : T('live').next;
  $('#liveTime').textContent = h >= 48 ? `${Math.floor(h / 24)}d ${p2(h % 24)}h` : `${p2(h)}:${p2(m)}:${p2(sec)}`;
}
setInterval(tickLive, 1000);
let lastY = 0;
function autoHide() {
  const y = scrollY, down = y > lastY + 4, up = y < lastY - 4;
  if (down && y > innerHeight * .6) nav.classList.add('hide'); else if (up || y < 80) nav.classList.remove('hide');
  if (Math.abs(y - lastY) > 4) lastY = y;
}

/* =========================================================
   Loop
   ========================================================= */
const intro = { bg: 1, floats: 0 };
const heroImg = $('.hero-bg img'), floats = $$('.float');
const charsImg = $('.chars-img img'), duelImg = $('.duel-img img'), finalImg = $('.final-bg img'), share = $('#share');
let lenis = null, last = performance.now(), time = 0, mqX = 0, prevY = 0, skew = 0;
const wm = $$('#wordmark span');
const progEl = $('#progress'), navLinks = $$('.links a'), navIds = ['how', 'app', 'chars', 'medals', 'draw'];

function frame(now) {
  const dt = Math.min((now - last) / 1000, 1 / 20); last = now; time += dt;
  if (lenis) lenis.raf(now);
  const s = scrollY / innerHeight, maxS = (document.documentElement.scrollHeight - innerHeight) / innerHeight;
  mouse.sx = damp(mouse.sx, mouse.x, 3, dt); mouse.sy = damp(mouse.sy, mouse.y, 3, dt);
  const mx = mouse.sx, my = mouse.sy, fl = reduceMotion ? 0 : 1;

  { const r = s - SEC.hero.top;
    if (r < 1.4) {
      const e = ramp(r, 0, 1.2);
      heroImg.style.transform = `translate3d(${-mx * 14}px,${-my * 8 + e * 60}px,0) scale(${1.04 + .12 * intro.bg + .1 * e})`;
      heroImg.style.filter = `brightness(${1 - e * .45})${intro.bg > .01 ? ` blur(${intro.bg * 10}px)` : ''}`;
      floats.forEach((f, i) => {
        const d = +f.dataset.depth, k = clamp(intro.floats * 1.6 - i * .18), kk = 1 - Math.pow(1 - k, 3);
        f.style.opacity = kk * (1 - ramp(r, .25, .7));
        f.style.transform = `translate3d(${mx * 18 * d}px,${my * 12 * d + (1 - kk) * 40 - e * 140 * d + Math.sin(time * .9 + i * 1.7) * 6 * fl}px,0)`;
      });
      updateHotspots(e);
    } }

  { const mw = marquee.scrollWidth / 2; mqX -= dt * 50 * fl; if (mw) { const x = ((mqX - scrollY * .25) % mw + mw) % mw; marquee.style.transform = `translate3d(${-x}px,0,0)`; } }

  { const r = s - SEC.how.top;
    if (r > -1 && r < SEC.how.h) {
      updateHow(clamp(r, 0, 2.85));
      phone.style.transform = `perspective(1400px) rotateY(${mx * -7}deg) rotateX(${my * 5}deg) translateY(${Math.sin(time * .8) * 6 * fl}px)`;
      $('#howNote').style.transform = `translate3d(${mx * -20}px,${my * -14}px,0)`;
    } }

  { const r = s - SEC.app.top; if (r > -1.2 && r < SEC.app.h) updateGallery(r, mx, my); }

  { const r = s - SEC.chars.top;
    if (r > -1.2 && r < SEC.chars.h) { charsImg.style.transform = `translate3d(${-mx * 10}px,${r * 90}px,0) scale(${1.08 - ramp(r, -1, .6) * .06})`; updateRail(dt); } }

  { const r = s - SEC.duel.top;
    if (r > -1 && r < SEC.duel.h) {
      duelImg.style.transform = `translate3d(${-mx * 12}px,${-my * 8}px,0) scale(${1.12 - ramp(r, -.6, .8) * .1})`;
      $('#ptsGood').textContent = Math.round(ramp(r, .15, .8) * 11);
      $('#votesBad').textContent = Math.round(ramp(r, .2, .85) * 7);
      vbars.forEach((b, i) => { b.style.width = ramp(r, .25 + i * .08, .9) * BAD_VOTES[i][1] / 7 * 100 + '%'; });
    } }

  { const r = s - SEC.medals.top; if (r > -1.2 && r < SEC.medals.h) updateMedals(r); }
  
  { const r = s - SEC.resenha.top;
    if (r > -1 && r < SEC.resenha.h) {
      $('.res-glow').style.transform = `translate3d(${mx * 30}px,${my * 20}px,0) scale(${1 + Math.sin(time * .8) * .04})`;
      [...notifs.children].forEach((n, i) => n.classList.toggle('in', r > .1 + i * .22 && r < 1.05));
      const k = ramp(r, -.3, .35), out = ramp(r, .85, 1.1);
      share.style.transform = `perspective(1400px) translate3d(0,${(1 - k) * 140 - out * 60 + Math.sin(time) * 6 * fl}px,0) rotateY(${lerp(-24, -10, k) + mx * 8}deg) rotateX(${my * -5}deg) rotateZ(${lerp(6, 2, k)}deg)`;
      share.style.opacity = k * (1 - out);
    } }
  { const r = s - SEC.final.top; if (r > -1.2) finalImg.style.transform = `translate3d(${-mx * 10}px,${r * 60}px,0) scale(1.1)`; }

  /* characters image opens from a rounded window */
  { const r = s - SEC.chars.top, p = ramp(r, -1.05, -.15);
    $('.chars-img').style.clipPath = `inset(${lerp(isMobile ? 6 : 10, 0, p)}% ${lerp(isMobile ? 4 : 14, 0, p)}% ${lerp(10, 0, p)}% ${lerp(isMobile ? 4 : 14, 0, p)}% round ${lerp(40, 0, p)}px)`; }
  /* wordmark rises letter by letter */
  { const r = s - SEC.final.top; wm.forEach((l, i) => { l.style.transform = `translate3d(0,${(1 - smooth(clamp(ramp(r, -.6, .05) * 1.6 - i * .08))) * 105}%,0)`; }); }
  /* marquee leans with scroll speed */
  { const v = scrollY - prevY; prevY = scrollY; skew = damp(skew, clamp(v * -.15, -12, 12), 6, dt); marquee.parentElement.style.transform = `skewX(${skew}deg)`; }
  autoHide();
  updateDrawFlow(dt);
  /* medal reveal follows the hand */
  rf.x = damp(rf.x, mouse.px, 10, dt); rf.y = damp(rf.y, mouse.py, 10, dt);
  revealFloat.style.transform = `translate3d(${rf.x - 140}px,${rf.y - 100}px,0) rotate(${(mouse.px - rf.x) * .05}deg)`;
  /* side rail */
  { let k = 0; RAIL_IDS.forEach((id, i) => { if (SEC[id] && s >= SEC[id].top - .4) k = i; });
    $('#srN').textContent = String(k + 1).padStart(2, '0'); $('#srT').textContent = T('rail')[k];
    $('#srBar').style.transform = `scaleY(${clamp(s / maxS)})`; $('.siderail').classList.toggle('on', s > .6 && s < maxS - .3); }

  updateShows(s);
  progEl.style.transform = `scaleX(${clamp(s / maxS)})`;
  { let act = null; navLinks.forEach((a, i) => { const S = SEC[navIds[i]], on = s >= S.top - .5 && s < S.top + S.h - .5; a.classList.toggle('on', on); if (on) act = a; });
    if (act !== activeLink) { activeLink = act; if (!links.matches(':hover')) movePill(act); } }
  if (hoverDevice) {
    ringPos.x = damp(ringPos.x, mouse.px, 14, dt); ringPos.y = damp(ringPos.y, mouse.py, 14, dt);
    cDot.style.transform = `translate3d(${mouse.px}px,${mouse.py}px,0)`; cRing.style.transform = `translate3d(${ringPos.x}px,${ringPos.y}px,0)`;
    if (TAG) {
      const px = tagPos.x; tagPos.x = damp(tagPos.x, mouse.px, 16, dt); tagPos.y = damp(tagPos.y, mouse.py, 16, dt);
      tagPos.r = reduceMotion ? 0 : damp(tagPos.r, clamp((tagPos.x - px) * 1.4, -14, 14), 10, dt);
      cArrow.style.transform = `translate3d(${mouse.px}px,${mouse.py}px,0)`;
      cTag.style.transform = `translate3d(${tagPos.x + 16}px,${tagPos.y + 22}px,0) rotate(${tagPos.r}deg)`;
    }
  }
  requestAnimationFrame(frame);
}

/* =========================================================
   Boot
   ========================================================= */
if (new URLSearchParams(location.search).get('hero') === 'antigo') { document.body.classList.add('hero-old'); const hi = $('.hero-bg img'); hi.removeAttribute('srcset'); hi.src = 'img/pitch-1440.webp'; }
hydrateIcons();
applyLang(lang, false);
addEventListener('resize', () => { isMobile = innerWidth <= 760; measure(); placeLangPill(); movePill(activeLink); });
tickLive();
measure();
requestAnimationFrame(frame);

function onReady(fn) { if (window.gsap) fn(); else addEventListener('load', fn); }
onReady(async () => {
  history.scrollRestoration = 'manual'; scrollTo(0, 0);
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ lerp: .09, smoothWheel: true });
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', ev => {
      ev.preventDefault(); const id = a.getAttribute('href').slice(1), S = SEC[id];
      const extra = { how: .3, app: .4, chars: .15, medals: -.1, draw: -.05 }[id] || 0;
      lenis.scrollTo((S.top + extra) * innerHeight, { duration: 2, easing: x => 1 - Math.pow(1 - x, 4) });
    }));
  }
  magnets();
  // Loader: a real photo pair (lights off / lights on). Each tower's light is revealed
  // through a growing radial mask with a short flicker, until the whole pitch is lit.
  const loader = $('#loader'), cv = $('#ldCanvas'), cx = cv.getContext('2d');
  const OFF = new Image(), ON = new Image(); OFF.src = 'img/lights-off.webp'; ON.src = 'img/lights-on.webp';
  const mk = document.createElement('canvas'), mx2 = mk.getContext('2d');
  const TOWERS = [[.10, .19, .62, 0], [.905, .185, .62, 16], [.28, .49, .4, 34], [.72, .49, .4, 50]]; // x, y, reach (of width), start %
  const pw = TOWERS.map(() => 0);
  let shown = 0;
  const imgsReady = Promise.all([OFF, ON].map(i => i.decode().catch(() => {})));
  const drawLights = v => {
    if (!OFF.naturalWidth || !ON.naturalWidth) return;
    const W = 1166, H = 650; // render a bit under source size: the mask is soft anyway
    if (cv.width !== W) { cv.width = W; cv.height = H; mk.width = W; mk.height = H; }
    cx.drawImage(OFF, 0, 0, W, H);
    mx2.globalCompositeOperation = 'source-over'; mx2.clearRect(0, 0, W, H); mx2.globalCompositeOperation = 'lighter';
    TOWERS.forEach(([x, y, reach, st], i) => {
      const local = clamp((v - st) / 40);
      // flicker while the lamp warms up
      const fl = local > 0 && local < .3 && !reduceMotion ? (Math.random() < .35 ? .15 : 1) : 1;
      pw[i] = local * fl;
      if (pw[i] <= 0) return;
      const R = W * reach * (.15 + .85 * smooth(local)), a = Math.min(1, pw[i] * 1.2);
      const g = mx2.createRadialGradient(x * W, y * H, 0, x * W, y * H + R * .35, R);
      g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(.35, `rgba(0,0,0,${a * .8})`); g.addColorStop(1, 'rgba(0,0,0,0)');
      mx2.fillStyle = g; mx2.fillRect(0, 0, W, H);
    });
    const all = smooth(clamp((v - 82) / 18));
    if (all > 0) { mx2.fillStyle = `rgba(0,0,0,${all})`; mx2.fillRect(0, 0, W, H); }
    mx2.globalCompositeOperation = 'source-in'; mx2.drawImage(ON, 0, 0, W, H);
    cx.drawImage(mk, 0, 0);
    loader.style.setProperty('--lv', (v / 100).toFixed(3));
  };
  const setLights = v => { $('#count').textContent = Math.round(v); $('#loadbar').style.width = v + '%'; drawLights(v); };
  await imgsReady; setLights(0); loader.classList.add('lit');
  const jobs = [document.fonts.ready, heroImg.decode().catch(() => {}), ...['img/logo.webp', 'img/badges/lenda-do-baba.webp'].map(src => new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = src; }))];
  let done = 0; jobs.forEach(j => j.then(() => done++));
  const minDur = reduceMotion ? 300 : 3400, t0 = performance.now();
  let lastT = performance.now();
  await new Promise(res => {
    const step = () => {
      const nowT = performance.now(), dtL = Math.min(.1, (nowT - lastT) / 1000); lastT = nowT;
      const timeP = clamp((performance.now() - t0) / minDur), loadP = done / jobs.length;
      const target = Math.min(timeP, loadP === 1 ? 1 : loadP * .95) * 100;
      shown = damp(shown, target, 7, dtL); if (target >= 100 && (shown > 99.3 || nowT - t0 > minDur + 900)) shown = 100;
      setLights(shown);
      if (shown >= 100) res(); else requestAnimationFrame(step);
    };
    step();
  });
  measure();
  gsap.timeline()
    .to('.ld-flash', { opacity: .85, duration: .12, ease: 'power2.out' })
    .add(() => document.body.classList.remove('loading'))
    .to('.ld-flash', { opacity: 0, duration: .7, ease: 'power2.out' })
    .to('#loader', { opacity: 0, duration: .8, ease: 'power2.inOut' }, '<')
    .set('#loader', { display: 'none' })
    .to(intro, { bg: 0, duration: 2.2, ease: 'expo.out' }, .15)
    .from('.cap', { y: -30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1, onComplete: placeLangPill }, .3)
    .from('.hero-copy > *', { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .09, clearProps: 'opacity,transform' }, .35)
    .to(intro, { floats: 1, duration: 1.6, ease: 'power2.out' }, .9)
    .add(() => { $('#hotspots').classList.add('hint'); setTimeout(() => $('#hotspots').classList.remove('hint'), 3200); }, 1.2);
});

window.__cnl = { SEC, go: v => lenis ? lenis.scrollTo(v * innerHeight, { immediate: true }) : scrollTo(0, v * innerHeight), lang: l => applyLang(l, false) };
