import { createClient } from "../supabase/server";

export const defaultSiteContent = {
  home: {
    heroEyebrow: "CRÉER · APPRENDRE · ÉVOLUER",
    heroTitle: "Le numérique,",
    heroAccent: "sans limites.",
    heroText: "Nexora rassemble formations, développement, services et projets dans une plateforme pensée pour transformer les idées en réalisations.",
    primaryLabel: "Démarrer un projet", primaryHref: "/services",
    secondaryLabel: "Explorer les formations", secondaryHref: "/formations",
    trust: ["Approche pratique", "Projets sur mesure", "Plateforme évolutive"],
    pillars: [{icon:"📚",title:"Formations",text:"Des parcours pratiques pour apprendre le développement et les outils numériques.",href:"/formations"},{icon:"💻",title:"Développement",text:"Des scripts, systèmes et applications pensés autour de vos besoins.",href:"/services"},{icon:"🌐",title:"Projets",text:"Explorez les univers et plateformes déjà construits dans l'écosystème Nexora.",href:"/sites"},{icon:"🎧",title:"Accompagnement",text:"Un coup de main pour comprendre, corriger ou faire avancer votre projet.",href:"/contact"}],
    showStats:true, showIntro:true, showPillars:true, showFeature:true, showCta:true,
    stats: [{value:"03",label:"Projets présentés"},{value:"06",label:"Formations disponibles"},{value:"06",label:"Services proposés"},{value:"∞",label:"Possibilités à venir"}],
    introEyebrow: "L'UNIVERS NEXORA", introTitle: "Un seul univers.", introAccent: "Plusieurs possibilités.", introText: "Que vous souhaitiez apprendre, lancer un site, développer un système ou simplement débloquer un problème, Nexora est construit pour réunir ces besoins au même endroit.",
    featureEyebrow: "APPRENDRE AUTREMENT", featureTitle: "Pas seulement des cours.", featureAccent: "Des compétences utiles.", featureText: "Les formations Nexora sont pensées autour de la pratique : comprendre une notion, l'utiliser et l'intégrer dans un vrai projet.",
    ctaEyebrow: "PRÊT À COMMENCER ?", ctaTitle: "Votre idée mérite", ctaAccent: "d'aller plus loin.", ctaText: "Décrivez votre projet, votre besoin ou votre problème. On construit la suite ensemble.",
    customBlocks: []
  },
  formations: {showCta:true,showCatalog:true,eyebrow:"APPRENDRE AVEC NEXORA",title:"Des formations",accent:"faites pour pratiquer.",text:"Des parcours accessibles et orientés projet pour apprendre progressivement, sans vous perdre dans la théorie.",ctaTitle:"Vous avez un sujet précis ?",ctaText:"Contactez Nexora pour discuter d'un parcours adapté à votre objectif.",customBlocks:[]},
  services: {showProcess:true,showCatalog:true,showCta:true,eyebrow:"NOS SERVICES",title:"Une idée ?",accent:"On la construit.",text:"Du développement à la mise en ligne, Nexora vous accompagne avec des prestations simples, transparentes et adaptées à votre besoin.",processEyebrow:"COMMENT ÇA MARCHE",processTitle:"Simple, clair,",processAccent:"efficace.",steps:[{number:"01",title:"Échange",text:"Vous expliquez votre besoin."},{number:"02",title:"Proposition",text:"On définit la solution et le périmètre."},{number:"03",title:"Réalisation",text:"Le projet prend forme étape par étape."}],ctaEyebrow:"UN BESOIN PARTICULIER ?",ctaTitle:"Parlez-nous de votre projet.",ctaText:"Réponse personnalisée selon votre besoin",customBlocks:[]},
  about: {showTeam:true,showWhy:true,showProcess:true,showCta:true,eyebrow:"À PROPOS DE NEXORA",title:"Une plateforme pensée pour",accent:"faire avancer vos idées.",text:"Nexora réunit développement, création de sites, services numériques et formations dans un même univers.",teamEyebrow:"L’ÉQUIPE NEXORA",teamTitle:"Des profils différents,",teamAccent:"une même vision.",teamText:"Une petite équipe qui avance avec une approche simple : comprendre le besoin, construire proprement et rester disponible.",team:[{icon:"◈",name:"Nexora",role:"Plateforme & développement",text:"Conception de la plateforme, développement et évolution des outils Nexora."},{icon:"✦",name:"Création",role:"Sites & expériences",text:"Création de sites, interfaces et expériences numériques adaptées aux projets."},{icon:"⌁",name:"Accompagnement",role:"Support & transmission",text:"Aide, conseils et formations pour transformer une idée en compétence ou en projet."}],whyEyebrow:"POURQUOI NEXORA",whyTitle:"Pas seulement livrer.",whyAccent:"Construire avec vous.",whyText:"Chaque projet commence par un échange. L’objectif est de proposer une solution compréhensible, utile et évolutive, sans vous perdre dans une complexité inutile.",why:[{icon:"01",title:"Écouter",text:"Comprendre votre objectif avant de parler de solution."},{icon:"02",title:"Construire",text:"Développer étape par étape avec une base propre et évolutive."},{icon:"03",title:"Accompagner",text:"Rester présent pour expliquer, améliorer et faire évoluer le projet."}],processEyebrow:"NOTRE FAÇON DE TRAVAILLER",processTitle:"Simple dans l’approche.",processAccent:"Sérieux dans l’exécution.",processText:"Nexora privilégie les échanges clairs, les solutions adaptées et une progression visible du projet.",ctaEyebrow:"UN PROJET EN TÊTE ?",ctaTitle:"Faisons connaissance.",ctaText:"Présentez-nous votre idée et voyons ensemble comment la faire évoluer.",supportEnabled:true,supportEyebrow:"SOUTENIR NEXORA",supportTitle:"Un petit coup de pouce pour",supportAccent:"faire grandir Nexora.",supportText:"Si Nexora, ses projets ou ses ressources vous sont utiles, vous pouvez soutenir librement son développement. Chaque contribution aide à faire évoluer la plateforme.",supportButtonLabel:"Laisser un pourboire",supportUrl:"",supportNote:"Votre soutien est libre et contribue au développement de Nexora.",customBlocks:[]},
  projets: {showCatalog:true,showCta:true,eyebrow:"NEXORA / RÉALISATIONS",title:"Des idées devenues",accent:"des projets concrets.",text:"Découvrez une sélection de projets conçus, développés ou accompagnés par Nexora.",ctaEyebrow:"VOTRE PROJET",ctaTitle:"Et si votre idée était la prochaine ?",ctaText:"Présentez-nous votre projet et construisons-le ensemble.",customBlocks:[]},
  sites: {showCatalog:true,showEcosystem:true,eyebrow:"NOS PROJETS",title:"Des idées qui",accent:"prennent vie.",text:"Découvrez les projets déjà réalisés ou développés dans l’écosystème Nexora. Cette vitrine évoluera au fil des nouveaux projets.",ecoEyebrow:"L’ÉCOSYSTÈME NEXORA",ecoTitle:"Un espace pour",ecoAccent:"chaque projet.",ecoText:"Nexora rassemble progressivement les projets, services et outils numériques développés autour de différentes communautés et expériences.",customBlocks:[]},
  abonnements: {eyebrow:"ABONNEMENTS NEXORA",title:"Choisissez votre",accent:"formule.",text:"Deux formules simples pour profiter de Nexora et bénéficier d’un accompagnement adapté à vos besoins.",customBlocks:[]},
  contact: {showContactInfo:true,showForm:true,eyebrow:"NOUS CONTACTER",title:"Un projet ?",accent:"Parlons-en.",text:"Décrivez votre besoin en quelques lignes. Cette première demande permet de préparer un échange précis.",leadTitle:"Construisons la suite.",leadText:"Que ce soit une création, une correction, une optimisation ou une formation, expliquez simplement ce que vous souhaitez.",chatText:"La messagerie intégrée est disponible depuis votre espace Nexora.",email:"nexora.plateforme@gmail.com",phone:"À définir",customBlocks:[]}
};

