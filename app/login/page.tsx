"use client";
import { motion, useAnimation } from "framer-motion";
import React, { useEffect, useState } from "react";
import LoginPage from "../components/login";

const Login = () => {
  const [login, setLogin] = useState<boolean>(false);

  const logoAnimation = useAnimation();
  const textAnimation = useAnimation();
  const kioskmanAnimation = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      await logoAnimation.start({
        y: 0,
        opacity: 1,
        transition: { duration: 1 },
      });

      await textAnimation.start({
        opacity: 1,
        transition: { duration: 1 },
      });

      await Promise.all([
        logoAnimation.start({
          y: -200,
          transition: { duration: 1 },
        }),
        textAnimation.start({
          y: -180,
          transition: { duration: 1 },
        }),
      ]);

      await kioskmanAnimation.start({
        opacity: 1,
        y: 0,
        transition: { duration: 1 },
      });

      await logoAnimation.start({
        opacity: 0,
        transition: { duration: 1 },
      });

      await textAnimation.start({
        y: "calc(-60vh + 5vh)",
        transition: { duration: 1 },
      });

      await kioskmanAnimation.start({
        opacity: 0,
        transition: { duration: 0.5 },
      });
      setLogin(true);
    };
    sequence();
  }, [logoAnimation, textAnimation, kioskmanAnimation]);
  return (
    <div className="relative w-full h-[100dvh] bg-secondarySurface flex flex-col items-center justify-center overflow-hidden">
      {!login && (
        <>
          <motion.div className="absolute top-[50%] translate-y-[-50%]">
            <motion.img
              initial={{ opacity: 0 }}
              animate={logoAnimation}
              src={"/images/basilLogo.png"}
              className="min-w-[242px] min-h-[82px]"
              alt="logo"
            />

            <motion.h1
              initial={{ opacity: 0 }}
              animate={textAnimation}
              className="text-heading3 text-primary font-regular text-center mt-5"
            >
              DISPATCH HUB
            </motion.h1>
          </motion.div>

          <motion.img
            initial={{ opacity: 0, y: 200 }}
            animate={kioskmanAnimation}
            transition={{ duration: 1 }}
            src={"/images/kioskman.png"}
            className="min-w-[392px] min-h-[663px] absolute top-[351px] left-[79px]"
            alt="kioskman"
          />
        </>
      )}
      {login && <LoginPage />}
    </div>
  );
};

export default Login;
