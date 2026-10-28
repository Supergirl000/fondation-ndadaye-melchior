import { homeContent } from "./home";
import type { AboutContent, GalleryItem, NewsArticle, Project } from "./models";

export const publicNavigation = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  { label: "Nos actions", href: "/projets" },
  { label: "Actualités", href: "/actualites" },
  { label: "Galerie", href: "/galerie" },
  { label: "Contact", href: "/contact" },
];

const [forest, garden, growing] = homeContent.gallery.images;
export const galleryItems: GalleryItem[] = [
  {
    id: "sous-les-arbres",
    title: "Sous les arbres",
    category: "Le vivant",
    image: forest,
    caption:
      "Une lumière, un chemin, une invitation à observer. Photographie d’illustration, sans lien avec une activité réelle.",
  },
  {
    id: "premiers-gestes",
    title: "Les premiers gestes",
    category: "Les gestes",
    image: garden,
    caption:
      "Terreau et outils de jardinage : une image d’inspiration pour les idées qui commencent.",
  },
  {
    id: "couleurs-recolte",
    title: "Les couleurs du quotidien",
    category: "Les matières",
    image: growing,
    caption:
      "Des paniers de légumes pour évoquer le partage. Ce visuel ne documente aucune récolte de l’association.",
  },
  {
    id: "lumiere",
    title: "Laisser entrer la lumière",
    category: "Le vivant",
    image: { ...forest, position: "25% center" },
    caption:
      "Autre cadrage de la photographie de forêt : un regard sur les détails du vivant.",
  },
  {
    id: "terre",
    title: "Tout commence par la terre",
    category: "Les gestes",
    image: { ...garden, position: "75% center" },
    caption:
      "Détail de la photographie de jardinage. Une matière, une texture, un point de départ.",
  },
  {
    id: "nuances",
    title: "Une palette à partager",
    category: "Les matières",
    image: { ...growing, position: "20% center" },
    caption:
      "Détail de la photographie de légumes. Une composition d’illustration aux couleurs naturelles.",
  },
];

const projectBlocks = [
  [
    {
      heading: "Un lieu pour se retrouver",
      paragraphs: [
        "Dans ce scénario fictif, un jardin partagé serait un prétexte pour réunir les personnes autour d’une activité simple : prendre soin d’un espace commun. Il pourrait accueillir la curiosité, les échanges et les essais, sans prérequis.",
        "Le projet commencerait par l’écoute des envies et des contraintes. Aucun lieu, calendrier ou public bénéficiaire n’est confirmé dans ce prototype.",
      ],
    },
    {
      heading: "Apprendre au rythme du vivant",
      paragraphs: [
        "Observer la terre, choisir des plantations, découvrir les saisons : autant de pistes d’ateliers à construire avec l’association. Les activités seraient adaptées aux ressources et aux besoins qui auront été identifiés.",
      ],
    },
    {
      heading: "La suite à imaginer",
      paragraphs: [
        "Une fiche officielle précisera les objectifs, les modalités de participation et les personnes à contacter. Cette proposition ne décrit aucun résultat déjà obtenu.",
      ],
    },
  ],
  [
    {
      heading: "Chacun a quelque chose à transmettre",
      paragraphs: [
        "Cette initiative fictive explore une idée : créer des temps où les savoir-faire circulent librement. Un geste de jardinage, une méthode d’organisation ou une pratique créative pourraient devenir le point de départ d’un atelier.",
        "Le programme serait construit à partir des propositions recueillies. Aucun atelier n’est actuellement annoncé ni ouvert à l’inscription.",
      ],
    },
    {
      heading: "Une place pour apprendre et essayer",
      paragraphs: [
        "Des formats simples, des groupes à taille adaptée et des supports accessibles pourraient faciliter la participation. La forme définitive dépendra de la mission et des moyens réels de l’association.",
      ],
    },
    {
      heading: "Construire le programme ensemble",
      paragraphs: [
        "Les thèmes, le cadre et les intervenants seraient précisés avant tout lancement. Aucun partenaire ni membre réel n’est associé à cet exemple.",
      ],
    },
  ],
  [
    {
      heading: "Observer avant d’agir",
      paragraphs: [
        "Cette piste fictive propose de retrouver une attention au dehors. Une promenade d’observation pourrait offrir un espace pour regarder, écouter et parler de notre relation au vivant.",
        "Le parcours, les conditions d’accès et l’encadrement seraient définis avant toute proposition officielle. Aucune sortie réelle n’est annoncée.",
      ],
    },
    {
      heading: "Des découvertes à hauteur humaine",
      paragraphs: [
        "Le scénario privilégie la curiosité plutôt que la performance. Des supports d’observation et des temps de pause pourraient laisser une place à différents rythmes et façons de participer.",
      ],
    },
    {
      heading: "Une intention à préciser",
      paragraphs: [
        "Cette présentation ouvre une conversation. Les objectifs pédagogiques et les modalités pratiques restent à construire avec l’association.",
      ],
    },
  ],
];

