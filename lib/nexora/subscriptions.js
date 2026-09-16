import { createClient } from "../supabase/server";

const fallbackSubscriptions = [
  {
    slug: "essentiel",
    name: "Essentiel",
    description: "L'essentiel de Nexora pour avancer sur vos projets sans vous compliquer la vie.",
    price: 9.90,
    price_label: "9,90 € / mois",
    billing_period: "mois",
    features: ["Accès aux ressources Nexora", "Suivi des demandes", "Support standard"],
    highlighted: false,
    active: true,
    sort_order: 1,
  },
  {
    slug: "pro",
    name: "Pro",
    description: "Plus d'accompagnement et de possibilités pour les projets qui vont plus loin.",
    price: 19.90,
    price_label: "19,90 € / mois",
    billing_period: "mois",
    features: ["Tout l'offre Essentiel", "Support prioritaire", "Accompagnement renforcé", "Avantages sur certaines prestations"],
    highlighted: true,
    active: true,
    sort_order: 2,
  },
];

export async function getSubscriptions() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (!error && data?.length) return data.slice(0, 5);
  } catch {}
  return fallbackSubscriptions;
}

export { fallbackSubscriptions };
