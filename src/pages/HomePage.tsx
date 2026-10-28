import {
  Hero,
  Pillars,
  Engagements,
  Mission,
  Initiatives,
  Journal,
  Participation,
} from "../components/HomeRedesign";
import { useLoaderData } from "react-router";
import type { HomeContent } from "../data/home";
import { usePageMetadata } from "../components/SiteLayout";
import { organization } from "../config/organization";

export function HomePage() {
  const data = useLoaderData() as HomeContent;
  usePageMetadata("Accueil", organization.mission);
  return (
    <>
      <main id="main" tabIndex={-1} className="foundation-home">
        <Hero />
        <Pillars />
        <Mission />
        <Engagements />
        <Initiatives data={data} />
        <Journal data={data} />
        <Participation />
      </main>
    </>
  );
}
