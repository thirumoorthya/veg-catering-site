import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// DESIGN TOKENS & GLOBAL STYLES
// ============================================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=Noto+Serif+Devanagari:wght@400;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --leaf: #3d6b2e;
      --leaf-light: #5a9244;
      --leaf-pale: #e8f3e1;
      --earth: #7a5c3a;
      --earth-light: #a87d52;
      --earth-pale: #f5ede2;
      --cream: #fdf8f0;
      --cream-dark: #f0e8d8;
      --mud: #4a3728;
      --bark: #2c1f14;
      --mist: #f7f5f0;
      --sage: #8fa67e;
      --turmeric: #d4a32a;
      --terracotta: #c4622d;
      --sky: #ddeef0;
      --font-display: 'Playfair Display', Georgia, serif;
      --font-body: 'DM Sans', sans-serif;
      --shadow-sm: 0 2px 8px rgba(60,40,10,0.08);
      --shadow-md: 0 4px 20px rgba(60,40,10,0.12);
      --shadow-lg: 0 8px 40px rgba(60,40,10,0.16);
      --radius: 16px;
      --radius-sm: 8px;
    }

    html { scroll-behavior: smooth; }
    
    body {
      font-family: var(--font-body);
      background: var(--cream);
      color: var(--bark);
      line-height: 1.6;
      overflow-x: hidden;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--cream-dark); }
    ::-webkit-scrollbar-thumb { background: var(--sage); border-radius: 3px; }

    /* Animations */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes leafSway {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.04); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes ripple {
      from { transform: scale(0); opacity: 0.6; }
      to { transform: scale(3); opacity: 0; }
    }

    .fade-up { animation: fadeUp 0.6s ease forwards; }
    .fade-in { animation: fadeIn 0.4s ease forwards; }

    /* Nav */
    .nav-link {
      font-size: 14px; font-weight: 500; color: var(--bark);
      text-decoration: none; padding: 6px 14px; border-radius: 20px;
      transition: all 0.25s ease; position: relative; letter-spacing: 0.01em;
    }
    .nav-link:hover, .nav-link.active {
      color: var(--leaf); background: var(--leaf-pale);
    }

    /* Buttons */
    .btn-primary {
      background: var(--leaf); color: white; border: none;
      padding: 12px 28px; border-radius: 30px; font-family: var(--font-body);
      font-size: 15px; font-weight: 500; cursor: pointer;
      transition: all 0.25s ease; letter-spacing: 0.02em;
      box-shadow: 0 4px 16px rgba(61,107,46,0.3);
    }
    .btn-primary:hover { background: var(--leaf-light); transform: translateY(-2px); box-shadow: 0 6px 24px rgba(61,107,46,0.4); }
    .btn-primary:active { transform: translateY(0); }

    .btn-outline {
      background: transparent; color: var(--leaf);
      border: 1.5px solid var(--leaf); padding: 10px 24px;
      border-radius: 30px; font-family: var(--font-body);
      font-size: 14px; font-weight: 500; cursor: pointer;
      transition: all 0.25s ease;
    }
    .btn-outline:hover { background: var(--leaf); color: white; }

    .btn-earth {
      background: var(--earth); color: white; border: none;
      padding: 10px 22px; border-radius: 30px; font-family: var(--font-body);
      font-size: 14px; font-weight: 500; cursor: pointer;
      transition: all 0.25s ease;
    }
    .btn-earth:hover { background: var(--earth-light); }

    /* Cards */
    .card {
      background: white; border-radius: var(--radius);
      box-shadow: var(--shadow-sm); transition: all 0.3s ease;
      overflow: hidden;
    }
    .card:hover { box-shadow: var(--shadow-md); transform: translateY(-4px); }

    /* Section titles */
    .section-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--leaf-pale); color: var(--leaf);
      padding: 6px 16px; border-radius: 20px; font-size: 13px;
      font-weight: 500; margin-bottom: 12px; letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .section-title {
      font-family: var(--font-display); font-size: clamp(28px, 5vw, 48px);
      line-height: 1.2; color: var(--bark); margin-bottom: 16px;
    }
    .section-subtitle {
      color: var(--earth); font-size: 16px; line-height: 1.7;
      max-width: 560px;
    }

    /* Form inputs */
    .form-input {
      width: 100%; padding: 12px 16px; border: 1.5px solid #e0d8cc;
      border-radius: var(--radius-sm); font-family: var(--font-body);
      font-size: 15px; color: var(--bark); background: white;
      transition: border-color 0.2s ease; outline: none;
    }
    .form-input:focus { border-color: var(--leaf); box-shadow: 0 0 0 3px rgba(61,107,46,0.1); }
    .form-label { font-size: 13px; font-weight: 500; color: var(--earth); margin-bottom: 6px; display: block; }

    /* Tags */
    .tag {
      display: inline-block; padding: 4px 12px; border-radius: 12px;
      font-size: 12px; font-weight: 500; letter-spacing: 0.03em;
    }
    .tag-veg { background: var(--leaf-pale); color: var(--leaf); }
    .tag-special { background: #fff3d0; color: #8a6200; }
    .tag-popular { background: #ffe8e0; color: var(--terracotta); }

    /* Decorative leaf */
    .deco-leaf {
      position: absolute; opacity: 0.06; pointer-events: none;
      color: var(--leaf);
    }

    /* Toast */
    .toast {
      position: fixed; top: 80px; right: 20px; z-index: 9999;
      background: white; border-radius: var(--radius-sm);
      box-shadow: var(--shadow-lg); padding: 14px 20px;
      border-left: 4px solid var(--leaf); animation: slideIn 0.3s ease;
      max-width: 300px; display: flex; align-items: center; gap: 10px;
    }

    /* Skeleton loader */
    .skeleton {
      background: linear-gradient(90deg, #f0ece4 25%, #e8e4dc 50%, #f0ece4 75%);
      background-size: 200% 100%; animation: shimmer 1.5s infinite;
      border-radius: var(--radius-sm);
    }

    /* Admin panel */
    .admin-sidebar {
      width: 240px; min-height: 100vh; background: var(--bark);
      padding: 24px 16px; flex-shrink: 0;
    }
    .admin-nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; border-radius: var(--radius-sm);
      color: rgba(255,255,255,0.7); cursor: pointer;
      font-size: 14px; font-weight: 500; transition: all 0.2s;
      margin-bottom: 4px; text-decoration: none;
    }
    .admin-nav-item:hover, .admin-nav-item.active {
      background: rgba(255,255,255,0.1); color: white;
    }
    .admin-nav-item.active { background: var(--leaf); color: white; }

    /* Mobile nav */
    .mobile-menu {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: var(--cream); z-index: 999; padding: 80px 32px 32px;
      display: flex; flex-direction: column; gap: 8px;
      animation: fadeIn 0.2s ease;
    }

    /* WhatsApp button */
    .whatsapp-fab {
      position: fixed; bottom: 28px; right: 28px; z-index: 500;
      width: 56px; height: 56px; border-radius: 50%;
      background: #25d366; color: white; border: none;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: 0 4px 20px rgba(37,211,102,0.4);
      transition: all 0.3s ease; font-size: 24px;
    }
    .whatsapp-fab:hover { transform: scale(1.12); box-shadow: 0 6px 28px rgba(37,211,102,0.5); }

    /* Responsive */
    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .admin-sidebar { display: none; }
    }
    @media (min-width: 769px) {
      .hide-desktop { display: none !important; }
    }
  `}</style>
);

// ============================================================
// DATA
// ============================================================
const CATEGORIES = [
  { id: "all", name: "All Items", icon: "🌿" },
  { id: "starters", name: "Starters", icon: "🥗" },
  { id: "mains", name: "Main Course", icon: "🍛" },
  { id: "rice", name: "Rice & Biryani", icon: "🍚" },
  { id: "breads", name: "Breads", icon: "🫓" },
  { id: "sweets", name: "Sweets", icon: "🍮" },
  { id: "drinks", name: "Drinks", icon: "🥤" },
];

const initialItems = [
  { id: 1, name: "Banana Leaf Thali", category: "mains", price: 180, desc: "Traditional 12-item thali served on fresh banana leaf with seasonal vegetables", tags: ["popular"], emoji: "🍃", rating: 4.9, orders: 340 },
  { id: 2, name: "Keerai Masiyal", category: "mains", price: 80, desc: "Slow-cooked spinach with garlic and country spices, village recipe", tags: ["veg"], emoji: "🌿", rating: 4.7, orders: 210 },
  { id: 3, name: "Sambar Sadam", category: "rice", price: 120, desc: "Drumstick sambar rice cooked in mud pot for authentic earthy flavor", tags: ["popular"], emoji: "🍲", rating: 4.8, orders: 290 },
  { id: 4, name: "Vazhaipoo Vadai", category: "starters", price: 60, desc: "Crispy banana flower fritters with ginger chutney", tags: ["veg"], emoji: "🌺", rating: 4.6, orders: 185 },
  { id: 5, name: "Pongal", category: "mains", price: 90, desc: "Fresh-ground rice and moong dal pongal with ghee, tempered with country pepper", tags: ["special"], emoji: "🪔", rating: 4.8, orders: 260 },
  { id: 6, name: "Ragi Mudde", category: "mains", price: 70, desc: "Hand-rolled finger millet balls served with forest greens curry", tags: ["veg"], emoji: "🌾", rating: 4.5, orders: 140 },
  { id: 7, name: "Appam & Stew", category: "breads", price: 110, desc: "Lacy rice hoppers with coconut milk vegetable stew", tags: ["popular"], emoji: "🥛", rating: 4.7, orders: 220 },
  { id: 8, name: "Jaggery Payasam", category: "sweets", price: 65, desc: "Country sugar rice pudding with cardamom and cashews", tags: ["special"], emoji: "🍮", rating: 4.9, orders: 310 },
  { id: 9, name: "Neer Mor", category: "drinks", price: 35, desc: "Traditional spiced buttermilk with curry leaves and ginger", tags: ["veg"], emoji: "🥃", rating: 4.8, orders: 400 },
  { id: 10, name: "Tomato Rasam", category: "starters", price: 50, desc: "Tangy tomato pepper water, a digestive village staple", tags: ["veg"], emoji: "🍅", rating: 4.6, orders: 175 },
  { id: 11, name: "Curd Rice", category: "rice", price: 80, desc: "Seasoned yogurt rice with pomegranate and fried chillies", tags: ["popular"], emoji: "🍚", rating: 4.7, orders: 280 },
  { id: 12, name: "Kanji", category: "drinks", price: 45, desc: "Red rice congee with coconut milk, a healing village morning brew", tags: ["special"], emoji: "☕", rating: 4.5, orders: 130 },
  { id: 13, name: "Kootu", category: "mains", price: 85, desc: "Mixed vegetable and lentil stew with fresh coconut paste", tags: ["veg"], emoji: "🥥", rating: 4.6, orders: 160 },
  { id: 14, name: "Bajra Roti", category: "breads", price: 55, desc: "Hand-pressed pearl millet flatbread with white butter", tags: ["veg"], emoji: "🫓", rating: 4.5, orders: 145 },
  { id: 15, name: "Kesari Bath", category: "sweets", price: 60, desc: "Saffron semolina halwa with ghee, raisins and cashews", tags: ["special"], emoji: "🌸", rating: 4.8, orders: 240 },
];

const TESTIMONIALS = [
  { name: "Priya Raman", event: "Wedding Reception", text: "The banana leaf thali was an absolute hit! Guests kept asking for seconds. Truly authentic village flavors.", rating: 5, avatar: "PR" },
  { name: "Karthik Suresh", event: "Corporate Event", text: "Incredible food, professional service. The mud pot sambar was unlike anything I've tasted. Highly recommend!", rating: 5, avatar: "KS" },
  { name: "Meena Devi", event: "Housewarming", text: "Brought tears to my eyes – reminded me of my grandmother's cooking. Pure, natural, soulful.", rating: 5, avatar: "MD" },
  { name: "Raj Pillai", event: "Birthday Party", text: "300 guests, all delighted. Seamless service and food quality that matched our family's high expectations.", rating: 5, avatar: "RP" },
];

const SERVICES = [
  { icon: "💒", title: "Weddings & Receptions", desc: "Full banana leaf feast setup for 50–5000 guests. Traditional village ambiance with modern service standards.", features: ["Custom thali menus", "Banana leaf setup", "Live cooking stations", "Period-accurate décor"] },
  { icon: "🏢", title: "Corporate Functions", desc: "Hygienic, punctual catering for office events, product launches, and corporate lunches.", features: ["Buffet & served options", "Dietary customization", "Hygienic packaging", "On-time delivery"] },
  { icon: "🎉", title: "Private Parties", desc: "Birthday, housewarming, or any celebration – we bring the village kitchen to your venue.", features: ["Flexible menus", "Home delivery", "Setup assistance", "Chef on site"] },
  { icon: "🛕", title: "Temple & Festivals", desc: "Sacred prasadam cooking and festival feast arrangements with complete religious adherence.", features: ["No onion/garlic options", "Sacred spices only", "Large scale cooking", "Puja meal setup"] },
];

const GALLERY_EVENTS = [
  { label: "Weddings", emoji: "💒", count: "200+" },
  { label: "Corporate", emoji: "🏢", count: "150+" },
  { label: "Festivals", emoji: "🪔", count: "80+" },
  { label: "Parties", emoji: "🎉", count: "300+" },
];

// ============================================================
// UTILITY HOOKS
// ============================================================
function useIntersection(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

// ============================================================
// SMALL COMPONENTS
// ============================================================
function LeafDecoration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ position: "absolute", opacity: 0.07, pointerEvents: "none" }}>
      <path d="M60 10 C30 20 10 50 20 90 C30 130 70 110 80 80 C90 50 80 20 60 10Z" fill="#3d6b2e" />
      <path d="M60 10 L55 90" stroke="#3d6b2e" strokeWidth="2" />
      <path d="M55 40 L35 55" stroke="#3d6b2e" strokeWidth="1.5" />
      <path d="M57 60 L30 70" stroke="#3d6b2e" strokeWidth="1.5" />
      <path d="M57 75 L40 82" stroke="#3d6b2e" strokeWidth="1.5" />
    </svg>
  );
}

function StarRating({ rating }) {
  return (
    <span style={{ color: "#d4a32a", fontSize: 14 }}>
      {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
      <span style={{ color: "#888", marginLeft: 4, fontSize: 12 }}>{rating}</span>
    </span>
  );
}

function Toast({ message, type = "success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: "var(--leaf)", error: "var(--terracotta)", info: "var(--earth)" };
  return (
    <div className="toast" style={{ borderLeftColor: colors[type] }}>
      <span style={{ fontSize: 18 }}>{type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}</span>
      <span style={{ fontSize: 14, color: "var(--bark)" }}>{message}</span>
      <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#999" }}>✕</button>
    </div>
  );
}

function AnimatedSection({ children, style = {} }) {
  const ref = useRef();
  const visible = useIntersection(ref);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "all 0.7s ease", ...style }}>
      {children}
    </div>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar({ page, setPage, isAdmin, setIsAdmin }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" }, { id: "menu", label: "Menu" },
    { id: "about", label: "About" }, { id: "services", label: "Services" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 900,
        background: scrolled ? "rgba(253,248,240,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        boxShadow: scrolled ? "0 2px 20px rgba(60,40,10,0.08)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{
              width: 38, height: 38, background: "var(--leaf)", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
            }}>🌿</div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--bark)", lineHeight: 1.1 }}>Pacha Kaivinam</div>
              <div style={{ fontSize: 10, color: "var(--sage)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Village Catering</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hide-mobile" style={{ display: "flex", gap: 4 }}>
            {navItems.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} className={`nav-link ${page === n.id ? "active" : ""}`} style={{ background: "none", border: "none", fontFamily: "var(--font-body)" }}>
                {n.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hide-mobile" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {isAdmin ? (
              <button onClick={() => { setIsAdmin(false); setPage("home"); }} className="btn-outline" style={{ fontSize: 13, padding: "8px 18px" }}>Exit Admin</button>
            ) : (
              <button onClick={() => setPage("admin-login")} className="btn-outline" style={{ fontSize: 13, padding: "8px 18px" }}>Admin</button>
            )}
            <button onClick={() => setPage("contact")} className="btn-primary" style={{ fontSize: 14, padding: "9px 22px" }}>Book Now 🍃</button>
          </div>

          {/* Mobile hamburger */}
          <button className="hide-desktop" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--bark)" }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu hide-desktop">
          {navItems.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setMenuOpen(false); }}
              style={{ background: page === n.id ? "var(--leaf-pale)" : "none", border: "none", fontFamily: "var(--font-body)", fontSize: 18, fontWeight: 500, color: page === n.id ? "var(--leaf)" : "var(--bark)", padding: "12px 16px", borderRadius: "var(--radius-sm)", cursor: "pointer", textAlign: "left" }}>
              {n.label}
            </button>
          ))}
          <button onClick={() => { setPage("contact"); setMenuOpen(false); }} className="btn-primary" style={{ marginTop: 16 }}>Book Now 🍃</button>
        </div>
      )}
    </>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ setPage }) {
  const [count, setCount] = useState({ weddings: 0, guests: 0, items: 0, years: 0 });

  useEffect(() => {
    const targets = { weddings: 200, guests: 50000, items: 80, years: 15 };
    const duration = 2000;
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount({
        weddings: Math.floor(targets.weddings * ease),
        guests: Math.floor(targets.guests * ease),
        items: Math.floor(targets.items * ease),
        years: Math.floor(targets.years * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        background: `linear-gradient(135deg, #1a3a0f 0%, #2d5a1e 40%, #1e4a10 100%)`,
        position: "relative", overflow: "hidden", paddingTop: 68,
      }}>
        {/* Decorative elements */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 50%, rgba(90,146,68,0.15) 0%, transparent 60%), radial-gradient(circle at 70% 30%, rgba(93,202,165,0.08) 0%, transparent 50%)" }} />
        
        {/* Floating leaves */}
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", fontSize: "clamp(20px, 3vw, 40px)",
            left: `${10 + i * 12}%`, top: `${15 + (i % 3) * 25}%`,
            opacity: 0.12 + (i % 3) * 0.05,
            animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}>
            {["🌿", "🍃", "🌱", "🪴"][i % 4]}
          </div>
        ))}

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", width: "100%", position: "relative", zIndex: 1 }}>
          {/* Left */}
          <div style={{ animation: "fadeUp 0.8s ease forwards" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)", padding: "7px 16px", borderRadius: 20, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24, fontWeight: 500 }}>
              🌾 Pure · Natural · Village Style
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 700, color: "white", lineHeight: 1.1, marginBottom: 20,
            }}>
              Taste the Soul<br />
              <span style={{ color: "#9edc6e", fontStyle: "italic" }}>of the Village</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 17, lineHeight: 1.8, marginBottom: 36, maxWidth: 460 }}>
              Authentic vegetarian feasts crafted with heirloom recipes, organic ingredients, and the warmth of a village kitchen — brought to your celebration.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button onClick={() => setPage("contact")} className="btn-primary" style={{ fontSize: 16, padding: "14px 32px", background: "#9edc6e", color: "#1a3a0f" }}>
                Book Your Feast 🍃
              </button>
              <button onClick={() => setPage("menu")} className="btn-outline" style={{ borderColor: "rgba(255,255,255,0.4)", color: "white", fontSize: 16, padding: "14px 28px" }}>
                Explore Menu
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: "flex", gap: 20, marginTop: 40, flexWrap: "wrap" }}>
              {["100% Veg", "Organic Spices", "Zero Oil Option", "FSSAI Certified"].map(b => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                  <span style={{ color: "#9edc6e", fontSize: 14 }}>✓</span> {b}
                </div>
              ))}
            </div>
          </div>

          {/* Right - Food Cards */}
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, animation: "fadeUp 0.8s 0.2s ease forwards", opacity: 0 }}>
            {[
              { emoji: "🍃", label: "Banana Leaf Thali", sub: "12 items per leaf" },
              { emoji: "🍲", label: "Mud Pot Sambar", sub: "Slow cooked 4 hrs" },
              { emoji: "🪔", label: "Festival Pongal", sub: "Traditional recipe" },
              { emoji: "🥥", label: "Coconut Kanji", sub: "Morning wellness" },
            ].map((item, i) => (
              <div key={item.label} style={{
                background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.12)", borderRadius: "var(--radius)",
                padding: 20, transform: i % 2 === 1 ? "translateY(24px)" : "none",
                transition: "all 0.3s ease", cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; e.currentTarget.style.transform = (i % 2 === 1 ? "translateY(20px)" : "") + " scale(1.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = i % 2 === 1 ? "translateY(24px)" : ""; }}
              >
                <div style={{ fontSize: 36, marginBottom: 10 }}>{item.emoji}</div>
                <div style={{ color: "white", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{item.label}</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "float 2s ease-in-out infinite" }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 24, height: 40, border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <div style={{ width: 4, height: 8, background: "rgba(255,255,255,0.5)", borderRadius: 2, animation: "float 1.5s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "var(--leaf)", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, textAlign: "center" }}>
          {[
            { val: count.weddings + "+", label: "Weddings Catered" },
            { val: count.guests.toLocaleString() + "+", label: "Happy Guests" },
            { val: count.items + "+", label: "Menu Items" },
            { val: count.years + " yrs", label: "Of Tradition" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 700, color: "white" }}>{s.val}</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Menu Preview */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-badge">🌿 Our Specialties</div>
            <h2 className="section-title">Village Kitchen Favourites</h2>
            <p className="section-subtitle" style={{ margin: "0 auto" }}>Every dish tells a story of earth, sun, and the skilled hands that have perfected these recipes over generations.</p>
          </div>
        </AnimatedSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
          {initialItems.slice(0, 6).map((item, i) => (
            <AnimatedSection key={item.id} style={{ transitionDelay: `${i * 0.08}s` }}>
              <FoodCard item={item} />
            </AnimatedSection>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <button onClick={() => setPage("menu")} className="btn-primary">View Full Menu →</button>
        </div>
      </section>

      {/* Village Story */}
      <section style={{ background: "var(--earth-pale)", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -60, top: -60, fontSize: 300, opacity: 0.03, lineHeight: 1 }}>🌿</div>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <AnimatedSection>
            <div className="section-badge" style={{ background: "var(--leaf-pale)" }}>🏡 Our Story</div>
            <h2 className="section-title">From Our Village<br /><em>To Your Table</em></h2>
            <p style={{ color: "var(--earth)", lineHeight: 1.9, fontSize: 15, marginBottom: 20 }}>
              Three generations ago, our grandmother Paachi cooked for the entire village with nothing but wood fire, stone-ground spices, and love. Today, we carry that same spirit — uncompromising on quality, devoted to tradition.
            </p>
            <p style={{ color: "var(--earth)", lineHeight: 1.9, fontSize: 15, marginBottom: 28 }}>
              Every ingredient we source is organic, every recipe is tested against our grandmother's memory, and every meal is cooked with the intention that food is medicine.
            </p>
            <button onClick={() => setPage("about")} className="btn-outline">Read Our Full Story →</button>
          </AnimatedSection>
          <AnimatedSection>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { emoji: "🪨", title: "Stone-Ground Spices", text: "Daily ground on traditional granite" },
                { emoji: "🌾", title: "Farm-Direct Grains", text: "Sourced from organic village farms" },
                { emoji: "🔥", title: "Wood Fire Cooking", text: "Slow cooked for deep flavour" },
                { emoji: "🍃", title: "Banana Leaf Service", text: "Natural, eco-friendly serving" },
              ].map((f, i) => (
                <div key={f.title} className="card" style={{ padding: 20, background: "white", transform: i % 2 === 1 ? "translateY(12px)" : "none" }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{f.emoji}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--bark)", marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: "var(--earth)" }}>{f.text}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Preview */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-badge">🍽️ What We Do</div>
            <h2 className="section-title">We Cater to Every<br />Celebration</h2>
          </div>
        </AnimatedSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
          {SERVICES.map((s, i) => (
            <AnimatedSection key={s.title} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="card" style={{ padding: 28, height: "100%", cursor: "default" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{s.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 19, marginBottom: 10, color: "var(--bark)" }}>{s.title}</h3>
                <p style={{ color: "var(--earth)", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{s.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {s.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--leaf)" }}>
                      <span>✓</span> <span style={{ color: "var(--bark)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <button onClick={() => setPage("services")} className="btn-primary">All Services →</button>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: "var(--bark)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <AnimatedSection>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="section-badge" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}>💬 Testimonials</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 42px)", color: "white", marginBottom: 8 }}>Loved by Thousands</h2>
            </div>
          </AnimatedSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <AnimatedSection key={t.name} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius)", padding: 24 }}>
                  <div style={{ color: "#d4a32a", fontSize: 20, marginBottom: 12 }}>★★★★★</div>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.8, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--leaf)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "white" }}>{t.avatar}</div>
                    <div>
                      <div style={{ color: "white", fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>{t.event}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: "linear-gradient(135deg, var(--leaf) 0%, var(--leaf-light) 100%)", padding: "60px 24px", textAlign: "center" }}>
        <AnimatedSection>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 42px)", color: "white", marginBottom: 16 }}>
            Ready to Experience Village Flavours?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, marginBottom: 32 }}>
            Let's craft a feast that your guests will talk about for years.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("contact")} className="btn-primary" style={{ background: "white", color: "var(--leaf)", fontSize: 16, padding: "14px 32px" }}>
              Book Your Event 🍃
            </button>
            <a href="https://wa.me/+919876543210" target="_blank" rel="noreferrer"
              style={{ background: "#25d366", color: "white", border: "none", padding: "14px 28px", borderRadius: 30, fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 500, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              💬 WhatsApp Us
            </a>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}

// ============================================================
// FOOD CARD
// ============================================================
function FoodCard({ item, isAdmin, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);

  const tagColors = {
    popular: { bg: "#ffe8e0", text: "var(--terracotta)" },
    veg: { bg: "var(--leaf-pale)", text: "var(--leaf)" },
    special: { bg: "#fff3d0", text: "#8a6200" },
  };

  return (
    <div className="card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "default", height: "100%" }}
    >
      {/* Emoji display */}
      <div style={{
        background: hovered ? "var(--leaf)" : "var(--leaf-pale)", height: 140,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 64, transition: "background 0.3s ease",
        transform: hovered ? "scale(1.02)" : "scale(1)",
      }}>
        {item.emoji}
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--bark)", lineHeight: 1.2 }}>{item.name}</h3>
          <span style={{ fontWeight: 700, fontSize: 17, color: "var(--leaf)", whiteSpace: "nowrap", marginLeft: 8 }}>₹{item.price}</span>
        </div>
        <p style={{ color: "var(--earth)", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{item.desc}</p>
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          {item.tags.map(t => (
            <span key={t} className="tag" style={{ background: tagColors[t]?.bg, color: tagColors[t]?.text, fontSize: 11 }}>
              {t === "popular" ? "⭐ Popular" : t === "veg" ? "🌿 Pure Veg" : "✨ Special"}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <StarRating rating={item.rating} />
          <span style={{ fontSize: 11, color: "var(--sage)" }}>{item.orders} orders</span>
        </div>
        {isAdmin && (
          <div style={{ display: "flex", gap: 8, marginTop: 14, borderTop: "1px solid var(--cream-dark)", paddingTop: 12 }}>
            <button onClick={() => onEdit(item)} className="btn-outline" style={{ flex: 1, fontSize: 12, padding: "6px 0" }}>✏️ Edit</button>
            <button onClick={() => onDelete(item.id)} style={{ flex: 1, background: "#fff0ef", color: "var(--terracotta)", border: "1px solid #ffd0cc", borderRadius: 20, fontSize: 12, padding: "6px 0", cursor: "pointer" }}>🗑️ Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MENU PAGE
// ============================================================
function MenuPage({ items, setItems, isAdmin, showToast }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = items.filter(item =>
    (activeCategory === "all" || item.category === activeCategory) &&
    (item.name.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    showToast("Item removed successfully", "success");
  };

  const handleSave = (itemData) => {
    if (itemData.id) {
      setItems(prev => prev.map(i => i.id === itemData.id ? itemData : i));
      showToast("Item updated!", "success");
    } else {
      setItems(prev => [...prev, { ...itemData, id: Date.now(), orders: 0, rating: 4.5 }]);
      showToast("New item added!", "success");
    }
    setEditItem(null);
    setShowAddModal(false);
  };

  return (
    <div style={{ paddingTop: 68, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, var(--leaf) 0%, var(--leaf-light) 100%)", padding: "48px 24px 40px", textAlign: "center" }}>
        <div className="section-badge" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>🍽️ Our Menu</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 52px)", color: "white", marginBottom: 12 }}>Pure Vegetarian Delights</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>Seasonal ingredients, traditional recipes, authentic taste</p>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Search + Add */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ flex: 1, position: "relative", minWidth: 220 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--sage)", fontSize: 16 }}>🔍</span>
            <input className="form-input" placeholder="Search dishes…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 42 }} />
          </div>
          {isAdmin && (
            <button onClick={() => setShowAddModal(true)} className="btn-primary">+ Add Item</button>
          )}
        </div>

        {/* Categories */}
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, marginBottom: 32 }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              style={{
                whiteSpace: "nowrap", padding: "9px 20px", borderRadius: 24,
                border: activeCategory === cat.id ? "none" : "1.5px solid var(--cream-dark)",
                background: activeCategory === cat.id ? "var(--leaf)" : "white",
                color: activeCategory === cat.id ? "white" : "var(--earth)",
                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
                cursor: "pointer", transition: "all 0.2s ease",
                display: "flex", alignItems: "center", gap: 6,
              }}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ marginBottom: 20, color: "var(--sage)", fontSize: 14 }}>
          {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--sage)" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🌿</div>
            <p>No items found. Try a different search.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
            {filtered.map(item => (
              <FoodCard key={item.id} item={item} isAdmin={isAdmin}
                onEdit={setEditItem} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {(editItem || showAddModal) && (
        <ItemModal item={editItem} onSave={handleSave} onClose={() => { setEditItem(null); setShowAddModal(false); }} />
      )}
    </div>
  );
}

// ============================================================
// ITEM MODAL (Admin)
// ============================================================
function ItemModal({ item, onSave, onClose }) {
  const [form, setForm] = useState(item || { name: "", category: "mains", price: "", desc: "", tags: ["veg"], emoji: "🍛" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    onSave({ ...form, price: Number(form.price) });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(20,15,5,0.6)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20
    }} onClick={e => { if