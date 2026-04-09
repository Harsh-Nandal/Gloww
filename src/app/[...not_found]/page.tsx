import { Metadata } from "next";
import Image from "next/image";
import Wrapper from "@/layouts/wrapper";
import Header from "@/layouts/header/header";
import FeatureArea from "@/components/feature/feature-area";
import Footer from "@/layouts/footer/footer";
import error_bg from '@/assets/img/shape/erorr-bg.png';
import error_shape from '@/assets/img/shape/erorr-shape.png';
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not Found - Orfarm",
};

export default function NotFound() {
  return (
    <Wrapper>
      {/* header start */}
      <Header />
      {/* header end */}

      <main>
        {/* not found area start */}
        <section className="error-area pt-80 pb-80">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xxl-6 col-lg-8 col-md-11">
                <div className="tperror__wrapper text-center">
                  <div className="tperror__thumb p-relative mb-55">
                    <Image src={error_bg} alt="error-bg" style={{height: 'auto'}} />
                    <div className="tperror__shape">
                      <Image src={error_shape} alt="error-shape" style={{height: 'auto'}} />
                    </div>
                  </div>
                  <div className="tperror__content">
                    <h4 className="tperror__title mb-25">
                      Oops...That link is broken.
                    </h4>
                    <p>
                      Sorry for the inconvenience. Go to our homepage or check
                      out our latest collections.
                    </p>
                    <div className="tperror__btn">
                      <Link href="/">Back to homepage</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* not found area end */}

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
