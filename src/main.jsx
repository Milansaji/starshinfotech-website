import React, { useMemo, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ArrowUpRight, ArrowDown, Menu, X } from "lucide-react";
import "./styles.css";

function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

function ParticleSpiral({ count = 3600 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 8.5;
      const radius = 0.08 + t * 0.085 + (Math.random() - 0.5) * 0.16;
      const spread = (Math.random() - 0.5) * (0.06 + t * 0.018);
      arr[i * 3] = Math.cos(t) * (radius + spread);
      arr[i * 3 + 1] = Math.sin(t) * (radius + spread);
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.24;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * 0.055;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.06;
  });

  return (
    <points ref={ref} rotation={[0.12, 0.1, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#ffffff" transparent opacity={0.9} sizeAttenuation />
    </points>
  );
}

function OrbScene({ lite = false }) {
  return (
    <Canvas camera={{ position: [0, 0, 5.2], fov: 42 }} dpr={lite ? [1, 1.5] : [1, 2]}>
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 2, 4]} intensity={7} />
      <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.35}>
        <ParticleSpiral count={lite ? 1400 : 3600} />
      </Float>
      <Environment preset="city" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.35} />
    </Canvas>
  );
}

const services = [
  ["01", "AI Solutions", "Smarter systems for a more human tomorrow."],
  ["02", "Immersive Experiences", "AR. VR. MR. Ideas beyond the screen."],
  ["03", "Digital Products", "Design. Develop. Scale."],
  ["04", "Brand & Creative", "Identity, content and experiences people remember."]
];

function App() {
  const [menu, setMenu] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  React.useEffect(() => {
    document.body.classList.toggle("nav-open", menu);
    return () => document.body.classList.remove("nav-open");
  }, [menu]);

  return (
    <>
      {menu ? (
        <button type="button" className="nav-backdrop" aria-label="Close menu" onClick={() => setMenu(false)} />
      ) : null}
      <header className="nav">
        <a className="brand" href="#top" onClick={() => setMenu(false)}>
          <img className="brand-logo" src="/starsh-logo.png" alt="Starsh Infotech" width={40} height={40} />
          <span><b>STARSH</b><small>INFOTECH</small></span>
        </a>

        <div className={`nav-links ${menu ? "open" : ""}`} id="mobile-nav" aria-hidden={!menu}>
          {["Work", "Services", "About", "Insights", "Careers"].map(x =>
            <a href={`#${x.toLowerCase()}`} key={x} onClick={() => setMenu(false)}>{x}</a>
          )}
          <a className="nav-cta" href="#contact" onClick={() => setMenu(false)}>Let’s Talk <ArrowUpRight size={15}/></a>
        </div>

        <button
          type="button"
          className="menu-btn"
          onClick={() => setMenu(!menu)}
          aria-label="Toggle menu"
          aria-expanded={menu}
        >
          {menu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <main>
      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow">TECHNOLOGY · CREATIVITY · EXPERIENCES</div>
          <h1>Ideas in<br/><em>Motion.</em></h1>
          <p>We build AI-powered solutions, immersive experiences and digital products that help businesses move forward.</p>
          <div className="hero-cta-row">
            <a className="circle-link" href="#work"><ArrowUpRight size={20}/></a>
            <span className="link-label">Explore our work</span>
          </div>
        </div>
        <div className="hero-visual"><OrbScene lite={isMobile} /></div>
        <div className="hero-side">TURNING<br/>IDEAS INTO<br/>INTELLIGENT<br/>EXPERIENCES</div>
        <div className="hero-index">01<br/><span>02</span><br/><span>03</span><br/><span>04</span></div>
      </section>

      <section className="intro" id="about">
        <div className="section-tag">01 / WHO WE ARE</div>
        <div>
          <h2>Technology<br/>meets <span>imagination.</span></h2>
          <p>We bring strategy, design, technology and creativity into the same conversation—turning complex ideas into useful, engaging digital experiences.</p>
        </div>
        <div className="intro-stat"><strong>∞</strong><span>possibilities<br/>to explore</span></div>
      </section>

      <section className="services" id="services">
        <div className="section-head">
          <div className="section-tag">02 / WHAT WE DO</div>
          <h2>Built for<br/><span>what’s next.</span></h2>
        </div>
        <div className="service-grid">
          {services.map(([n, title, desc]) => (
            <article className="service-card" key={n}>
              <span>{n}</span>
              <div className="service-orb"></div>
              <h3>{title}</h3>
              <p>{desc}</p>
              <ArrowUpRight className="service-arrow"/>
            </article>
          ))}
        </div>
      </section>

      <section className="work" id="work">
        <div className="section-tag">03 / SELECTED WORK</div>
        <div className="work-title">
          <h2>Ideas<br/><span>in action.</span></h2>
          <a href="#contact">View all work <ArrowUpRight size={18}/></a>
        </div>
        <div className="work-grid">
          <article className="work-large">
            <div className="work-art art-one"><div className="mini-spiral">✳</div></div>
            <div><small>01 — IMMERSIVE</small><h3>Beyond the screen.</h3></div>
          </article>
          <article>
            <div className="work-art art-two"></div>
            <small>02 — DIGITAL PRODUCT</small><h3>Designed to move.</h3>
          </article>
          <article>
            <div className="work-art art-three"></div>
            <small>03 — BRAND EXPERIENCE</small><h3>Make an impression.</h3>
          </article>
        </div>
      </section>

      <section className="process">
        <div className="section-tag">04 / OUR APPROACH</div>
        <h2>From idea<br/><span>to impact.</span></h2>
        <div className="steps">
          {["Discover", "Define", "Design", "Build", "Launch"].map((s, i) =>
            <div className="step" key={s}><b>0{i+1}</b><span>{s}</span></div>
          )}
        </div>
      </section>

      <section className="contact" id="contact">
        {!isMobile ? (
          <div className="contact-orb"><OrbScene /></div>
        ) : (
          <div className="contact-orb contact-orb-static" aria-hidden="true" />
        )}
        <div className="section-tag">05 / GET IN TOUCH</div>
        <h2>Let’s build<br/><span>what’s next.</span></h2>
        <a className="contact-btn" href="mailto:hello@starshinfotech.com">Start a conversation <ArrowUpRight/></a>
      </section>

      <footer>
        <div><b>STARSH INFOTECH</b><span> — TECHNOLOGY · CREATIVITY · EXPERIENCES</span></div>
        <div>THIRUVALLA · KERALA · INDIA</div>
        <div>© 2026 STARSH INFOTECH</div>
      </footer>

      <a className="scroll" href="#about"><ArrowDown size={15}/> SCROLL TO EXPLORE</a>
      </main>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
