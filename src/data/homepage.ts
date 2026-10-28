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
    eyebrow: "UNE FONDATION POUR LA DIGNITÉ ET L’AVENIR",
    title: "La dignité de tous.",
    emphasis: "Un avenir",
    ending: "à construire ensemble.",
    description: "La Fondation NDADAYE Melchior œuvre pour la promotion des droits humains, de la démocratie et du développement durable.",
  },
  pillars: [
    { title: "Droits humains", description: "La dignité, l’égalité et les droits de chacun." },
    { title: "Démocratie", description: "La voix des citoyens et la participation de tous." },
    { title: "Développement durable", description: "Des communautés résilientes et un avenir partagé." },
  ],
  engagements: [
    { title: "La dignité, pour chacun.", category: "DROITS HUMAINS", image: foundationIllustrations.justice },
    { title: "Chaque voix compte.", category: "PARTICIPATION CITOYENNE", image: foundationIllustrations.dialogue },
    { title: "Un avenir à construire.", category: "DÉVELOPPEMENT DURABLE", image: foundationIllustrations.development },
    { title: "La force du collectif.", category: "SOLIDARITÉ", image: foundationIllustrations.solidarity },
  ],
};

