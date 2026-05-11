export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#050058">
<title>Reserva Ativa App: CRM e IA para Hotéis-Fazenda</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --navy: #050058;
    --navy-light: #0a0080;
    --navy-mid: #080070;
    --gold: #D4AF37;
    --gold-light: #e8c84a;
    --gold-dim: rgba(212,175,55,0.15);
    --gold-border: rgba(212,175,55,0.3);
    --offwhite: #FAF9F6;
    --text-muted: rgba(250,249,246,0.6);
    --text-dim: rgba(250,249,246,0.4);
    --card-bg: rgba(255,255,255,0.04);
    --card-border: rgba(212,175,55,0.2);
  }

  * { margin:0; padding:0; box-sizing:border-box; }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Open Sans', sans-serif;
    background: var(--navy);
    color: var(--offwhite);
    overflow-x: hidden;
  }

  /* ─── NAV ─── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 60px;
    background: rgba(5,0,88,0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--gold-border);
    transition: padding 0.3s;
  }
  .nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 17px;
    letter-spacing: 0.08em;
    color: var(--offwhite);
    text-decoration: none;
  }
  .nav-logo .logo-mark { flex-shrink: 0; }
  .nav-logo span { color: var(--gold); }
  .nav-logo .app-tag {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
    color: var(--gold);
    background: var(--gold-dim);
    border: 1px solid var(--gold-border);
    padding: 2px 7px;
    align-self: center;
    margin-left: 2px;
  }
  .nav-cta {
    background: var(--gold);
    color: var(--navy);
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.06em;
    padding: 12px 28px;
    border: none;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s;
  }
  .nav-cta:hover { background: var(--gold-light); transform: translateY(-1px); }

  /* ─── HERO ─── */
  .hero {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    padding: 120px 60px 80px;
    position: relative;
    overflow: hidden;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 70% 50%, rgba(212,175,55,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 60% 80% at 20% 30%, rgba(10,0,128,0.8) 0%, transparent 70%),
      linear-gradient(160deg, #050058 0%, #080070 50%, #050058 100%);
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 80%);
  }
  .hero-content {
    position: relative; z-index: 2;
    max-width: 860px;
    text-align: center;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--gold-dim);
    border: 1px solid var(--gold-border);
    padding: 8px 20px;
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 36px;
  }
  .hero-badge::before {
    content: '';
    width: 6px; height: 6px;
    background: var(--gold);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:0.5; transform:scale(1.4); }
  }
  .hero h1 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: clamp(40px, 6vw, 72px);
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin-bottom: 28px;
  }
  .hero h1 .gold { color: var(--gold); }
  .hero p.sub {
    font-size: 18px;
    line-height: 1.7;
    color: var(--text-muted);
    max-width: 620px;
    margin: 0 auto 48px;
  }
  .hero-ctas {
    display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
  }
  .btn-primary {
    background: var(--gold);
    color: var(--navy);
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 14px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 18px 40px;
    border: none;
    cursor: pointer;
    transition: all 0.25s;
    position: relative;
    overflow: hidden;
  }
  .btn-primary::after {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.15);
    transform: translateX(-100%);
    transition: transform 0.3s;
  }
  .btn-primary:hover::after { transform: translateX(0); }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(212,175,55,0.4); }
  .btn-outline {
    background: transparent;
    color: var(--offwhite);
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 18px 40px;
    border: 1px solid rgba(250,249,246,0.3);
    cursor: pointer;
    transition: all 0.25s;
  }
  .btn-outline:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-2px); }

  .hero-stats {
    display: flex; gap: 48px; justify-content: center; margin-top: 64px;
    flex-wrap: wrap;
  }
  .hero-stat { text-align: center; }
  .hero-stat .num {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: 32px;
    color: var(--gold);
    display: block;
  }
  .hero-stat .label {
    font-size: 12px;
    color: var(--text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-top: 4px;
  }
  .hero-divider {
    width: 1px; background: var(--gold-border);
    height: 48px; align-self: center;
  }

  /* ─── SECTIONS ─── */
  section { padding: 100px 60px; }
  .section-label {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
  }
  .section-title {
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: clamp(28px, 4vw, 44px);
    line-height: 1.15;
    margin-bottom: 20px;
  }
  .section-sub {
    font-size: 17px;
    line-height: 1.7;
    color: var(--text-muted);
    max-width: 560px;
  }
  .container { max-width: 1140px; margin: 0 auto; }
  .text-center { text-align: center; }
  .text-center .section-sub { margin: 0 auto; }

  /* ─── DORES ─── */
  .dores { background: rgba(0,0,0,0.25); }
  .dores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-top: 60px;
  }
  .dor-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    padding: 36px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s, transform 0.3s;
  }
  .dor-card::before {
    content: '';
    position: absolute; top: 0; left: 0;
    width: 3px; height: 0;
    background: var(--gold);
    transition: height 0.4s;
  }
  .dor-card:hover::before { height: 100%; }
  .dor-card:hover { border-color: var(--gold-border); transform: translateY(-4px); }
  .dor-icon {
    font-size: 28px; margin-bottom: 20px;
  }
  .dor-card h3 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 12px;
  }
  .dor-card p {
    font-size: 14px;
    line-height: 1.7;
    color: var(--text-muted);
  }

  /* ─── SOLUÇÃO ─── */
  .solucao-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    margin-top: 60px;
  }
  @media(max-width:800px) { .solucao-cols { grid-template-columns: 1fr; gap: 40px; } }
  .solucao-text .section-sub { max-width: 100%; }
  .solucao-pillars {
    display: flex; flex-direction: column; gap: 20px; margin-top: 32px;
  }
  .pillar {
    display: flex; gap: 16px; align-items: flex-start;
    padding: 20px 24px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    transition: border-color 0.2s;
  }
  .pillar:hover { border-color: var(--gold-border); }
  .pillar-num {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: 28px;
    color: var(--gold);
    line-height: 1;
    flex-shrink: 0;
    width: 36px;
  }
  .pillar-text h4 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 6px;
  }
  .pillar-text p { font-size: 13px; color: var(--text-muted); line-height: 1.6; }

  /* dashboard mockup */
  .dashboard-mock {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--gold-border);
    border-radius: 2px;
    overflow: hidden;
    box-shadow: 0 40px 80px rgba(0,0,0,0.5);
  }
  .mock-header {
    background: rgba(212,175,55,0.08);
    border-bottom: 1px solid var(--gold-border);
    padding: 14px 20px;
    display: flex; align-items: center; gap: 8px;
  }
  .mock-dot { width:10px; height:10px; border-radius:50%; }
  .mock-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--gold);
    margin-left: 8px;
    text-transform: uppercase;
  }
  .mock-body { padding: 20px; }
  .mock-kpis {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;
  }
  .mock-kpi {
    background: rgba(212,175,55,0.06);
    border: 1px solid rgba(212,175,55,0.15);
    padding: 14px 16px;
  }
  .mock-kpi .kval {
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 20px;
    color: var(--gold);
  }
  .mock-kpi .klabel { font-size: 10px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }
  .mock-funnel {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(212,175,55,0.1);
    padding: 14px 16px;
  }
  .mock-funnel-title { font-size: 10px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; }
  .mock-stage {
    display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
  }
  .mock-stage-label { font-size: 11px; color: var(--text-muted); width: 100px; flex-shrink: 0; }
  .mock-stage-bar-wrap { flex: 1; height: 6px; background: rgba(255,255,255,0.05); }
  .mock-stage-bar { height: 100%; background: var(--gold); transition: width 0.6s; }
  .mock-stage-count { font-size: 11px; color: var(--gold); font-family: 'Montserrat', sans-serif; font-weight: 700; width: 24px; text-align: right; }

  /* ─── IA ─── */
  .ia-section { background: rgba(0,0,0,0.2); }
  .ia-flow {
    display: flex; flex-direction: column; gap: 0;
    margin-top: 60px; max-width: 700px; margin-left: auto; margin-right: auto;
  }
  .ia-step {
    display: flex; gap: 24px; align-items: flex-start;
    padding: 28px 0;
    border-bottom: 1px solid rgba(212,175,55,0.1);
    position: relative;
    opacity: 0;
    transform: translateX(-20px);
    transition: all 0.5s;
  }
  .ia-step.visible { opacity: 1; transform: translateX(0); }
  .ia-step:last-child { border-bottom: none; }
  .ia-step-num {
    width: 44px; height: 44px;
    background: var(--gold);
    color: var(--navy);
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ia-step-content h4 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 8px;
  }
  .ia-step-content p { font-size: 14px; color: var(--text-muted); line-height: 1.7; }

  .ia-canais {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 60px;
  }
  @media(max-width:600px) { .ia-canais { grid-template-columns: 1fr; } }
  .canal-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    padding: 32px;
    text-align: center;
    transition: all 0.3s;
  }
  .canal-card:hover { border-color: var(--gold); transform: translateY(-6px); }
  .canal-icon { margin-bottom: 20px; display: flex; justify-content: center; }
  .canal-card h3 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700; font-size: 15px; margin-bottom: 10px;
  }
  .canal-card p { font-size: 13px; color: var(--text-muted); line-height: 1.6; }

  /* ─── DIFERENCIAIS ─── */
  .dif-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
    gap: 2px;
    margin-top: 60px;
    border: 1px solid var(--gold-border);
  }
  .dif-item {
    padding: 36px;
    background: var(--card-bg);
    border: 1px solid transparent;
    transition: all 0.3s;
    position: relative;
  }
  .dif-item:hover { background: rgba(212,175,55,0.05); border-color: var(--gold-border); }
  .dif-tag {
    font-family: 'Montserrat', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
  }
  .dif-item h3 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 17px;
    margin-bottom: 10px;
  }
  .dif-item p { font-size: 14px; color: var(--text-muted); line-height: 1.6; }

  /* ─── FEATURES CRM ─── */
  .crm-section { background: rgba(0,0,0,0.15); }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px;
    margin-top: 60px;
  }
  .feature-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    padding: 32px;
    transition: all 0.3s;
  }
  .feature-card:hover { border-color: var(--gold); transform: translateY(-4px); }
  .feature-icon {
    font-size: 28px; margin-bottom: 20px;
    display: block;
  }
  .feature-card h3 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 12px;
    color: var(--offwhite);
  }
  .feature-card ul {
    list-style: none; display: flex; flex-direction: column; gap: 8px;
  }
  .feature-card li {
    font-size: 13px;
    color: var(--text-muted);
    padding-left: 16px;
    position: relative;
    line-height: 1.5;
  }
  .feature-card li::before {
    content: '·';
    position: absolute; left: 0;
    color: var(--gold);
    font-size: 10px;
    top: 3px;
  }

  /* ─── CONFIG IA ─── */
  .config-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 60px;
  }
  .config-item {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    padding: 24px;
    display: flex; gap: 16px; align-items: flex-start;
    transition: border-color 0.2s;
  }
  .config-item:hover { border-color: var(--gold-border); }
  .config-n {
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: 24px;
    color: var(--gold);
    flex-shrink: 0;
    line-height: 1;
  }
  .config-item h4 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 13px;
    margin-bottom: 4px;
  }
  .config-item p { font-size: 12px; color: var(--text-muted); line-height: 1.5; }

  /* ─── PERSONAS ─── */
  .personas { background: rgba(0,0,0,0.2); }
  .personas-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    margin-top: 60px;
  }
  @media(max-width:700px) { .personas-grid { grid-template-columns: 1fr; } }
  .persona-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    overflow: hidden;
    transition: border-color 0.3s;
  }
  .persona-card:hover { border-color: var(--gold-border); }
  .persona-header {
    background: rgba(212,175,55,0.08);
    border-bottom: 1px solid var(--gold-border);
    padding: 28px 32px;
  }
  .persona-initials {
    width: 52px; height: 52px;
    background: var(--gold);
    color: var(--navy);
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    font-size: 18px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
  }
  .persona-header h3 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 20px;
    margin-bottom: 4px;
  }
  .persona-header .role { font-size: 13px; color: var(--text-muted); }
  .persona-body { padding: 28px 32px; }
  .persona-quote {
    font-size: 14px;
    font-style: italic;
    color: var(--gold-light);
    border-left: 3px solid var(--gold);
    padding-left: 16px;
    margin-bottom: 24px;
    line-height: 1.6;
  }
  .persona-dores h4 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 12px;
  }
  .persona-dores ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .persona-dores li {
    font-size: 13px;
    color: var(--text-muted);
    padding-left: 20px;
    position: relative;
    line-height: 1.5;
  }
  .persona-dores li::before {
    content: '↳';
    position: absolute; left: 0;
    color: var(--gold);
  }

  /* ─── CTA FINAL ─── */
  .cta-section {
    background: linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 50%);
    border-top: 1px solid var(--gold-border);
    text-align: center;
  }
  .cta-section .section-title { font-size: clamp(28px, 4vw, 52px); }
  .cta-section .section-sub { margin: 20px auto 48px; }

  .form-inline {
    display: flex; gap: 0; max-width: 520px; margin: 0 auto;
  }
  .form-inline input {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--gold-border);
    border-right: none;
    color: var(--offwhite);
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    padding: 18px 24px;
    outline: none;
    transition: border-color 0.2s;
  }
  .form-inline input::placeholder { color: var(--text-dim); }
  .form-inline input:focus { border-color: var(--gold); }
  .form-inline button {
    background: var(--gold);
    color: var(--navy);
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 18px 32px;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s;
  }
  .form-inline button:hover { background: var(--gold-light); }
  .form-note { font-size: 12px; color: var(--text-dim); margin-top: 16px; }

  /* ─── FOOTER ─── */
  footer {
    background: rgba(0,0,0,0.4);
    border-top: 1px solid rgba(212,175,55,0.1);
    padding: 40px 60px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 16px;
  }
  .footer-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: 15px;
    letter-spacing: 0.06em;
    color: var(--offwhite);
  }
  .footer-logo span { color: var(--gold); }
  footer p { font-size: 12px; color: var(--text-dim); }

  /* ─── REVEAL ANIMATIONS ─── */
  .reveal {
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.6s, transform 0.6s;
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }

  @media(max-width:768px) {
    nav { padding: 16px 20px; }
    .nav-logo { font-size: 15px; }
    .nav-cta { padding: 10px 18px; font-size: 12px; }

    section { padding: 64px 20px; }
    .hero { padding: 90px 20px 56px; }

    .hero h1 { font-size: clamp(32px, 9vw, 48px); }
    .hero p.sub { font-size: 16px; }
    .hero-ctas { flex-direction: column; align-items: center; gap: 12px; }
    .btn-primary, .btn-outline { width: 100%; max-width: 320px; text-align: center; padding: 16px 24px; }
    .hero-stats { gap: 16px; justify-content: space-around; }
    .hero-stat .num { font-size: 26px; }
    .hero-divider { display: none; }

    .dores-grid { grid-template-columns: 1fr; gap: 16px; }
    .dor-card { padding: 24px; }

    .solucao-cols { gap: 32px; }
    .dashboard-mock { display: none; }

    .ia-canais { grid-template-columns: 1fr; gap: 16px; }
    .canal-card { padding: 24px; }
    .ia-step { gap: 16px; padding: 20px 0; }

    .config-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
    .config-item { padding: 16px; }
    .config-n { font-size: 20px; }

    .features-grid { grid-template-columns: 1fr; gap: 16px; }
    .feature-card { padding: 24px; }

    .dif-grid { grid-template-columns: 1fr; gap: 12px; border: none; }
    .dif-item { border: 1px solid var(--card-border); padding: 24px; }

    .personas-grid { grid-template-columns: 1fr; gap: 20px; }
    .persona-header { padding: 20px 24px; }
    .persona-body { padding: 20px 24px; }

    .form-inline { flex-direction: column; }
    .form-inline input { border-right: 1px solid var(--gold-border); border-bottom: none; }
    .form-inline button { padding: 16px; }

    footer { padding: 28px 20px; flex-direction: column; align-items: center; text-align: center; gap: 12px; }

    .section-title { font-size: clamp(24px, 7vw, 36px); }
    .section-sub { font-size: 15px; }
  }

  @media(max-width:480px) {
    .hero-badge { font-size: 10px; padding: 6px 14px; }
    .hero-stats { flex-direction: column; gap: 12px; align-items: center; }
    .config-grid { grid-template-columns: 1fr; }
    .mock-kpis { grid-template-columns: 1fr 1fr; }
    nav { padding: 14px 16px; }
    section { padding: 52px 16px; }
    .hero { padding: 80px 16px 48px; }
  }

  .gold-line {
    width: 48px; height: 3px;
    background: var(--gold);
    margin-bottom: 28px;
  }
  .gold-line.center { margin-left: auto; margin-right: auto; }
