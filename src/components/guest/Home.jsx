import React from "react";
import Button from "../../layouts/Button";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="relative w-full min-h-screen">
        <div className=" absolute top-20 left-0 w-full h-full bg-cover bg-center bg-no-repeat min-h-screen flex flex-row justify-between items-center lg:px-32 px-5 bg-[url('./assets/img/hero.jpg')] bg-cover bg-no-repeat">
          <div className=" w-full lg:w-2/3 space-y-5">
            <h1 className=" text-backgroundColor font-semibold text-6xl">
              Elevate Your Inner Foodie with Every Bite.
            </h1>
            <p className=" text-backgroundColor">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis et
              qui, maxime assumenda repellat corrupti officia dolorum delectus
              labore deleniti?
            </p>
            <div className=" lg:pl-44">
              <Button title="Order Now" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
