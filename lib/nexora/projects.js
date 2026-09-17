import { createClient } from "../supabase/server";

const fallbackProjects = [
  {slug:"echos-wl",title:"Echos RP",category:"FiveM · GTA RP",description:"Serveur GTA RP Whitelist avec une identité immersive, une économie et un univers communautaire.",status:"Projet actif",accent:"FiveM",url:"https://daily76.wixsite.com/echos-wl",image_url:"",active:true,sort_order:1},
  {slug:"sen",title:"S.E.N",category:"GMod · Naruto RP",description:"Projet Naruto RP orienté communauté, univers, systèmes de jeu et expérience immersive.",status:"Projet actif",accent:"GMod",url:"https://daily76.wixsite.com/sen-naruto-rp-1",image_url:"",active:true,sort_order:2},
  {slug:"axion-shop",title:"Axion Shop",category:"Web · Digital",description:"Boutique orientée développement, ressources, mapping et optimisation PC / jeux vidéo.",status:"Projet actif",accent:"Digital",url:"https://daily76.wixsite.com/axion-shop",image_url:"",active:true,sort_order:3}
];

export async function getProjects(){
  try{
    const supabase=await createClient();
    const {data,error}=await supabase.from("projects").select("*").eq("active",true).order("sort_order",{ascending:true}).order("created_at",{ascending:false});
    if(!error && data?.length) return data;
  }catch{}
  return fallbackProjects;
}