</style>
</head>
<body>

<!-- NAV -->
<nav>
  <a href="/" class="nav-logo">
    <svg class="logo-mark" width="26" height="33" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 1C7.373 1 2 6.373 2 13c0 4.2 2.1 7.9 5.4 10.2L14 35l6.6-11.8C23.9 20.9 26 17.2 26 13 26 6.373 20.627 1 14 1z" fill="#D4AF37"/>
      <rect x="7" y="16.5" width="3.2" height="5" rx="0.5" fill="#050058"/>
      <rect x="12" y="13" width="3.2" height="8.5" rx="0.5" fill="#050058"/>
      <rect x="17" y="9.5" width="3.2" height="12" rx="0.5" fill="#050058"/>
    </svg>
    RESERVA <span>ATIVA</span><em class="app-tag">APP</em>
  </a>
  <button class="nav-cta" onclick="document.getElementById('cta').scrollIntoView({behavior:'smooth'})">Quero uma Demo</button>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-grid"></div>
  <div class="hero-content">
    <div class="hero-badge">
      <svg width="14" height="18" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right:2px" aria-hidden="true">
        <path d="M14 1C7.373 1 2 6.373 2 13c0 4.2 2.1 7.9 5.4 10.2L14 35l6.6-11.8C23.9 20.9 26 17.2 26 13 26 6.373 20.627 1 14 1z" fill="#D4AF37"/>
        <rect x="7" y="16.5" width="3.2" height="5" rx="0.5" fill="#050058"/>
        <rect x="12" y="13" width="3.2" height="8.5" rx="0.5" fill="#050058"/>
        <rect x="17" y="9.5" width="3.2" height="12" rx="0.5" fill="#050058"/>
      </svg>
      Reserva Ativa App · Inteligência Comercial para Hotéis
    </div>
    <h1>
      O seu hotel merece um<br>
      time de vendas que<br>
      <span class="gold">trabalha 24h por dia</span>
    </h1>
    <p class="sub">
      CRM completo + IA treinada com os dados do seu hotel. Atende no WhatsApp, Instagram e site. Qualifica. Propõe. Fecha. E avisa o seu vendedor na hora certa.
    </p>
    <div class="hero-ctas">
      <button class="btn-primary" onclick="document.getElementById('cta').scrollIntoView({behavior:'smooth'})">Agendar Demonstração</button>
      <button class="btn-outline" onclick="document.getElementById('como-funciona').scrollIntoView({behavior:'smooth'})">Ver Como Funciona</button>
    </div>
    <div class="hero-stats">
      <div class="hero-stat">
        <span class="num">24h</span>
        <span class="label">Atendimento ativo</span>
      </div>
      <div class="hero-divider"></div>
      <div class="hero-stat">
        <span class="num">3</span>
        <span class="label">Canais integrados</span>
      </div>
      <div class="hero-divider"></div>
      <div class="hero-stat">
        <span class="num">7</span>
        <span class="label">Estágios de funil</span>
      </div>
      <div class="hero-divider"></div>
      <div class="hero-stat">
        <span class="num">0</span>
        <span class="label">Leads abandonados</span>
      </div>
    </div>
  </div>
