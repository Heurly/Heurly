import { Inter } from "next/font/google";
import "@/styles/globals.css";
import cn from "classnames";
const inter = Inter({ subsets: ["latin"] });
import type { Metadata, Viewport } from "next";

const APP_NAME = "Heurly";
const APP_DEFAULT_TITLE = "Heurly";
const APP_TITLE_TEMPLATE = "%s - heurly.fr";
const APP_DESCRIPTION = "Social platform for university students.";

export const metadata: Metadata = {
    manifest: "/manifest.json",
    applicationName: APP_NAME,
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: APP_DEFAULT_TITLE,
        // startUpImage: [],
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: "website",
        siteName: APP_NAME,
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
    twitter: {
        card: "summary",
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
};

export const viewport: Viewport = {
    themeColor: "#E0F2FE",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body className={cn(inter.className, "bg-sky-100")}>
                {children}
            </body>
        </html>
    );
}
