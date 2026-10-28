import type { Picture, Initiative, Article, GalleryItem } from "./models";
export type { Picture, Initiative, Article } from "./models";

export interface HomeContent {
  navigation: { label: string; href: string }[];
  hero: {
    eyebrow: string;
    title: string;
    emphasis: string;
    description: string;
    primary: string;
    secondary: string;
    image: Picture;
    caption: string;
  };
  mission: {
    eyebrow: string;
    title: string;
    values: { title: string; description: string }[];
  };
  projects: {
    eyebrow: string;
    title: string;
    description: string;
    items: Initiative[];
  };
  story: {
    eyebrow: string;
    title: string;
    description: string;
    body: string;
    image: Picture;
    action: string;
  };
  news: { eyebrow: string; title: string; items: Article[] };
  gallery: {
    items?: GalleryItem[];
    eyebrow: string;
    title: string;
    description: string;
    images: Picture[];
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    action: string;
    notice: string;
  };
  demoNotice: string;
}

const garden: Picture = {
  src: "/images/garden-1400.webp",
  srcSet:
    "/images/garden-480.webp 480w, /images/garden-960.webp 960w, /images/garden-1400.webp 1400w",
  width: 1400,
  height: 933,
  alt: "Illustration : une pelle à main et des pots de terreau sur une table de jardinage",
};
const forest: Picture = {
  src: "/images/forest-1400.webp",
  srcSet:
    "/images/forest-480.webp 480w, /images/forest-960.webp 960w, /images/forest-1400.webp 1400w",
  width: 1400,
  height: 933,
  alt: "Illustration : la lumière traverse une forêt verdoyante",
};
const growing: Picture = {
  src: "/images/growing-1400.webp",
  srcSet:
    "/images/growing-480.webp 480w, /images/growing-960.webp 960w, /images/growing-1400.webp 1400w",
  width: 1400,
  height: 934,
  alt: "Illustration : des paniers de carottes, de concombres et de piments frais",
};

export const homeContent: HomeContent = {
  demoNotice: "Site de démonstration · Identité de la Fondation intégrée",
  navigation: [
    { label: "Notre esprit", href: "/a-propos" },
    { label: "Les initiatives", href: "/projets" },
    { label: "Le journal", href: "/actualites" },
    { label: "La galerie", href: "/galerie" },
  ],
  hero: {
    eyebrow: "DROITS HUMAINS · DÉMOCRATIE · DÉVELOPPEMENT DURABLE",
    title: "Fondation",
    emphasis: "NDADAYE Melchior",
    description:
      "Promouvoir les droits humains, la démocratie et le développement durable.",
    primary: "Explorer les initiatives",
    secondary: "Faire connaissance",
    image: garden,
    caption: "Cultiver les liens. Faire éclore les possibles.",
  },
  mission: {
    eyebrow: "01 / NOTRE ESPRIT",
    title: "Notre mission\nofficielle.",
    values: [
      {
        title: "Écouter d’abord",
        description:
          "Faire une place aux idées, aux besoins et à la singularité de chacun.",
      },
      {
        title: "Agir ensemble",
        description:
          "Croiser les regards et les savoir-faire pour donner vie aux idées.",
      },
      {
        title: "Faire durer",
        description:
          "Imaginer des actions attentives aux personnes et à leur environnement.",
      },
    ],
  },
  projects: {
    eyebrow: "02 / LES INITIATIVES",
    title: "Des idées qui\nprennent racine.",
    description:
      "Une activité confirmée de la Fondation, présentée aux côtés de projets de démonstration clairement identifiés.",
    items: [
      {
        id: "jardins",
        category: "ENVIRONNEMENT",
        title: "Cultiver un jardin commun",
        description: "Un lieu pour apprendre, planter et se retrouver.",
        image: growing,
        detail:
          "Exemple de projet : imaginer un jardin partagé où se rencontrent les générations. Les objectifs, le lieu, le calendrier et les partenaires restent à définir avec l’association.",
      },
      {
        id: "savoirs",
        category: "TRANSMISSION",
        title: "Faire circuler les savoirs",
        description: "Des rencontres pour apprendre les uns des autres.",
        image: garden,
        detail:
          "Exemple de projet : proposer des ateliers de partage de connaissances et de savoir-faire. Les thèmes et modalités seront définis à partir de la mission officielle.",
      },
      {
        id: "vivant",
        category: "LIEN AU VIVANT",
        title: "Retrouver le goût du dehors",
        description: "Prendre le temps de découvrir ce qui nous entoure.",
        image: forest,
        detail:
          "Exemple de projet : concevoir des moments de découverte de la nature, ouverts au dialogue et à l’observation. Aucune activité réelle ni inscription n’est annoncée à ce stade.",
      },
    ],
  },
  story: {
    eyebrow: "03 / LES HISTOIRES QUI RELIENT",
    title: "Et si tout partait\nd’une rencontre ?",
    description:
      "Une conversation. Une idée partagée. Et l’envie de faire un premier pas, ensemble.",
    body: "Cet espace accueillera les voix et les récits de votre association. Pour l’instant, il esquisse une façon de raconter : avec simplicité, avec sens, et toujours à hauteur humaine.",
    image: forest,
    action: "Découvrir l’intention",
  },
  news: {
    eyebrow: "04 / LE JOURNAL",
    title: "La vie en mouvement.",
    items: [
      {
        id: "premiers-pas",
        category: "LA VIE ASSOCIATIVE",
        title: "Les premiers pas d’une aventure collective",
        description:
          "Exemple d’article : raconter la naissance de l’association, ses rencontres et ses aspirations. Ce texte sera remplacé par une actualité officielle.",
        image: growing,
      },
      {
        id: "idees",
        category: "CARNET D’IDÉES",
        title: "Prendre le temps de faire ensemble",
        description:
          "Exemple d’article : ouvrir une réflexion sur l’entraide et les façons de participer. Aucun événement réel n’est annoncé.",
        image: garden,
      },
      {
        id: "nature",
        category: "REGARD SUR LE VIVANT",
        title: "Ce que la nature nous apprend du lien",
        description:
          "Exemple d’article : proposer un regard sensible sur notre environnement. Le contenu éditorial définitif sera fourni par l’association.",
        image: forest,
      },
    ],
  },
  gallery: {
    eyebrow: "05 / INSTANTS PARTAGÉS",
    title: "Un autre regard.",
    description:
      "Un carnet visuel d’inspiration. Ces photographies d’illustration ne représentent pas l’association.",
    images: [forest, garden, growing],
  },
  contact: {
    eyebrow: "LA SUITE S’ÉCRIT ENSEMBLE",
    title: "Et vous, quelle envie\nvous anime ?",
    description:
      "Du temps, une idée, un savoir-faire ou simplement l’envie d’échanger. Chaque rencontre peut être un point de départ.",
    action: "Ouvrir la conversation",
    notice:
      "Prototype : les coordonnées officielles seront ajoutées prochainement. Aucun message n’est collecté.",
  },
};