</section>

<!-- DORES -->
<section class="dores">
  <div class="container">
    <div class="text-center reveal">
      <div class="section-label">O problema que você conhece bem</div>
      <div class="gold-line center"></div>
      <h2 class="section-title">O dinheiro que fica na mesa. Todos os dias.</h2>
      <p class="section-sub">Leads chegam. Ninguém faz follow-up. O hotel continua operando na metade da capacidade.</p>
    </div>
    <div class="dores-grid">
      <div class="dor-card reveal reveal-delay-1">
        <div class="dor-icon">📱</div>
        <h3>WhatsApp acumula sem resposta</h3>
        <p>Orçamentos chegam na recepção, ficam sem retorno e o lead vai embora para o Booking ou para o concorrente.</p>
      </div>
      <div class="dor-card reveal reveal-delay-2">
        <div class="dor-icon">🔁</div>
        <h3>Nenhum follow-up estruturado</h3>
        <p>"Vou pensar" vira silêncio. Sem processo ativo de reengajamento, a maioria dos leads simplesmente esfria.</p>
      </div>
      <div class="dor-card reveal reveal-delay-3">
        <div class="dor-icon">📊</div>
        <h3>Zero visibilidade do funil</h3>
        <p>Você não sabe quantos leads entram, quantos convertem nem onde estão parando. Gestão no escuro.</p>
      </div>
      <div class="dor-card reveal reveal-delay-1">
        <div class="dor-icon">💸</div>
        <h3>Dependência das OTAs</h3>
        <p>18 a 25% de comissão por reserva. O cliente fica na base deles, não na sua. Você constrói um negócio dependente.</p>
      </div>
      <div class="dor-card reveal reveal-delay-2">
        <div class="dor-icon">⌛</div>
        <h3>Recepção sobrecarregada</h3>
        <p>A mesma equipe que faz check-in também deveria vender. Não funciona. E todo mundo sabe disso.</p>
      </div>
      <div class="dor-card reveal reveal-delay-3">
        <div class="dor-icon">🗂️</div>
        <h3>Histórico no celular de quem saiu</h3>
        <p>Sem CRM, o relacionamento com o cliente some quando o funcionário vai embora. Você recomeça do zero.</p>
      </div>
    </div>
  </div>
