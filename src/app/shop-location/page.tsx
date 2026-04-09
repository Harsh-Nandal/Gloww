import Wrapper from "@/layouts/wrapper";
import Header from "@/layouts/header/header";
import FeatureArea from "@/components/feature/feature-area";
import Footer from "@/layouts/footer/footer";
import { Metadata } from "next";
import BreadcrumbArea from "@/components/breadcrumb/breadcrumb-area";
import LocationArea from "@/components/location/location-area";

export const metadata: Metadata = {
  title: "Shop Location - Orfarm",
};

export default function ShopLocationPage() {
  return (
    <Wrapper>
      {/* header start */}
      <Header />
      {/* header end */}

      <main>
        {/* breadcrumb-area-start */}
        <BreadcrumbArea title="Shop Location" subtitle="Shop Location" />
        {/* breadcrumb-area-end */}

        {/* location area start */}
        <LocationArea />
        {/* location area end */}

        {/* feature area start */}
        <FeatureArea style_2={true} />
        {/* feature area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
