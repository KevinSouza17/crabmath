import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Compass,
  Crown,
  Flame,
  Heart,
  Home as HomeIcon,
  Layers3,
  LockKeyhole,
  Medal,
  Menu,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Trophy,
  UserRound,
  X,
  Zap,
} from "lucide-react";

type Tab = "home" | "path" | "profile";
type LessonId = "numbers" | "fractions" | "equations" | "functions" | "geometry" | "calculus" | "linear" | "probability";

type Lesson = {
  id: LessonId;
  number: string;
  title: string;
  subtitle: string;
  unit: string;
  tone: "lime" | "orange" | "blue" | "violet";
  icon: typeof BookOpen;
  status: "done" | "current" | "locked";
};

const lessons: Lesson[] = [
  { id: "numbers", number: "01", title: "Números e operações", subtitle: "A base de tudo", unit: "Fundamentos", tone: "lime", icon: Layers3, status: "done" },
  { id: "fractions", number: "02", title: "Frações sem medo", subtitle: "Partes que contam", unit: "Fundamentos", tone: "orange", icon: BookOpen, status: "current" },
  { id: "equations", number: "03", title: "Equações de 1º grau", subtitle: "Descubra o x", unit: "Álgebra", tone: "blue", icon: BarChart3, status: "locked" },
  { id: "functions", number: "04", title: "Funções na prática", subtitle: "Veja as relações", unit: "Álgebra", tone: "violet", icon: Compass, status: "locked" },
  { id: "geometry", number: "05", title: "Geometria que se vê", subtitle: "Formas, áreas e espaço", unit: "Geometria", tone: "orange", icon: Target, status: "locked" },
  { id: "calculus", number: "06", title: "Limites e derivadas", subtitle: "A ponte para o superior", unit: "Cálculo", tone: "blue", icon: Sparkles, status: "locked" },
  { id: "linear", number: "07", title: "Álgebra linear", subtitle: "Vetores e transformações", unit: "Ensino superior", tone: "violet", icon: Layers3, status: "locked" },
  { id: "probability", number: "08", title: "Probabilidade e dados", subtitle: "Decida com evidências", unit: "Ensino superior", tone: "lime", icon: BarChart3, status: "locked" },
];

const exercises = [
  {
    question: "Qual fração representa a parte pintada?",
    hint: "Observe as 4 partes iguais do círculo.",
    visual: "fraction",
    options: ["1/2", "3/4", "2/3", "1/4"],
    answer: "3/4",
    explanation: "Boa! 3 de 4 partes estão pintadas, então a fração é 3/4.",
  },
  {
    question: "Quanto é 1/2 + 1/4?",
    hint: "Transforme as duas frações para o mesmo denominador.",
    visual: "sum",
    options: ["2/6", "3/4", "1/6", "2/4"],
    answer: "3/4",
    explanation: "Isso! 1/2 vale 2/4. Somando 2/4 + 1/4 = 3/4.",
  },
  {
    question: "Qual é maior?",
    hint: "Compare as partes do mesmo inteiro.",
    visual: "compare",
    options: ["2/5", "1/2", "São iguais", "Não dá para saber"],
    answer: "1/2",
    explanation: "Perfeito! 1/2 = 0,5 e 2/5 = 0,4. Metade é maior.",
  },
];