</section>

<!-- SOLUÇÃO -->
<section id="como-funciona">
  <div class="container">
    <div class="solucao-cols">
      <div class="solucao-text reveal">
        <div class="section-label">A solução</div>
        <div class="gold-line"></div>
        <h2 class="section-title">Uma plataforma. Dois motores. Resultado real.</h2>
        <p class="section-sub">O Reserva Ativa App combina um CRM profissional com uma IA treinada com os dados do seu hotel, funcionando em paralelo, 24h por dia.</p>
        <div class="solucao-pillars">
          <div class="pillar">
            <div class="pillar-num">01</div>
            <div class="pillar-text">
              <h4>IA de Atendimento e Vendas</h4>
              <p>Responde leads no WhatsApp, Instagram e site usando os seus preços, seus quartos e suas regras. Qualifica, propõe e fecha. Ou avisa o vendedor na hora certa.</p>
            </div>
          </div>
          <div class="pillar">
            <div class="pillar-num">02</div>
            <div class="pillar-text">
              <h4>CRM Profissional Completo</h4>
              <p>Pipeline em kanban com 7 estágios, follow-up estruturado, histórico da IA visível para o vendedor e relatórios em tempo real para o gestor.</p>
            </div>
          </div>
          <div class="pillar">
            <div class="pillar-num">03</div>
            <div class="pillar-text">
              <h4>Dashboard Executivo</h4>
              <p>4 KPIs principais, funil visual, alertas de follow-up atrasado e relatórios de conversão. Tudo num painel que você acessa de qualquer lugar.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="reveal reveal-delay-2">
        <div class="dashboard-mock">
          <div class="mock-header">
            <div class="mock-dot" style="background:#ff5f57"></div>
            <div class="mock-dot" style="background:#febc2e"></div>
            <div class="mock-dot" style="background:#28c840"></div>
            <span class="mock-title">Dashboard Executivo</span>
          </div>
          <div class="mock-body">
            <div class="mock-kpis">
              <div class="mock-kpi">
                <div class="kval">142</div>
                <div class="klabel">Total de Leads</div>
              </div>
              <div class="mock-kpi">
                <div class="kval">34%</div>
                <div class="klabel">Taxa de Conversão</div>
              </div>
              <div class="mock-kpi">
                <div class="kval">R$ 87k</div>
                <div class="klabel">Em Pipeline</div>
              </div>
              <div class="mock-kpi">
                <div class="kval">R$ 29k</div>
                <div class="klabel">Receita Fechada</div>
              </div>
            </div>
            <div class="mock-funnel">
              <div class="mock-funnel-title">Funil de Vendas: 7 Estágios</div>
              <div class="mock-stage">
                <span class="mock-stage-label">Novo Lead</span>
                <div class="mock-stage-bar-wrap"><div class="mock-stage-bar" style="width:100%"></div></div>
                <span class="mock-stage-count">58</span>
              </div>
              <div class="mock-stage">
                <span class="mock-stage-label">Qualificado</span>
                <div class="mock-stage-bar-wrap"><div class="mock-stage-bar" style="width:78%"></div></div>
                <span class="mock-stage-count">45</span>
              </div>
              <div class="mock-stage">
                <span class="mock-stage-label">Proposta Enviada</span>
                <div class="mock-stage-bar-wrap"><div class="mock-stage-bar" style="width:52%"></div></div>
                <span class="mock-stage-count">30</span>
              </div>
              <div class="mock-stage">
                <span class="mock-stage-label">Negociação</span>
                <div class="mock-stage-bar-wrap"><div class="mock-stage-bar" style="width:34%"></div></div>
                <span class="mock-stage-count">20</span>
              </div>
              <div class="mock-stage">
                <span class="mock-stage-label" style="color:#D4AF37">⚠ Atrasados</span>
                <div class="mock-stage-bar-wrap"><div class="mock-stage-bar" style="width:15%; background:#c0392b"></div></div>
                <span class="mock-stage-count" style="color:#c0392b">9</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- IA -->
