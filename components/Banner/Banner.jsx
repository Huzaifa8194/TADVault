import React from "react";
import CountDownOne from "../CountDown/CountDownOne";




const Banner = () => {
  return (
    <section className="banner-area banner-bg">
      <div className="banner-shape-wrap">
        <img
          src={"/img/banner/banner_shape01.png"}
          alt=""
          className="img-one"
          style = {{width: '10%', opacity: '0.5'}}
        />
        <img
          src={"/img/banner/banner_shape02.png"}
          alt=""
          className="img-two"
          style = {{width: '10%', opacity: '0.5'}}
        />
        <img
          src={"/img/banner/banner_shape03.png"}
          alt=""
          className="img-three"
          style = {{width: '10%', opacity: '0.5'}}
        />
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="banner-content text-center">
            <img
          src={"/img/banner/banner_shape04.png"}
          alt=""
          className="img-two"
          style = {{width: '10%', opacity: '0.5'}}
        />
              <h2 className="title">
               TheArchitectsDream <span>Vault</span>
              </h2>
             
            </div>
           
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="banner-countdown-wrap text-center">
              {/* <h2 className="title">ICO Will Start In..</h2>

              <CountDownOne /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
