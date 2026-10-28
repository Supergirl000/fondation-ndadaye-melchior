import type { Picture } from "./models";

/** Supplied AI illustrations, distinct from documentary activity photographs. */
export const foundationIllustrations = {
  community: { provenance: "ai-illustration", src: "/images/fondation/hero-communaute.webp", width: 1536, height: 365, alt: "Illustration IA : des femmes et des hommes réunis face à un paysage au coucher du soleil" },
  dialogue: { provenance: "ai-illustration", src: "/images/fondation/dialogue-citoyen.webp", width: 535, height: 306, alt: "Illustration IA : une femme prend la parole dans un groupe de discussion citoyenne" },
  justice: { provenance: "ai-illustration", src: "/images/fondation/droits-humains-justice.webp", width: 514, height: 306, alt: "Illustration IA symbolique : une balance de justice et des livres" },
  development: { provenance: "ai-illustration", src: "/images/fondation/developpement-durable.webp", width: 467, height: 306, alt: "Illustration IA : plusieurs mains réunies autour d’un jeune arbre" },
  solidarity: { provenance: "ai-illustration", src: "/images/fondation/solidarite-ensemble.webp", width: 334, height: 306, alt: "Illustration IA : des mains superposées en signe de solidarité" },
} satisfies Record<string, Picture>;

export const homepageEditorial = {
  hero: {
    eyebrow: "DROITS HUMAINS · DÉMOCRATIE · DÉVELOPPEMENT DURABLE",
    title: "Des communautés",
    emphasis: "plus justes,",
    continuation: "plus fortes",
    ending: "et plus durables.",
    description: "La Fondation NDADAYE Melchior œuvre pour la promotion des droits humains, de la démocratie et du développement durable.",
  },
  pillars: [
    { title: "Droits humains", description: "Promouvoir la dignité, l’égalité et le respect des droits fondamentaux." },
    { title: "Démocratie", description: "Encourager la participation citoyenne et les valeurs démocratiques." },
    { title: "Développement durable", description: "Contribuer à un avenir inclusif et durable." },
  ],
  engagements: [
    { title: "La dignité, pour chacun.", category: "DROITS HUMAINS", image: foundationIllustrations.justice },
    { title: "Chaque voix compte.", category: "PARTICIPATION CITOYENNE", image: foundationIllustrations.dialogue },
    { title: "Un avenir à construire.", category: "DÉVELOPPEMENT DURABLE", image: foundationIllustrations.development },
    { title: "La force du collectif.", category: "SOLIDARITÉ", image: foundationIllustrations.solidarity },
  ],
};