export async function getSiteContent(page) {
  const fallback = defaultSiteContent[page] || {};
  try {
    const supabase = await createClient();
    const {data,error} = await supabase.from("site_content").select("content").eq("page_key",page).maybeSingle();
    if (!error && data?.content) return {...fallback,...data.content};
  } catch {}
  return fallback;
}

export async function getCustomPage(slug) {
  try {
    const supabase = await createClient();
    // Une page publiée est publique. Une page masquée reste accessible uniquement
    // aux membres du staff afin qu'ils puissent la prévisualiser et la modifier.
    const { data, error } = await supabase.from("site_pages").select("*").eq("slug", slug).maybeSingle();
    if (error || !data) return null;
    if (data.published) return data;

    const { data: claims } = await supabase.auth.getClaims();
    const userId = claims?.claims?.sub;
    if (!userId) return null;

    const { data: staff, error: staffError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (!staffError && staff) return data;
  } catch {}
  return null;
}

export async function getCustomNavPages() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("site_pages").select("id,slug,title,nav_label,show_in_nav,published,sort_order").eq("published", true).eq("show_in_nav", true).order("sort_order", { ascending:true }).order("title", { ascending:true });
    if (!error) return data || [];
  } catch {}
  return [];
}

export async function isStaffUser() {
  try {
    const supabase = await createClient();
    const { data: claims } = await supabase.auth.getClaims();
    const userId = claims?.claims?.sub;
    if (!userId) return false;
    const { data } = await supabase.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
    return !!data;
  } catch { return false; }
}

export async function canViewFixedPage(page) {
  const content = await getSiteContent(page);
  if (content.published !== false) return true;
  return isStaffUser();
}