<section class="ia-section">
  <div class="container">
    <div class="text-center reveal">
      <div class="section-label">Inteligência Artificial</div>
      <div class="gold-line center"></div>
      <h2 class="section-title">A IA que conhece o seu hotel de cor</h2>
      <p class="section-sub">Não é um bot genérico. É uma consultora virtual treinada com os seus preços, seus quartos, suas regras e seus diferenciais.</p>
    </div>

    <div class="ia-canais">
      <div class="canal-card reveal reveal-delay-1">
        <div class="canal-icon">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="22" cy="22" r="22" fill="#25D366"/>
            <path d="M22 8C14.268 8 8 14.268 8 22c0 2.734.74 5.3 2.034 7.51L8.5 36l6.69-1.512A13.93 13.93 0 0022 36c7.732 0 14-6.268 14-14S29.732 8 22 8z" fill="#25D366"/>
            <path d="M22 9.5C15.096 9.5 9.5 15.096 9.5 22c0 2.52.69 4.876 1.89 6.893L9.5 34.5l5.76-1.854A12.44 12.44 0 0022 34.5c6.904 0 12.5-5.596 12.5-12.5S28.904 9.5 22 9.5z" fill="white" fill-opacity="0.15"/>
            <path d="M28.8 25.58c-.32-.16-1.9-.938-2.195-1.044-.296-.108-.51-.16-.724.16-.215.32-.83 1.044-1.018 1.26-.187.213-.375.24-.695.08-.32-.16-1.353-.5-2.578-1.592-.953-.85-1.596-1.9-1.784-2.22-.187-.32-.02-.494.14-.654.144-.144.32-.375.482-.562.16-.188.213-.32.32-.534.107-.213.054-.4-.027-.56-.08-.16-.722-1.74-.99-2.38-.26-.624-.524-.54-.722-.548a12.93 12.93 0 00-.615-.01c-.214 0-.563.08-.857.4-.295.32-1.124 1.096-1.124 2.674 0 1.578 1.15 3.104 1.31 3.318.16.214 2.263 3.456 5.486 4.848.767.332 1.366.53 1.832.678.77.245 1.47.21 2.024.128.617-.093 1.9-.777 2.168-1.527.267-.75.267-1.394.187-1.527-.08-.133-.294-.213-.614-.373z" fill="white"/>
          </svg>
        </div>
        <h3>WhatsApp</h3>
        <p>Integração direta com o número do hotel. Responde automaticamente, qualifica e propõe reserva.</p>
      </div>
      <div class="canal-card reveal reveal-delay-2">
        <div class="canal-icon">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ig-bg" x1="0" y1="44" x2="44" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#FFDC80"/>
                <stop offset="25%" stop-color="#FCAF45"/>
                <stop offset="50%" stop-color="#F77737"/>
                <stop offset="75%" stop-color="#C13584"/>
                <stop offset="100%" stop-color="#833AB4"/>
              </linearGradient>
            </defs>
            <rect width="44" height="44" rx="12" fill="url(#ig-bg)"/>
            <rect x="9" y="9" width="26" height="26" rx="7" stroke="white" stroke-width="2.5" fill="none"/>
            <circle cx="22" cy="22" r="7" stroke="white" stroke-width="2.5" fill="none"/>
            <circle cx="30.5" cy="13.5" r="2" fill="white"/>
          </svg>
        </div>
        <h3>Instagram</h3>
        <p>Responde nas DMs. Capta o telefone do lead e sincroniza com o CRM automaticamente.</p>
      </div>
      <div class="canal-card reveal reveal-delay-3">
        <div class="canal-icon">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="22" cy="22" r="20" stroke="#D4AF37" stroke-width="2" fill="none"/>
            <ellipse cx="22" cy="22" rx="7.5" ry="20" stroke="#D4AF37" stroke-width="2" fill="none"/>
            <line x1="2" y1="22" x2="42" y2="22" stroke="#D4AF37" stroke-width="2"/>
            <path d="M5 14.5h34M5 29.5h34" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="3 2"/>
          </svg>
        </div>
        <h3>Site</h3>
        <p>Widget de chat instalado com um único snippet de código. Sem complicação técnica.</p>
      </div>
    </div>

    <div class="ia-flow">
      <div class="text-center" style="margin-bottom:32px; margin-top:60px;">
        <div class="section-label">Metodologia de Vendas Consultiva</div>
        <h3 style="font-family:'Montserrat',sans-serif; font-weight:800; font-size:22px;">O fluxo da conversa em 5 etapas</h3>
      </div>
      <div class="ia-step">
        <div class="ia-step-num">01</div>
        <div class="ia-step-content">
          <h4>Boas-vindas e conexão</h4>
          <p>A IA se apresenta com o nome e o hotel, criando uma experiência humana desde o primeiro contato.</p>
        </div>
      </div>
      <div class="ia-step">
        <div class="ia-step-num">02</div>
        <div class="ia-step-content">
          <h4>Qualificação invisível</h4>
          <p>2 perguntas naturais para entender a ocasião, data, número de pessoas e cidade de origem, sem parecer formulário.</p>
        </div>
      </div>
      <div class="ia-step">
        <div class="ia-step-num">03</div>
        <div class="ia-step-content">
          <h4>Apresentação personalizada</h4>
          <p>Casal → spa e romanticismo. Família → área kids e atividades. Grupo → espaços e logística. A abordagem muda conforme o perfil.</p>
        </div>
      </div>
      <div class="ia-step">
        <div class="ia-step-num">04</div>
        <div class="ia-step-content">
          <h4>Proposta e contorno de objeções</h4>
          <p>Apresenta preços com argumentos. Responde "está caro" e "vou pensar" com as respostas que você mesmo configurou.</p>
        </div>
      </div>
      <div class="ia-step">
        <div class="ia-step-num">05</div>
        <div class="ia-step-content">
          <h4>Fechamento ou escalação inteligente</h4>
          <p>Confirma dados e envia link de reserva. Ou escalona para o vendedor humano quando necessário, com notificação imediata no WhatsApp.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FEATURES CRM -->
