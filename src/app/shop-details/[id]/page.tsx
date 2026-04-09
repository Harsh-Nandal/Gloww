import { Metadata } from "next";
import Wrapper from "@/layouts/wrapper";
import Header from "@/layouts/header/header";
import FeatureArea from "@/components/feature/feature-area";
import BreadcrumbThree from "@/components/breadcrumb/breadcrumb-3";
import Footer from "@/layouts/footer/footer";
import ShopDetailsArea from "@/components/shop-details/shop-details-area";
import RelatedProducts from "@/components/product/related-products";

// ✅ dynamic metadata (optional upgrade)
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${params.id}`, {
      cache: "no-store",
    });
    const product = await res.json();

    return {
      title: product?.name || "Shop Details",
    };
  } catch {
    return { title: "Shop Details" };
  }
}

export default async function ShopDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // ✅ FETCH PRODUCT FROM DB
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${params.id}`,
    {
      cache: "no-store", // always fresh data
    }
  );

  const product = await res.json();

  // ✅ SAFETY CHECK
  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }

  return (
    <Wrapper>
      {/* header */}
      <Header />

      <main>
        {/* ✅ BREADCRUMB FIX */}
        <BreadcrumbThree
          title={product?.name}
          category={product?.category?.name || "Product"}
          bgClr="grey-bg"
        />

        {/* ✅ SHOP DETAILS */}
        <ShopDetailsArea product={product} />

        {/* ✅ RELATED PRODUCTS */}
        <RelatedProducts category={product?.category} />

        {/* feature */}
        <FeatureArea style_2={true} />
      </main>

      {/* footer */}
      <Footer />
    </Wrapper>
  );
}