const exerciseSets: Record<LessonId, typeof exercises> = {
  numbers: [
    { question: "Qual é o resultado de 8 + 7?", hint: "Conte a partir do 8 mais sete passos.", visual: "sum", options: ["14", "15", "16", "17"], answer: "15", explanation: "Isso! 8 + 7 = 15." },
    { question: "Qual número completa a sequência: 2, 4, 6, __?", hint: "A sequência aumenta sempre do mesmo jeito.", visual: "compare", options: ["7", "8", "9", "10"], answer: "8", explanation: "Perfeito! A sequência soma 2 a cada passo." },
    { question: "Quanto é 3 × 4?", hint: "Pense em 3 grupos com 4 elementos.", visual: "sum", options: ["7", "10", "12", "14"], answer: "12", explanation: "Mandou bem! 3 grupos de 4 formam 12." },
  ],
  fractions: exercises,
  equations: [
    { question: "Se x + 5 = 12, quanto vale x?", hint: "Isole o x desfazendo a soma.", visual: "sum", options: ["5", "6", "7", "8"], answer: "7", explanation: "Isso! x = 12 − 5, então x = 7." },
    { question: "Qual expressão representa o dobro de um número?", hint: "Use x para representar o número.", visual: "compare", options: ["x + 2", "2x", "x/2", "x − 2"], answer: "2x", explanation: "O dobro é duas vezes o número: 2x." },
    { question: "Resolva: 2x = 18.", hint: "Divida os dois lados por 2.", visual: "sum", options: ["6", "8", "9", "12"], answer: "9", explanation: "Perfeito! 18 dividido por 2 é 9." },
  ],
  functions: [
    { question: "Na função f(x) = x + 3, quanto é f(2)?", hint: "Troque x por 2 na expressão.", visual: "sum", options: ["3", "4", "5", "6"], answer: "5", explanation: "f(2) = 2 + 3 = 5." },
    { question: "Uma função relaciona...", hint: "Pense em entrada e saída.", visual: "compare", options: ["duas grandezas", "só números pares", "apenas formas", "nenhuma variável"], answer: "duas grandezas", explanation: "Uma função descreve uma relação entre grandezas." },
    { question: "Qual ponto pertence a y = x?", hint: "Escolha o par com coordenadas iguais.", visual: "compare", options: ["(1, 2)", "(2, 1)", "(3, 3)", "(0, 4)"], answer: "(3, 3)", explanation: "Quando y = x, as coordenadas têm o mesmo valor." },
  ],
  geometry: [
    { question: "Qual é a área de um quadrado de lado 4?", hint: "Área do quadrado = lado × lado.", visual: "sum", options: ["8", "12", "16", "20"], answer: "16", explanation: "4 × 4 = 16 unidades quadradas." },
    { question: "Quantos graus tem um ângulo reto?", hint: "É o canto de uma folha de papel.", visual: "compare", options: ["45°", "90°", "180°", "360°"], answer: "90°", explanation: "Um ângulo reto mede exatamente 90°." },
    { question: "Qual figura tem 3 lados?", hint: "O nome lembra o número de lados.", visual: "compare", options: ["Quadrado", "Círculo", "Triângulo", "Pentágono"], answer: "Triângulo", explanation: "O triângulo tem três lados e três vértices." },
  ],
  calculus: [
    { question: "Qual é a derivada de x²?", hint: "Use a regra da potência.", visual: "sum", options: ["x", "2x", "x²", "2"], answer: "2x", explanation: "Pela regra da potência, a derivada de x² é 2x." },
    { question: "O que um limite descreve?", hint: "Observe para onde uma função se aproxima.", visual: "compare", options: ["Uma aproximação", "Uma soma exata", "Uma figura", "Um conjunto vazio"], answer: "Uma aproximação", explanation: "O limite descreve o valor para o qual a função tende." },
    { question: "A integral pode representar...", hint: "Pense na área acumulada.", visual: "compare", options: ["Uma área", "Só um ponto", "Uma raiz", "Um ângulo"], answer: "Uma área", explanation: "A integral acumula pequenas áreas sob uma curva." },
  ],
  linear: [
    { question: "Um vetor pode ser entendido como...", hint: "Pense em direção e sentido.", visual: "compare", options: ["Uma direção com tamanho", "Só um número", "Uma função", "Um ângulo isolado"], answer: "Uma direção com tamanho", explanation: "Vetores carregam magnitude e direção." },
    { question: "Quanto é 2 · (3, 4)?", hint: "Multiplique cada componente por 2.", visual: "sum", options: ["(5, 6)", "(6, 8)", "(2, 4)", "(3, 8)"], answer: "(6, 8)", explanation: "A multiplicação escalar dobra cada componente." },
    { question: "Uma matriz é organizada em...", hint: "Observe como uma tabela é estruturada.", visual: "compare", options: ["Linhas e colunas", "Ângulos", "Derivadas", "Frações"], answer: "Linhas e colunas", explanation: "Matrizes organizam valores em linhas e colunas." },
  ],
  probability: [
    { question: "Ao lançar uma moeda justa, a chance de cara é...", hint: "Há dois resultados igualmente prováveis.", visual: "compare", options: ["0%", "25%", "50%", "100%"], answer: "50%", explanation: "Uma entre duas possibilidades dá 1/2, ou 50%." },
    { question: "A média de 2, 4 e 6 é...", hint: "Some tudo e divida pela quantidade.", visual: "sum", options: ["3", "4", "5", "6"], answer: "4", explanation: "(2 + 4 + 6) ÷ 3 = 4." },
    { question: "Um gráfico ajuda a...", hint: "Pense em como dados ficam visíveis.", visual: "compare", options: ["Encontrar padrões", "Apagar dados", "Evitar perguntas", "Trocar unidades"], answer: "Encontrar padrões", explanation: "Visualizações tornam padrões e comparações mais claros." },
  ],
};

