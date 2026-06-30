import { GalleryPage } from "@/components/gallery-page";
import { galleries } from "@/lib/gallery";

export default function MusicaGalleryPage() {
  return <GalleryPage gallery={galleries.musica} />;
}
