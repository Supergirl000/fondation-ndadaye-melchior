import type { Project } from "./models";

/** Only facts supplied in the foundation's brief. No photographs were attached. */
export const schoolKitsActivity: Project = {
  id: "distribution-kits-scolaires",
  slug: "distribution-kits-scolaires",
  contentStatus: "confirmed",
  featured: true,
  category: "Éducation et solidarité",
  title: "Distribution de kits scolaires aux élèves",
  description:
    "La Fondation NDADAYE Melchior a procédé à une remise de kits scolaires à des élèves.",
  image: {
    src: "/images/fondation/school-kits-pending.svg",
    alt: "Emplacement réservé : les photographies de cette activité ne sont pas encore fournies ni autorisées pour publication.",
  },
  detail:
    "Activité confirmée par les informations transmises par la Fondation NDADAYE Melchior. Les photographies de l’activité et la confirmation de leurs autorisations de publication restent à fournir.",
  status: "Activité confirmée · Photographies en attente",
  intention: "Fondation NDADAYE Melchior",
  blocks: [
    {
      heading: "Une activité de la Fondation",
      paragraphs: [
        "La Fondation NDADAYE Melchior a procédé à une remise de kits scolaires à des élèves.",
      ],
    },
    {
      heading: "Les photographies de cette activité",
      paragraphs: [
        "Les photographies n’ont pas encore été fournies pour cette intégration. Leur mise à disposition et la confirmation des autorisations de publication sont nécessaires avant tout ajout au build public. Aucune identité d’élève n’est publiée.",
      ],
    },
  ],
  gallery: [],
};

/** New seed entry is merged by stable ID; existing locally created content is retained. */
export function withFoundationActivity(projects: Project[]): Project[] {
  if (projects.some((item) => item.id === schoolKitsActivity.id))
    return projects;
  return [structuredClone(schoolKitsActivity), ...projects];
}
