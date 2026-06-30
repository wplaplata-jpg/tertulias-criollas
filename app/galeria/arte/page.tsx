import { GalleryPage } from "@/components/gallery-page";
import { galleries } from "@/lib/gallery";

export default function ArteGalleryPage() {
  return <GalleryPage gallery={galleries.arte} />;
}