<section class="crm-section">
  <div class="container">
    <div class="text-center reveal">
      <div class="section-label">CRM Profissional</div>
      <div class="gold-line center"></div>
      <h2 class="section-title">Tudo que o seu time de vendas precisa, num só lugar</h2>
      <p class="section-sub">O vendedor chega na conversa sabendo tudo que a IA já fez. Nunca começa do zero.</p>
    </div>
    <div class="features-grid">
      <div class="feature-card reveal reveal-delay-1">
        <span class="feature-icon">🗂️</span>
        <h3>Pipeline em Kanban</h3>
        <ul>
          <li>7 estágios com drag & drop</li>
          <li>Filtros por temperatura, origem e urgência</li>
          <li>Exportação para CSV com 1 clique</li>
          <li>Criação manual de leads</li>
        </ul>
      </div>
      <div class="feature-card reveal reveal-delay-2">
        <span class="feature-icon">🤖</span>
        <h3>Fila de Escalações</h3>
        <ul>
          <li>Banner com leads que a IA escalou</li>
          <li>Nome, canal e motivo visíveis de imediato</li>
          <li>Nenhum lead escalado fica sem resposta</li>
        </ul>
      </div>
      <div class="feature-card reveal reveal-delay-3">
        <span class="feature-icon">📋</span>
        <h3>Modal Completo do Lead</h3>
        <ul>
          <li>5 abas: follow-up, dados, conversa IA, timeline, templates</li>
          <li>Histórico completo da IA com timestamps</li>
          <li>4 botões rápidos de log de atividade</li>
          <li>Auto-save em cada campo editado</li>
        </ul>
      </div>
      <div class="feature-card reveal reveal-delay-1">
        <span class="feature-icon">💬</span>
        <h3>Templates de Mensagem</h3>
        <ul>
          <li>Primeiro Contato, Follow-up, Proposta, Reativação</li>
          <li>Nome do lead inserido automaticamente</li>
          <li>Copiar e colar no WhatsApp em 2 cliques</li>
        </ul>
      </div>
      <div class="feature-card reveal reveal-delay-2">
        <span class="feature-icon">📈</span>
        <h3>Relatórios Avançados</h3>
        <ul>
          <li>Conversão mês a mês (últimos 12 meses)</li>
          <li>Leads por origem com valor total gerado</li>
          <li>Distribuição por estágio e temperatura</li>
        </ul>
      </div>
      <div class="feature-card reveal reveal-delay-3">
        <span class="feature-icon">🔄</span>
        <h3>Reengajamento Automático</h3>
        <ul>
          <li>Cron job diário para leads em silêncio</li>
          <li>Sem ação manual da equipe necessária</li>
          <li>Nenhum lead frio abandonado</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- DIFERENCIAIS -->
