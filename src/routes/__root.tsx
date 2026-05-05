import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { ThemeProvider } from "@/lib/theme";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist.</p>
        <Link to="/" className="inline-flex mt-6 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Loom — Commerce Admin" },
      { name: "description", content: "Modern admin panel for D2C eCommerce stores." },
      { property: "og:title", content: "Loom — Commerce Admin" },
      { name: "twitter:title", content: "Loom — Commerce Admin" },
      { property: "og:description", content: "Modern admin panel for D2C eCommerce stores." },
      { name: "twitter:description", content: "Modern admin panel for D2C eCommerce stores." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/89d4a587-942b-4697-b53e-ee3d13d27399/id-preview-727a5bbc--e1e6c7e9-f1ad-4386-b83d-0aa6b74d5546.lovable.app-1777964871799.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/89d4a587-942b-4697-b53e-ee3d13d27399/id-preview-727a5bbc--e1e6c7e9-f1ad-4386-b83d-0aa6b74d5546.lovable.app-1777964871799.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: () => <Outlet />,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
