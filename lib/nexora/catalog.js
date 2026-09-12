import { createClient } from "../supabase/server";
import { formations as fallbackFormations } from "../../app/data";

const fallbackServices = [
  { slug:"developpement-sur-mesure", title:"Développement sur mesure", icon:"Code2", description:"Création de scripts, systèmes et fonctionnalités adaptés à votre projet.", price_label:"À partir de 49 €", active:true },
  { slug:"creation-site-web", title:"Création de site web", icon:"Globe", description:"Sites vitrines, landing pages et plateformes modernes prêtes à évoluer.", price_label:"À partir de 79 €", active:true },
  { slug:"optimisation-pc-jeux", title:"Optimisation PC & jeux", icon:"Gauge", description:"Analyse et amélioration des performances de votre PC, jeu ou environnement.", price_label:"À partir de 29 €", active:true },
  { slug:"accompagnement-technique", title:"Accompagnement technique", icon:"LifeBuoy", description:"Aide au diagnostic, débogage et résolution de problèmes techniques.", price_label:"À partir de 19 €", active:true },
  { slug:"ui-design-web", title:"UI / Design web", icon:"PenTool", description:"Interfaces modernes et cohérentes pour donner une vraie identité à votre projet.", price_label:"Sur devis", active:true },
  { slug:"automatisation", title:"Automatisation", icon:"Bot", description:"Scripts et outils pour supprimer les tâches répétitives et gagner du temps.", price_label:"Sur devis", active:true },
];
const fallbackSites = [
  { slug:"sen", name:"S.E.N", full_name:"Shinobi Era Nations", type:"Naruto RP", description:"Une expérience communautaire Naruto RP avec boutique, services et univers dédié.", status:"Projet actif", accent:"Naruto", url:"https://daily76.wixsite.com/sen-naruto-rp-1", active:true },
  { slug:"echos-wl", name:"Echos WL", full_name:"Echos Whitelist", type:"GTA RP", description:"Serveur GTA RP Whitelist avec une identité immersive, une économie et un univers communautaire.", status:"Projet actif", accent:"GTA RP", url:"https://daily76.wixsite.com/echos-wl", active:true },
  { slug:"axion-shop", name:"Axion Shop", full_name:"Dev · Optimization · Vente", type:"Services & boutique", description:"Boutique orientée développement, ressources, mapping et optimisation PC / jeux vidéo.", status:"Projet actif", accent:"Digital", url:"https://daily76.wixsite.com/axion-shop", active:true },
];

export async function getCatalog(type) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("catalog_items").select("*").eq("type", type).eq("active", true).order("sort_order", { ascending:true });
    if (!error && data?.length) return data;
  } catch {}
  return type === "formation" ? fallbackFormations.map((x,i)=>({ ...x, type, sort_order:i, active:true })) : type === "service" ? fallbackServices.map((x,i)=>({ ...x, type, sort_order:i })) : fallbackSites.map((x,i)=>({ ...x, type, sort_order:i }));
}

export async function getCatalogItem(type, slug) {
  const items = await getCatalog(type);
  return items.find(item => item.slug === slug) || null;
}