const badges = [
  { icon: "🦀", title: "Primeiro passo", copy: "Começou sua jornada" },
  { icon: "🔥", title: "Fogo no estudo", copy: "5 dias seguidos" },
  { icon: "🧠", title: "Mente afiada", copy: "10 exercícios certos" },
  { icon: "🌊", title: "Maré alta", copy: "100 XP conquistados" },
];

const curriculumUnits: { title: string; subtitle: string; unlockAfter: LessonId | null }[] = [
  { title: "Fundamentos", subtitle: "A base para pensar matematicamente", unlockAfter: null },
  { title: "Álgebra", subtitle: "Padrões, incógnitas e relações", unlockAfter: "fractions" },
  { title: "Geometria", subtitle: "Formas, áreas e espaço", unlockAfter: "functions" },
  { title: "Cálculo", subtitle: "Mudança, limites e movimento", unlockAfter: "geometry" },
  { title: "Ensino superior", subtitle: "Ferramentas para ir mais longe", unlockAfter: "calculus" },
];

function Crab({ mood = "happy", size = "md" }: { mood?: "happy" | "thinking" | "celebrate"; size?: "sm" | "md" | "lg" }) {
  return (
    <div className={`crab crab-${size} crab-${mood}`} aria-label="Caranguejo mascote do CrabMath" role="img">
      <div className="crab-spark crab-spark-one">✦</div>
      <div className="crab-spark crab-spark-two">•</div>
      <div className="crab-body">
        <div className="crab-eyes"><span /><span /></div>
        <div className="crab-smile">⌣</div>
      </div>
      <div className="crab-claw crab-claw-left">◖</div>
      <div className="crab-claw crab-claw-right">◗</div>
      <div className="crab-legs"><i /><i /><i /><i /></div>
    </div>
  );
}

function ProgressBar({ value, tone = "lime" }: { value: number; tone?: "lime" | "orange" | "blue" }) {
  return <div className={`progress-track progress-${tone}`}><div className="progress-fill" style={{ width: `${value}%` }} /></div>;
}

