import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { HomePage } from "./pages/HomePage";
import { SiteLayout, RouteError, LoadingPage } from "./components/SiteLayout";
import { contentRepository } from "./services/content";
import { organization } from "./config/organization";
import "./styles.css";
import "./public-pages.css";
import "./quality.css";
import "./foundation.css";
import "./homepage.css";

Object.entries(organization.colors).forEach(([name, color]) =>
  document.documentElement.style.setProperty(`--${name}`, color),
);
const router = createBrowserRouter([
  {
    path: "/demo-admin",
    lazy: () => import("./pages/AdminPage"),
    HydrateFallback: LoadingPage,
    errorElement: <RouteError />,
  },
  {
    path: "/",
    Component: SiteLayout,
    HydrateFallback: LoadingPage,
    errorElement: (
      <SiteLayout>
        <RouteError />
      </SiteLayout>
    ),
    children: [
      {
        index: true,
        loader: ({ request }) => contentRepository.getHome(request.signal),
        Component: HomePage,
        errorElement: <RouteError />,
      },
      {
        path: "a-propos",
        loader: ({ request }) => contentRepository.getAbout(request.signal),
        lazy: async () => ({
          Component: (await import("./pages/AboutPage")).AboutPage,
        }),
        errorElement: <RouteError />,
      },
      {
        path: "projets",
        loader: ({ request }) => contentRepository.getProjects(request.signal),
        lazy: async () => ({
          Component: (await import("./pages/ProjectsPage")).ProjectsPage,
        }),
        errorElement: <RouteError />,
      },
      {
        path: "projets/:slug",
        loader: async ({ params, request }) => {
          const project = await contentRepository.getProject(
            params.slug!,
            request.signal,
          );
          if (!project)
            throw new Response("Projet introuvable", { status: 404 });
          return project;
        },
        lazy: async () => ({
          Component: (await import("./pages/ProjectDetailPage"))
            .ProjectDetailPage,
        }),
        errorElement: <RouteError />,
      },
      {
        path: "actualites",
        loader: ({ request }) => contentRepository.getArticles(request.signal),
        lazy: async () => ({
          Component: (await import("./pages/NewsPage")).NewsPage,
        }),
        errorElement: <RouteError />,
      },
      {
        path: "actualites/:slug",
        loader: async ({ params, request }) => {
          const article = await contentRepository.getArticle(
            params.slug!,
            request.signal,
          );
          if (!article)
            throw new Response("Article introuvable", { status: 404 });
          return article;
        },
        lazy: async () => ({
          Component: (await import("./pages/NewsDetailPage")).NewsDetailPage,
        }),
        errorElement: <RouteError />,
      },
      {
        path: "galerie",
        loader: ({ request }) => contentRepository.getGallery(request.signal),
        lazy: async () => ({
          Component: (await import("./pages/GalleryPage")).GalleryPage,
        }),
        errorElement: <RouteError />,
      },
      {
        path: "contact",
        lazy: async () => ({
          Component: (await import("./pages/ContactPage")).ContactPage,
        }),
      },
      { path: "*", element: <RouteError notFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
