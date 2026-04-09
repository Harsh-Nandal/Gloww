'use client';
import React from 'react';
import product_data from '@/data/product-data';
import ProductSingle from '../product-single/product-single';


const AllProductArea = () => {
  const products = [...product_data];
  return (
    <>
    <section className="product-area whight-product pt-75 pb-75 fix">
      <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
                <div className="tpsection mb-35">
                  <h4 className="tpsection__sub-title">~ Special Products ~</h4>
                  <h4 className="tpsection__title">Weekly Food Offers</h4>
                  <p>The liber tempor cum soluta nobis eleifend option congue doming quod mazim.</p>
                </div>
            </div>
          </div>
          <div className="tpproduct__arrow double-product p-relative">
            <div className="row">
              {products.slice(0,12).map((item,i) => (
                <div className="col-lg-2 col-md-4 col-sm-6 mb-30" key={i}>
                  <ProductSingle product={item} />
                </div>
              ))}
            </div>
          </div>
      </div>
    </section>  
    </>
  );
};

export default AllProductArea;