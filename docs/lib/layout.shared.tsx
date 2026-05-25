import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "wfirma-sdk",
    },
    links: [
      {
        text: "GitHub",
        url: "https://github.com/orafal-dev/wfirma-sdk",
        external: true,
      },
      {
        text: "wFirma API",
        url: "https://doc.wfirma.pl/",
        external: true,
      },
    ],
  };
}