export const projects: Project[] = homeContent.projects.items.map(
  (project, index) => ({
    ...project,
    slug: project.id,
    featured: index === 0,
    status: "Scénario fictif · À imaginer",
    intention: [
      "Créer un espace commun autour du jardinage.",
      "Partager ce que l’on sait, découvrir ce que l’on peut apprendre.",
      "Ouvrir un espace de découverte et d’attention à la nature.",
    ][index],
    blocks: projectBlocks[index],
    gallery: [galleryItems[[2, 1, 0][index]], galleryItems[[1, 4, 3][index]]],
  }),
);

const articleBlocks = [
  [
    {
      heading: "Avant le premier pas, une question",
      paragraphs: [
        "Que pourrait-on faire ensemble que l’on n’imaginerait pas seul ? Ce récit de démonstration part de cette question pour esquisser la naissance possible d’un collectif.",
        "Il ne raconte pas l’histoire réelle de l’association. Il présente une intention éditoriale : donner une place aux idées, aux hésitations et aux rencontres qui accompagnent un commencement.",
      ],
    },
    {
      heading: "Écouter les envies",
      paragraphs: [
        "Une conversation peut faire émerger des besoins différents : apprendre, proposer une idée, transmettre un geste ou simplement rencontrer d’autres personnes. Dans ce scénario, le premier travail consisterait à accueillir ces envies sans écrire le projet à l’avance.",
      ],
    },
    {
      heading: "Laisser une place à la suite",
      paragraphs: [
        "Le récit officiel viendra des personnes qui font vivre l’association. Leurs mots, leurs images et leur accord donneront à cette page son contenu définitif. En attendant, ce texte demeure entièrement fictif.",
      ],
    },
  ],
  [
    {
      heading: "La valeur d’un temps partagé",
      paragraphs: [
        "Faire ensemble ne commence pas toujours par un grand projet. Une tâche simple peut suffire à ouvrir un échange. Cet article fictif explore cette idée, sans décrire un événement réellement organisé.",
      ],
    },
    {
      heading: "Accueillir différents rythmes",
      paragraphs: [
        "Prendre le temps, c’est aussi rendre possible la participation de personnes aux disponibilités et aux expériences différentes. Un cadre attentif pourrait permettre d’essayer, de poser une question ou de regarder avant de se lancer.",
        "Ces pistes ne constituent pas un programme d’activités. Elles pourront nourrir un futur contenu éditorial, à valider avec l’association.",
      ],
    },
    {
      heading: "Un carnet plutôt qu’une vitrine",
      paragraphs: [
        "Le journal pourrait documenter les questions autant que les réalisations, avec des faits vérifiés et des images autorisées. Ce prototype ne présente aucun résultat d’action ni témoignage.",
      ],
    },
  ],
  [
    {
      heading: "Porter attention à ce qui nous entoure",
      paragraphs: [
        "Une forêt change selon la lumière et les saisons. Regarder ces transformations peut inviter à ralentir et à porter attention aux relations entre les êtres et leur milieu.",
        "Ce texte est une proposition de réflexion fictive. La photographie qui l’accompagne provient d’une banque d’images et ne représente pas un territoire d’intervention de l’association.",
      ],
    },
    {
      heading: "Apprendre à regarder ensemble",
      paragraphs: [
        "Partager une observation peut ouvrir une conversation : qu’a-t-on remarqué, qu’a-t-on envie de comprendre ? Le sujet peut devenir une façon de croiser les regards, sans chercher une réponse unique.",
      ],
    },
    {
      heading: "De l’inspiration au contenu officiel",
      paragraphs: [
        "La ligne éditoriale sera précisée avec l’association. Les futurs articles pourront alors s’appuyer sur ses expériences réelles, avec le consentement des personnes concernées.",
      ],
    },
  ],
];

