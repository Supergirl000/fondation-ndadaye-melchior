import { homeContent, type HomeContent } from "../data/home";
import { aboutContent } from "../data/public";
import { readDemoState, seedState } from "./demo-db";
import { reportStorageIssue } from "./demo-events";
import { foundationIllustrations } from "../data/homepage";

/** Homepage editorial artwork for the original stock-photo demo articles only.
 * Uploaded images and unrelated local articles always retain their own artwork.
 */
const demoNewsArtwork = {
  "premiers-pas": foundationIllustrations.community,
  idees: foundationIllustrations.dialogue,
  nature: foundationIllustrations.development,
};

async function publicState(signal?: AbortSignal) {
  signal?.throwIfAborted();
  try {
    const state = await readDemoState();
    signal?.throwIfAborted();
    reportStorageIssue(false);
    return state;
  } catch (error) {
    if (signal?.aborted) throw error;
    reportStorageIssue(true);
    return seedState();
  }
}
import type {
  AboutContent,
  Project,
  NewsArticle,
  GalleryItem,
} from "../data/models";

/** Replace this adapter with validated Laravel API responses when implementing the backend. */
export interface ContentRepository {
  getHome(signal?: AbortSignal): Promise<HomeContent>;
  getAbout(signal?: AbortSignal): Promise<AboutContent>;
  getProjects(signal?: AbortSignal): Promise<Project[]>;
  getProject(slug: string, signal?: AbortSignal): Promise<Project | undefined>;
  getArticles(signal?: AbortSignal): Promise<NewsArticle[]>;
  getArticle(
    slug: string,
    signal?: AbortSignal,
  ): Promise<NewsArticle | undefined>;
  getGallery(signal?: AbortSignal): Promise<GalleryItem[]>;
}
export const contentRepository: ContentRepository = {
  async getHome(signal) {
    signal?.throwIfAborted();
    const state = await publicState(signal);
    return {
      ...homeContent,
      projects: { ...homeContent.projects, items: state.projects.filter((project) => project.contentStatus === "confirmed") },
      news: { ...homeContent.news, items: state.articles.slice(0, 3).map((article) => {
        const illustration = demoNewsArtwork[article.id as keyof typeof demoNewsArtwork];
        const originalStockImage = /^\/images\/(garden|forest|growing)(\.jpg|-1400\.webp)$/.test(article.image.src);
        return illustration && originalStockImage && !article.image.assetId
          ? { ...article, image: illustration }
          : article;
      }) },
      gallery: {
        ...homeContent.gallery,
        images: state.gallery.slice(0, 3).map((item) => item.image),
        items: state.gallery.slice(0, 3),
      },
    };
  },
  async getAbout(signal) {
    signal?.throwIfAborted();
    return aboutContent;
  },
  async getProjects(signal) {
    signal?.throwIfAborted();
    return (await publicState(signal)).projects;
  },
  async getProject(slug, signal) {
    signal?.throwIfAborted();
    return (await publicState(signal)).projects.find(
      (item) => item.slug === slug,
    );
  },
  async getArticles(signal) {
    signal?.throwIfAborted();
    return (await publicState(signal)).articles;
  },
  async getArticle(slug, signal) {
    signal?.throwIfAborted();
    return (await publicState(signal)).articles.find(
      (item) => item.slug === slug,
    );
  },
  async getGallery(signal) {
    signal?.throwIfAborted();
    return (await publicState(signal)).gallery;
  },
};
