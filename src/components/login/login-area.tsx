"use client";

import React from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "../form/register-form";
import LoginForm from "../form/login-form";

const LoginArea: React.FC = () => {
  const router = useRouter();

  return (
    <section className="track-area pb-40">
      <div className="container">
        <div className="row justify-content-center">

          {/* LOGIN AREA */}
          <div className="col-lg-6 col-sm-12">
            <div className="tptrack__product mb-40">
              <div className="tptrack__content grey-bg">

                <div className="tptrack__item d-flex mb-20">
                  <div className="tptrack__item-icon">
                    <i className="fal fa-user-unlock"></i>
                  </div>
                  <div className="tptrack__item-content">
                    <h4 className="tptrack__item-title">Login Here</h4>
                    <p>
                      Your personal data will be used to support your experience throughout this website, to manage access to your account.
                    </p>
                  </div>
                </div>

                {/* LOGIN FORM */}
                <LoginForm />

                {/* 🔥 FORGOT PASSWORD REDIRECT */}
                <div className="text-end mt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/forgot-password")}
                    className="btn btn-link p-0"
                  >
                    Forgot Password?
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* REGISTER AREA */}
          <div className="col-lg-6 col-sm-12">
            <div className="tptrack__product mb-40">
              <div className="tptrack__content grey-bg">

                <div className="tptrack__item d-flex mb-20">
                  <div className="tptrack__item-icon">
                    <i className="fal fa-lock"></i>
                  </div>
                  <div className="tptrack__item-content">
                    <h4 className="tptrack__item-title">Sign Up</h4>
                    <p>
                      Your personal data will be used to support your experience throughout this website, to manage access to your account.
                    </p>
                  </div>
                </div>

                {/* REGISTER FORM */}
                <RegisterForm />

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LoginArea;