export const articles: NewsArticle[] = homeContent.news.items.map(
  (article, index) => ({
    ...article,
    slug: article.id,
    featured: index === 0,
    publishedAt: ["2026-10-12", "2026-10-05", "2026-09-28"][index],
    author: "Rédaction de démonstration",
    readingMinutes: 3,
    blocks: articleBlocks[index],
  }),
);

export const aboutContent: AboutContent = {
  intro:
    "La Fondation NDADAYE Melchior a pour mission : promouvoir les droits humains, la démocratie et le développement durable. Les informations complémentaires de présentation restent à fournir par la Fondation.",
  vision:
    "La vision officielle n’a pas encore été communiquée. Cet espace sera complété avec les informations validées par la Fondation.",
  story: [
    {
      title: "Une question pour commencer.",
      body: "Et si une envie partagée devenait le début d’un projet commun ? Cette première étape est un fil narratif fictif, et non le récit de la fondation de l’association.",
    },
    {
      title: "Des regards qui se croisent.",
      body: "Le récit pourrait ensuite donner la parole aux personnes du collectif. Les témoignages, les dates et les moments réels seront ajoutés uniquement lorsqu’ils auront été fournis et validés.",
    },
    {
      title: "Une histoire encore ouverte.",
      body: "La suite reste à écrire. Cette page accueillera le parcours officiel de l’association, avec ses propres mots et ses photographies autorisées.",
    },
  ],
  team: [
    {
      id: "coordination",
      role: "Coordination",
      description:
        "Emplacement de démonstration pour présenter un rôle de coordination. Nom, portrait et fonction à confirmer.",
    },
    {
      id: "initiatives",
      role: "Vie des initiatives",
      description:
        "Emplacement de démonstration pour une personne impliquée dans les projets. Aucun membre réel n’est représenté.",
    },
    {
      id: "collectif",
      role: "Vie du collectif",
      description:
        "Emplacement de démonstration pour une présentation de l’équipe. La composition officielle reste à fournir.",
    },
  ],
};

export const pageCopy = {
  about: {
    eyebrow: "NOTRE ESPRIT / À PROPOS",
    title: "Ce qui nous lie.\nCe qui nous anime.",
    description:
      "La Fondation NDADAYE Melchior et sa mission officielle. Les éléments non fournis restent des emplacements de démonstration.",
  },
  projects: {
    eyebrow: "LES INITIATIVES / PROJETS",
    title: "Du lien à l’action.",
    description:
      "Découvrez l’activité confirmée de remise de kits scolaires. Les autres initiatives présentées restent des exemples de démonstration.",
  },
  news: {
    eyebrow: "LE JOURNAL / ACTUALITÉS",
    title: "Les mots du collectif.",
    description:
      "Un carnet d’idées, de regards et de commencements. Articles et dates de publication entièrement fictifs.",
  },
  gallery: {
    eyebrow: "LE CARNET VISUEL / GALERIE",
    title: "Nos actions\nen images",
    description:
      "Une collection est réservée à l’activité de remise de kits scolaires. Les visuels d’illustration sont identifiés séparément, en attendant les photographies autorisées.",
  },
  contact: {
    eyebrow: "FAISONS CONNAISSANCE / CONTACT",
    title: "Une conversation\npeut tout ouvrir.",
    description:
      "Une idée à partager, une envie de participer, une question à poser. Cet espace accueillera les coordonnées officielles de l’association.",
  },
};
