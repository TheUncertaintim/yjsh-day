import Gallery from "@/components/gallery";
import PhotoHandler from "@/components/photo-handler";

export default function Photos() {
  return (
    <section>
      <p>
        Yu-Jeng doesn&apos;t have Instagram, therefore there is no “Wedding
        Hashtag”, so I (Shao Hui) can&apos;t ask you to tag us on Instagram.
      </p>
      <p>
        INSTEAD! Share with us your perspective of the day - Photos of you,
        photos of us, memories of this day to last a lifetime.
      </p>
      <PhotoHandler />
      <hr />
      <Gallery />
    </section>
  );
}
