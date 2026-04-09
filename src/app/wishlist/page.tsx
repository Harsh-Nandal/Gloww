import { Metadata } from "next";
import Wrapper from "@/layouts/wrapper";
import Header from "@/layouts/header/header";
import FeatureArea from "@/components/feature/feature-area";
import BreadcrumbTwo from "@/components/breadcrumb/breadcrumb-2";
import WishlistArea from "@/components/wishlist/wishlist-area";
import Footer from "@/layouts/footer/footer";

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "Wishlist - Your Store",
  description: "View your saved products in wishlist",
};

export default function WishlistPage() {
  return (
    <Wrapper>

      {/* HEADER */}
      <Header />

      <main>

        {/* BREADCRUMB */}
        <BreadcrumbTwo title="Wishlist" />

        {/* WISHLIST AREA */}
        <WishlistArea />

        {/* FEATURES */}
        <FeatureArea style_2={true} />

      </main>

      {/* FOOTER */}
      <Footer />

    </Wrapper>
  );
}