export type GalleryImage = {
  src: string;
  alt: string;
};

export type Gallery = {
  title: string;
  description: string;
  images: GalleryImage[];
};

export const galleries = {
  musica: {
    title: "Música en vivo",
    description:
      "Registros de las interpretaciones de cámara y los momentos musicales que dan forma a cada tertulia.",
    images: [
      {
        src: "/galeria/musica/placeholder-1.svg",
        alt: "Escena de música en vivo en Tertulias Criollas"
      },
      {
        src: "/galeria/musica/placeholder-2.svg",
        alt: "Detalle de intérpretes durante una velada íntima"
      },
      {
        src: "/galeria/musica/placeholder-3.svg",
        alt: "Ambiente musical de cámara en residencia privada"
      }
    ]
  },
  arte: {
    title: "Arte",
    description:
      "Un recorrido visual por obras, texturas y espacios intervenidos que acompañan la experiencia.",
    images: [
      {
        src: "/galeria/arte/placeholder-1.svg",
        alt: "Obras de arte expuestas en Tertulias Criollas"
      },
      {
        src: "/galeria/arte/placeholder-2.svg",
        alt: "Detalle de una pieza artística en la residencia"
      },
      {
        src: "/galeria/arte/placeholder-3.svg",
        alt: "Recorrido visual por la exposición"
      }
    ]
  },
  gastronomia: {
    title: "Gastronomía",
    description:
      "Imágenes de la degustación, los vinos seleccionados y la mesa pensada para una velada exclusiva.",
    images: [
      {
        src: "/galeria/gastronomia/placeholder-1.svg",
        alt: "Mesa de degustación gastronómica"
      },
      {
        src: "/galeria/gastronomia/placeholder-2.svg",
        alt: "Detalle de una propuesta culinaria argentina"
      },
      {
        src: "/galeria/gastronomia/placeholder-3.svg",
        alt: "Vinos seleccionados para la experiencia"
      }
    ]
  }
} as const satisfies Record<string, Gallery>;