<section>
  <div class="container">
    <div class="text-center reveal">
      <div class="section-label">Por que o Reserva Ativa App</div>
      <div class="gold-line center"></div>
      <h2 class="section-title">O que nenhum outro CRM de hotel oferece</h2>
    </div>
    <div class="dif-grid">
      <div class="dif-item reveal reveal-delay-1">
        <div class="dif-tag">Diferencial 01</div>
        <h3>IA treinada com os dados do seu hotel</h3>
        <p>Não é um bot genérico. Ela sabe os seus preços, seus quartos e suas regras. E só usa o que você configurou. Jamais inventa.</p>
      </div>
      <div class="dif-item reveal reveal-delay-2">
        <div class="dif-tag">Diferencial 02</div>
        <h3>Metodologia de vendas embutida</h3>
        <p>A IA usa SPIN selling adaptado para hotelaria. Não é um FAQ glorificado. É uma consultora de vendas consultiva.</p>
      </div>
      <div class="dif-item reveal reveal-delay-3">
        <div class="dif-tag">Diferencial 03</div>
        <h3>Multi-canal unificado</h3>
        <p>WhatsApp + Instagram + site em um único pipeline. O lead entra por onde quiser. O processo é sempre o mesmo.</p>
      </div>
      <div class="dif-item reveal reveal-delay-1">
        <div class="dif-tag">Diferencial 04</div>
        <h3>Histórico da IA visível para o vendedor</h3>
        <p>O humano nunca começa do zero. Lê tudo que a IA já fez, mensagem a mensagem, antes de entrar na conversa.</p>
      </div>
      <div class="dif-item reveal reveal-delay-2">
        <div class="dif-tag">Diferencial 05</div>
        <h3>Escalação inteligente com notificação</h3>
        <p>A IA sabe quando ceder. E avisa na hora certa, com nome do lead e motivo da escalação direto no seu WhatsApp.</p>
      </div>
      <div class="dif-item reveal reveal-delay-3">
        <div class="dif-tag">Diferencial 06</div>
        <h3>Configuração sem técnico</h3>
        <p>O próprio gestor monta a base de conhecimento em 10 seções. Nenhum desenvolvedor, nenhuma agência, nenhum custo extra.</p>
      </div>
    </div>
  </div>
