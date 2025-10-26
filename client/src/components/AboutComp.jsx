import React,{useState,useEffect,useMemo,useRef} from 'react'
import EsL from '../images/Es4.png'
import { Shirt, Award, Leaf, Users,Mail,Instagram } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';

const AboutComp = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    {
      icon: <Shirt size={28} color="#fff" />,
      title: "Timeless Design",
      text: "We create pieces that transcend trends, designed to be worn and loved for years to come.",
    },
    {
      icon: <Award size={28} color="#fff" />,
      title: "Quality First",
      text: "Every stitch, every seam is executed with precision and care by skilled artisans.",
    },
    {
      icon: <Leaf size={28} color="#fff" />,
      title: "Sustainable Practice",
      text: "We're committed to responsible production that respects both people and planet.",
    },
    {
      icon: <Users size={28} color="#fff" />,
      title: "Community Driven",
      text: "Built on the values of transparency, authenticity, and connection with our customers.",
    },
  ];
  return (
    <div className='AboutComp'>
        <div className='AboutComp1'>
            <img src={EsL} alt="" />
            <h3>Where timeless design meets modern craftsmanship</h3>
            <p>
                We believe in creating pieces that transcend fleeting trends.
                Each garment is thoughtfully designed to become an essential part of your wardrobe,
                crafted with meticulous attention to detail and uncompromising quality.
            </p>
            <p>
                From sustainable materials to timeless silhouettes, 
                Es represents a commitment to conscious fashion that honors both style and substance.
            </p>
        </div>
        <div className='AboutComp2'>
            <h2>Our story</h2>
            <p>
                Es was born from a simple belief: that exceptional clothing should be both timeless and accessible.
                Founded in 2024, we've dedicated ourselves to creating pieces that transcend seasonal trends,
                focusing instead on quality, comfort, and enduring style
            </p>
            <p>
                Every garment we create is a testament to our commitment to craftsmanship.
                We work with carefully selected materials, sustainable practices,
                and skilled artisans who share our vision for quality that lasts.
            </p>
            <p>
                We believe that true luxury lies in simplicity—in the perfect cut,
                the right fabric, and the attention to detail that transforms everyday pieces into wardrobe essentials.
            </p>
        </div>
        <div className="values-section" ref={ref}>
            <motion.h2
                className="values-title"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
            >
                Our Values
            </motion.h2>
            <div className="values-grid">
                {values.map((val, i) => (
                <motion.div
                    key={i}
                    className="value-card"
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.2 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <motion.div
                    className="value-icon"
                    whileHover={{
                        rotate: 360,
                        transition: { duration: 0.8, ease: "easeInOut" },
                    }}
                    >
                    {val.icon}
                    </motion.div>
                    <h3 className="value-heading">{val.title}</h3>
                    <p className="value-text">{val.text}</p>
                </motion.div>
                ))}
            </div>
        </div>
        <div className='footer'>
        <div className="footer-container">
          <div className="footer-1">
            <h2>Es</h2>
              <div className="footer-copyright">
                &copy; {new Date().getFullYear()} Es. All rights reserved.
              </div>          
        </div>
          <div className="footer-1">
            <h3>Get in Touch</h3>
            <p className='getintouch'><span><Mail size={20} style={{position:"relative",top:"5px",right:"5px"}}/></span>meleksaket2003@gmail.com</p>
            <p className='getintouch'><span><Instagram  size={20} style={{position:"relative",top:"5px",right:"5px"}}/></span>esseketmelek</p>
          </div>
        </div>
        </div>
    </div>
  )
}

export default AboutComp