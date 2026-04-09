import { Metadata } from "next";
import Wrapper from "@/layouts/wrapper";
import Header from "@/layouts/header/header";
import FeatureArea from "@/components/feature/feature-area";
import Footer from "@/layouts/footer/footer";
import BreadcrumbThree from "@/components/breadcrumb/breadcrumb-3";
import BlogDetailsArea from "@/components/blogs/details/blog-details-area";
import blog_data from "@/data/blog-data";

export const metadata: Metadata = {
  title: "Blog Details - Orfarm",
};

export default function BlogDetailsPage() {
  const blog = [...blog_data][0];
  return (
    <Wrapper>
      {/* header start */}
      <Header />
      {/* header end */}

      <main>
        {/* breadcrumb area start */}
        <BreadcrumbThree
          category={blog.category}
          title={blog.title}
        />
        {/* breadcrumb area end */}

        {/* blog details start */}
        <BlogDetailsArea blog={blog} />
        {/* blog details end */}

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