function Metric({ icon: Icon, value, label, tone }: { icon: typeof Flame; value: string; label: string; tone: string }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon metric-${tone}`}><Icon size={17} strokeWidth={2.6} /></div>
      <div><strong>{value}</strong><span>{label}</span></div>
    </div>
  );
}

function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [completed, setCompleted] = useState<LessonId[]>(() => {
    try { return JSON.parse(localStorage.getItem("crabmath-completed") ?? "[\"numbers\"]"); } catch { return ["numbers"]; }
  });
  const [xp, setXp] = useState(() => Number(localStorage.getItem("crabmath-xp") ?? 840));
  const [activeLesson, setActiveLesson] = useState<LessonId | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem("crabmath-completed", JSON.stringify(completed)); }, [completed]);
  useEffect(() => { localStorage.setItem("crabmath-xp", String(xp)); }, [xp]);

  const isLessonUnlocked = (lessonId: LessonId) => {
    const index = lessons.findIndex((lesson) => lesson.id === lessonId);
    return index === 0 || completed.includes(lessons[index - 1].id);
  };
  const currentLesson = useMemo(() => lessons.find((lesson) => !completed.includes(lesson.id) && isLessonUnlocked(lesson.id)) ?? lessons[lessons.length - 1], [completed]);
  const level = Math.floor(xp / 250) + 1;
  const levelProgress = xp % 250;
  const activeLessonData = activeLesson ? lessons.find((lesson) => lesson.id === activeLesson) : null;
  const activeExercises = activeLesson ? exerciseSets[activeLesson] : exercises;
  const activeExercise = activeExercises[questionIndex] ?? activeExercises[0];
  const isLastQuestion = questionIndex === activeExercises.length - 1;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  };

  const startLesson = (lessonId: LessonId) => {
    const lesson = lessons.find((item) => item.id === lessonId);
    if (!lesson || !isLessonUnlocked(lesson.id)) {
      showToast("Complete a etapa anterior para abrir esta aventura.");
      return;
    }
    setActiveLesson(lessonId);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setChecked(false);
  };

  const closeLesson = () => {
    setActiveLesson(null);
    setSelectedAnswer(null);
    setChecked(false);
  };

  const checkAnswer = () => {
    if (!selectedAnswer) return;
    setChecked(true);
  };

  const nextQuestion = () => {
    if (!isLastQuestion) {
      setQuestionIndex((index) => index + 1);
      setSelectedAnswer(null);
      setChecked(false);
      return;
    }
    if (activeLesson && !completed.includes(activeLesson)) setCompleted((items) => [...items, activeLesson]);
    setXp((value) => value + 35);
    closeLesson();
    showToast("+35 XP! Você mandou muito bem.");
  };

  const selectTab = (nextTab: Tab) => {
    setTab(nextTab);
    setMobileMenu(false);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand-lockup" onClick={() => selectTab("home")} role="button" tabIndex={0}>
          <div className="brand-mark"><span>✦</span><span>✦</span><Crab size="sm" /></div>
          <div><strong>crab<span>math</span></strong><small>aprenda no seu ritmo</small></div>
        </div>
        <button className="sidebar-close" onClick={() => setMobileMenu(false)} aria-label="Fechar menu"><X size={19} /></button>
        <nav className="primary-nav" aria-label="Navegação principal">
          <button className={tab === "home" ? "nav-active" : ""} onClick={() => selectTab("home")}><HomeIcon size={19} />Início</button>
          <button className={tab === "path" ? "nav-active" : ""} onClick={() => selectTab("path")}><Compass size={19} />Minha trilha</button>
          <button onClick={() => showToast("Ranking entre amigos em breve!")}><Trophy size={19} />Ranking <span className="nav-soon">em breve</span></button>
          <button onClick={() => showToast("A lojinha do caranguejo está chegando.")}><Sparkles size={19} />Lojinha <span className="nav-soon">em breve</span></button>
        </nav>
        <div className="sidebar-progress">
          <div className="mini-label"><span>Seu nível</span><strong>Nível {level}</strong></div>
          <ProgressBar value={(levelProgress / 250) * 100} tone="lime" />
          <div className="mini-meta"><span>{levelProgress} / 250 XP</span><span>próximo nível</span></div>
        </div>
        <div className="sidebar-footer">
          <button className={tab === "profile" ? "profile-link nav-active" : "profile-link"} onClick={() => selectTab("profile")}>
            <div className="avatar">LM</div><div><strong>Larissa M.</strong><span>ver perfil</span></div><ChevronRight size={16} />
          </button>
          <div className="sidebar-note"><Crab size="sm" mood="thinking" /><p>Um pouquinho por dia<br /><strong>faz toda a diferença.</strong></p></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu-button" onClick={() => setMobileMenu(true)} aria-label="Abrir menu"><Menu size={22} /></button>
          <div className="breadcrumb"><span>Matemática</span><ChevronRight size={14} /><strong>{tab === "home" ? "Visão geral" : tab === "path" ? "Minha trilha" : "Meu perfil"}</strong></div>
          <div className="top-actions"><button className="help-button" onClick={() => showToast("Dica: estudar 10 minutos por dia já cria uma ótima sequência!")}><CircleHelp size={18} /></button><div className="top-avatar">LM</div></div>
        </header>

        {tab === "home" && (
          <div className="page-content home-page">
            <section className="welcome-row">
              <div><p className="eyebrow">QUARTA, 4 NOV <span className="eyebrow-dot" /> CICLO 01</p><h1>Bom te ver, <em>Larissa.</em></h1><p className="subhead">Seu cérebro já aqueceu. Vamos dar mais um passo?</p></div>
              <div className="streak-pill"><Flame size={20} fill="currentColor" /><div><strong>6 dias</strong><span>de sequência</span></div></div>
            </section>

            <section className="hero-card">
              <div className="hero-copy"><div className="hero-tag"><span className="live-dot" /> TRILHA ATUAL</div><h2>Fundamentos da matemática</h2><p>Do zero ao “agora eu entendi”. Uma base forte muda tudo que vem depois.</p><button className="primary-button" onClick={() => startLesson(currentLesson.id)}>Continuar jornada <ChevronRight size={17} /></button><div className="hero-progress"><div><span>Progresso da trilha</span><strong>18%</strong></div><ProgressBar value={18} tone="lime" /></div></div>
              <div className="hero-art"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="hero-equation">1/2 + 1/4 = ?</span><div className="crab-bubble"><Crab size="lg" mood="celebrate" /></div><span className="hero-star star-one">✦</span><span className="hero-star star-two">✦</span><span className="hero-math">x²</span></div>
            </section>

            <section className="metrics-row"><Metric icon={Flame} value="6" label="dias seguidos" tone="coral" /><Metric icon={Zap} value={String(xp)} label="pontos de XP" tone="yellow" /><Metric icon={Heart} value="4/5" label="corações hoje" tone="pink" /><Metric icon={Target} value="7" label="meta diária" tone="teal" /></section>

            <div className="section-heading"><div><p className="eyebrow">SEU PRÓXIMO PASSO</p><h2>Continue de onde parou</h2></div><button className="text-button" onClick={() => selectTab("path")}>Ver trilha completa <ChevronRight size={15} /></button></div>
            <section className="continue-card" onClick={() => startLesson(currentLesson.id)} role="button" tabIndex={0}>
              <div className="lesson-index index-orange">{currentLesson.number}</div><div className="continue-info"><div className="lesson-kicker"><span className="status-dot" /> {currentLesson.unit.toUpperCase()} <span className="lesson-time"><Clock3 size={13} /> 5 min</span></div><h3>{currentLesson.title}</h3><p>{currentLesson.subtitle} — continue avançando no seu ritmo.</p><div className="lesson-progress-line"><ProgressBar value={64} tone="orange" /><span>64%</span></div></div><button className="round-play" aria-label="Começar lição"><Play size={18} fill="currentColor" /></button>
            </section>

            <div className="lower-grid"><section className="small-panel"><div className="panel-heading"><div><p className="eyebrow">CONQUISTAS</p><h3>Medalhas do dia</h3></div><button className="icon-button" onClick={() => selectTab("profile")}><ChevronRight size={17} /></button></div><div className="badge-row">{badges.slice(0, 3).map((badge) => <div className="badge-item" key={badge.title}><div className="badge-icon">{badge.icon}</div><strong>{badge.title}</strong><span>{badge.copy}</span></div>)}</div></section><section className="small-panel mascot-panel"><div className="mascot-copy"><p className="eyebrow">RECADO DO CARANGUEJO</p><h3>Você não precisa<br /><em>correr.</em> Só continuar.</h3><button className="text-button" onClick={() => startLesson(currentLesson.id)}>Fazer uma lição <ChevronRight size={15} /></button></div><Crab size="md" mood="thinking" /></section></div>
          </div>
        )}

        {tab === "path" && (
          <div className="page-content path-page">
            <section className="page-intro">
              <p className="eyebrow">MAPA DE APRENDIZAGEM</p>
              <h1>Sua trilha de <em>matemática.</em></h1>
              <p className="subhead">Cada etapa prepara você para a próxima. Sem atalhos confusos.</p>
              <div className="path-summary"><div><strong>{curriculumUnits.filter((unit) => unit.unlockAfter && completed.includes(unit.unlockAfter)).length}</strong><span>unidades abertas</span></div><div><strong>{Math.round((completed.length / lessons.length) * 100)}%</strong><span>da trilha concluída</span></div><div><strong>7</strong><span>dias de meta</span></div></div>
            </section>
            <div className="path-map">
              {curriculumUnits.map((unit, unitIndex) => {
                const unitLessons = lessons.filter((lesson) => lesson.unit === unit.title);
                const unitUnlocked = !unit.unlockAfter || completed.includes(unit.unlockAfter);
                const unitComplete = unitLessons.length > 0 && unitLessons.every((lesson) => completed.includes(lesson.id));
                return (
                  <section className={`unit-block ${!unitUnlocked ? "unit-locked" : ""}`} key={unit.title}>
                    <div className="unit-header">
                      <div className="unit-number">0{unitIndex + 1}</div>
                      <div><p className="eyebrow">UNIDADE {unitIndex + 1}</p><h2>{unit.title}</h2><span>{unit.subtitle}</span></div>
                      <div className="unit-status">{unitComplete ? <><Check size={15} /> concluída</> : unitUnlocked ? <><Zap size={15} /> disponível</> : <><LockKeyhole size={15} /> bloqueada</>}</div>
                    </div>
                    <div className="lesson-path">
                      {unitLessons.map((lesson) => {
                        const Icon = lesson.icon;
                        const isDone = completed.includes(lesson.id);
                        const isLocked = !unitUnlocked || !isLessonUnlocked(lesson.id);
                        return <button className={`path-lesson ${isDone ? "path-done" : ""} ${isLocked ? "path-locked" : ""}`} key={lesson.id} onClick={() => startLesson(lesson.id)} disabled={isLocked}><div className={`path-icon tone-${lesson.tone}`}>{isDone ? <Check size={18} /> : isLocked ? <LockKeyhole size={16} /> : <Icon size={18} />}</div><div><strong>{lesson.title}</strong><span>{lesson.subtitle}</span></div><ChevronRight size={17} /></button>;
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {tab === "profile" && (
          <div className="page-content profile-page"><section className="profile-hero"><div className="profile-avatar-large">LM<span className="online-dot" /></div><div><p className="eyebrow">ESTUDANTE DESDE NOV 2026</p><h1>Larissa <em>Marques.</em></h1><p className="subhead">Exploradora de ideias • Nível {level}</p></div><button className="secondary-button" onClick={() => showToast("Perfil personalizado em breve!")}>Editar perfil</button></section><div className="profile-grid"><section className="profile-stat-panel"><div className="panel-heading"><div><p className="eyebrow">VISÃO GERAL</p><h3>Seu ritmo</h3></div><BarChart3 size={22} /></div><div className="big-stat-grid"><div><strong>{xp}</strong><span>XP total</span></div><div><strong>6</strong><span>maior sequência</span></div><div><strong>87%</strong><span>precisão média</span></div><div><strong>{completed.length}</strong><span>lições feitas</span></div></div><div className="level-card"><div className="level-badge"><Crown size={19} /></div><div><span>NÍVEL {level}</span><strong>Curiosa constante</strong><ProgressBar value={(levelProgress / 250) * 100} tone="lime" /></div><b>{250 - levelProgress} XP</b></div></section><section className="profile-stat-panel"><div className="panel-heading"><div><p className="eyebrow">COLEÇÃO</p><h3>Suas medalhas</h3></div><Medal size={22} /></div><div className="badge-collection">{badges.map((badge, index) => <div className={`collection-item ${index === 3 ? "collection-locked" : ""}`} key={badge.title}><div className="badge-icon">{index === 3 ? "?" : badge.icon}</div><div><strong>{index === 3 ? "Próxima medalha" : badge.title}</strong><span>{index === 3 ? "Complete a trilha" : badge.copy}</span></div></div>)}</div></section></div><section className="history-panel"><div className="panel-heading"><div><p className="eyebrow">HISTÓRICO RECENTE</p><h3>Você está construindo consistência</h3></div><RotateCcw size={20} /></div><div className="history-row"><div className="history-day"><strong>04</strong><span>nov</span></div><div><strong>Frações sem medo</strong><span>Fundamentos • 64% concluído</span></div><span className="history-xp">+35 XP</span><ChevronRight size={17} /></div><div className="history-row"><div className="history-day"><strong>03</strong><span>nov</span></div><div><strong>Números e operações</strong><span>Fundamentos • concluído</span></div><span className="history-xp">+35 XP</span><Check size={17} /></div></section></div>
        )}

        <footer className="site-footer"><span>crabmath <i>•</i> matemática que avança com você</span><span>feito para estudar um pouco todos os dias</span></footer>
      </main>

      <nav className="mobile-nav"><button className={tab === "home" ? "mobile-active" : ""} onClick={() => selectTab("home")}><HomeIcon size={19} /><span>Início</span></button><button className={tab === "path" ? "mobile-active" : ""} onClick={() => selectTab("path")}><Compass size={19} /><span>Trilha</span></button><button onClick={() => showToast("Ranking entre amigos em breve!")}><Trophy size={19} /><span>Ranking</span></button><button className={tab === "profile" ? "mobile-active" : ""} onClick={() => selectTab("profile")}><UserRound size={19} /><span>Perfil</span></button></nav>

      {activeLesson && <div className="lesson-overlay"><div className="lesson-modal"><header className="lesson-top"><button className="icon-button" onClick={closeLesson} aria-label="Fechar lição"><X size={20} /></button><div className="lesson-step"><span>LIÇÃO {activeLessonData?.number ?? "02"}</span><ProgressBar value={((questionIndex + (checked ? 1 : 0)) / activeExercises.length) * 100} tone="orange" /><b>{questionIndex + 1}/{activeExercises.length}</b></div><div className="lesson-hearts"><Heart size={17} fill="currentColor" /> 4</div></header><div className="lesson-content"><div className="lesson-guide"><Crab size="md" mood={checked && selectedAnswer === activeExercise.answer ? "celebrate" : "happy"} /><div><strong>{checked ? (selectedAnswer === activeExercise.answer ? "Mandou bem!" : "Quase lá...") : "Vamos pensar juntos."}</strong><span>{checked ? (selectedAnswer === activeExercise.answer ? "Seu raciocínio está ficando afiado." : "Errar também faz parte da aprendizagem.") : activeExercise.hint}</span></div></div><div className="exercise-card"><p className="exercise-count">DESAFIO {String(questionIndex + 1).padStart(2, "0")}</p><h1>{activeExercise.question}</h1>{activeExercise.visual === "fraction" && <div className="fraction-visual"><div className="fraction-circle"><i /><i /><i /><i /></div><span>4 partes iguais</span></div>}{activeExercise.visual === "sum" && <div className="sum-visual"><strong>½</strong><span>+</span><strong>¼</strong><span>=</span><b>?</b></div>}{activeExercise.visual === "compare" && <div className="compare-visual"><strong>2/5</strong><span>ou</span><strong>1/2</strong></div>}<div className="answer-grid">{activeExercise.options.map((option) => <button key={option} className={`answer-option ${selectedAnswer === option ? "answer-selected" : ""} ${checked && option === activeExercise.answer ? "answer-correct" : ""} ${checked && selectedAnswer === option && option !== activeExercise.answer ? "answer-wrong" : ""}`} onClick={() => !checked && setSelectedAnswer(option)}>{option}{checked && option === activeExercise.answer && <Check size={17} />}</button>)}</div>{checked && <div className={`explanation ${selectedAnswer === activeExercise.answer ? "explanation-good" : "explanation-retry"}`}><span>{selectedAnswer === activeExercise.answer ? "✦" : "↗"}</span><p>{selectedAnswer === activeExercise.answer ? activeExercise.explanation : `A resposta certa é ${activeExercise.answer}. ${activeExercise.explanation}`}</p></div>}</div><button className="lesson-action" disabled={!selectedAnswer} onClick={checked ? nextQuestion : checkAnswer}>{checked ? (isLastQuestion ? "Concluir lição" : "Próximo desafio") : "Conferir resposta"}<ChevronRight size={17} /></button></div></div></div>}
      {toast && <div className="toast"><Sparkles size={16} />{toast}</div>}
    </div>
  );
}

export default Home;