</section>

<!-- PERSONAS -->
<section class="personas">
  <div class="container">
    <div class="text-center reveal">
      <div class="section-label">Feito para quem cuida do hotel</div>
      <div class="gold-line center"></div>
      <h2 class="section-title">Reconhece alguém aqui?</h2>
    </div>
    <div class="personas-grid">
      <div class="persona-card reveal reveal-delay-1">
        <div class="persona-header">
          <div class="persona-initials">RO</div>
          <h3>Roberto Oliveira</h3>
          <span class="role">Dono de hotel fazenda · 52 anos · Resende, RJ</span>
        </div>
        <div class="persona-body">
          <p class="persona-quote">"Chega bastante gente no WhatsApp, mas no fim do mês o hotel não está tão cheio quanto deveria."</p>
          <div class="persona-dores">
            <h4>O que ele vive todo dia</h4>
            <ul>
              <li>Orçamentos acumulam sem retorno na recepção</li>
              <li>Hotel cheio só no feriado. No resto do ano, pela metade</li>
              <li>Paga 18 a 25% ao Booking e odeia a dependência</li>
              <li>Não tem dados reais sobre taxa de conversão</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="persona-card reveal reveal-delay-2">
        <div class="persona-header">
          <div class="persona-initials">CS</div>
          <h3>Camila Souza</h3>
          <span class="role">Gestora · 34 anos · Vale do Café, RJ</span>
        </div>
        <div class="persona-body">
          <p class="persona-quote">"Eu sei que a gente tem potencial para faturar muito mais. O problema é que não tenho estrutura para dar conta de tudo."</p>
          <div class="persona-dores">
            <h4>O que ela precisa resolver</h4>
            <ul>
              <li>Acumula gestão, atendimento e vendas sem conseguir escalar</li>
              <li>Perde reservas por falta de follow-up estruturado</li>
              <li>Não tem CRM. O histórico some quando o funcionário sai</li>
              <li>Quer dados para mostrar ao sócio e tomar decisões</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-section" id="cta">
  <div class="container">
    <div class="reveal">
      <div class="section-label">Próximo passo</div>
      <div class="gold-line center"></div>
      <h2 class="section-title">Veja o sistema funcionando<br>com os dados do seu hotel</h2>
      <p class="section-sub">Agende uma demonstração gratuita. Mostramos o dashboard ao vivo, a IA em ação e o CRM configurado para o seu perfil.</p>
      <div class="form-inline">
        <input type="tel" placeholder="Seu WhatsApp com DDD" id="phone-input">
        <button onclick="handleCTA()">Quero a Demo</button>
      </div>
      <p class="form-note">Sem compromisso. Resposta em até 2 horas úteis.</p>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-logo">
    <svg width="22" height="28" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 1C7.373 1 2 6.373 2 13c0 4.2 2.1 7.9 5.4 10.2L14 35l6.6-11.8C23.9 20.9 26 17.2 26 13 26 6.373 20.627 1 14 1z" fill="#D4AF37"/>
      <rect x="7" y="16.5" width="3.2" height="5" rx="0.5" fill="#050058"/>
      <rect x="12" y="13" width="3.2" height="8.5" rx="0.5" fill="#050058"/>
      <rect x="17" y="9.5" width="3.2" height="12" rx="0.5" fill="#050058"/>
    </svg>
    RESERVA <span>ATIVA</span>
  </div>
  <p style="color:rgba(250,249,246,0.5); font-style:italic; letter-spacing:0.02em">Inteligência comercial que preenche vagas e antecipa receitas.</p>
  <p style="color:var(--text-dim)">© 2026 Reserva Ativa · Todos os direitos reservados</p>
</footer>

<script>
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .ia-step').forEach(el => observer.observe(el));

  function handleCTA() {
    const phone = document.getElementById('phone-input').value.trim();
    if (!phone) {
      document.getElementById('phone-input').style.borderColor = '#c0392b';
      document.getElementById('phone-input').placeholder = 'Informe seu WhatsApp';
      return;
    }
    const msg = encodeURIComponent('Olá! Quero agendar uma demonstração do Reserva Ativa App. Meu WhatsApp: ' + phone);
    window.open('https://wa.me/5524999720763?text=' + msg, '_blank');
  }

  document.getElementById('phone-input').addEventListener('input', function() {
    this.style.borderColor = '';
    let v = this.value.replace(/\\D/g,'');
    if(v.length > 11) v = v.slice(0,11);
    let formatted = v;
    if(v.length > 2) formatted = '(' + v.slice(0,2) + ') ' + v.slice(2);
    if(v.length > 7) formatted = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
    this.value = formatted;
  });

  document.getElementById('phone-input').addEventListener('keydown', function(e) {
    if(e.key === 'Enter') handleCTA();
  });
</script>
</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
