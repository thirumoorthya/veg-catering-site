
import { useState, useEffect, useRef, useCallback } from "react";

// ── Design Tokens ────────────────────────────────────────────────────────────
const COLORS = {
  leafGreen: "#2d6a2d",
  midGreen: "#4a8c3f",
  lightGreen: "#7ab648",
  paleGreen: "#e8f5e0",
  earthBrown: "#7c4b1e",
  lightBrown: "#c9935a",
  cream: "#fdf6ec",
  darkCream: "#f4e8d0",
  bark: "#3d2410",
  white: "#ffffff",
  textDark: "#1a1a1a",
  textMid: "#4a4a4a",
  textLight: "#777777",
  accent: "#e8a020",
  accentLight: "#fdf0d5",
  red: "#c0392b",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Nunito:wght@300;400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Nunito',sans-serif;background:${COLORS.cream};color:${COLORS.textDark};}
  ::-webkit-scrollbar{width:6px;}
  ::-webkit-scrollbar-track{background:${COLORS.darkCream};}
  ::-webkit-scrollbar-thumb{background:${COLORS.lightGreen};border-radius:3px;}

  .playfair{font-family:'Playfair Display',serif;}

  /* Nav */
  nav{position:fixed;top:0;left:0;right:0;z-index:100;transition:all .3s;backdrop-filter:blur(10px);}
  nav.scrolled{background:rgba(45,106,45,0.97);box-shadow:0 2px 20px rgba(0,0,0,0.15);}
  nav.top{background:rgba(45,106,45,0.4);}

  /* Animations */
  @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
  @keyframes leafSway{0%,100%{transform:rotate(-5deg);}50%{transform:rotate(5deg);}}
  @keyframes pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.05);}}
  @keyframes ripple{0%{transform:scale(0);opacity:.6;}100%{transform:scale(3);opacity:0;}}
  @keyframes slideIn{from{transform:translateX(-100%);opacity:0;}to{transform:translateX(0);opacity:1;}}
  @keyframes bounceIn{0%{transform:scale(.5);opacity:0;}70%{transform:scale(1.1);}100%{transform:scale(1);opacity:1;}}
  @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
  @keyframes waveMove{0%{background-position:0 bottom;}100%{background-position:200px bottom;}}

  .fade-up{animation:fadeUp .6s ease both;}
  .float-anim{animation:float 4s ease-in-out infinite;}
  .sway{animation:leafSway 3s ease-in-out infinite;}
  .pulse-anim{animation:pulse 2s ease-in-out infinite;}

  /* Hero wave */
  .hero-wave{position:absolute;bottom:-2px;left:0;right:0;}

  /* Cards */
  .food-card{background:white;border-radius:20px;overflow:hidden;transition:all .35s cubic-bezier(.34,1.56,.64,1);box-shadow:0 4px 20px rgba(0,0,0,.06);}
  .food-card:hover{transform:translateY(-10px) scale(1.02);box-shadow:0 20px 60px rgba(45,106,45,.2);}
  .food-card:hover .card-overlay{opacity:1;}
  .card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(45,106,45,.85),transparent);opacity:0;transition:opacity .3s;display:flex;align-items:flex-end;padding:16px;}

  /* Buttons */
  .btn-primary{background:linear-gradient(135deg,${COLORS.leafGreen},${COLORS.midGreen});color:white;border:none;padding:14px 32px;border-radius:50px;font-family:'Nunito',sans-serif;font-weight:700;font-size:15px;cursor:pointer;transition:all .3s;position:relative;overflow:hidden;}
  .btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(45,106,45,.4);}
  .btn-primary:active{transform:translateY(0);}
  .btn-secondary{background:transparent;color:${COLORS.leafGreen};border:2px solid ${COLORS.leafGreen};padding:12px 28px;border-radius:50px;font-family:'Nunito',sans-serif;font-weight:700;font-size:14px;cursor:pointer;transition:all .3s;}
  .btn-secondary:hover{background:${COLORS.leafGreen};color:white;transform:translateY(-2px);}
  .btn-sm{padding:8px 20px;font-size:13px;}
  .btn-danger{background:#c0392b;color:white;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-family:'Nunito',sans-serif;font-size:13px;}
  .btn-danger:hover{background:#a93226;}
  .btn-edit{background:${COLORS.accent};color:white;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-family:'Nunito',sans-serif;font-size:13px;}
  .btn-edit:hover{background:#cc8c19;}

  /* Inputs */
  input,textarea,select{font-family:'Nunito',sans-serif;border:2px solid #e0e0e0;border-radius:12px;padding:12px 16px;font-size:14px;transition:border-color .3s;width:100%;outline:none;background:white;}
  input:focus,textarea:focus,select:focus{border-color:${COLORS.leafGreen};}

  /* Tag filter */
  .cat-tag{padding:8px 20px;border-radius:50px;border:2px solid transparent;background:white;color:${COLORS.leafGreen};font-family:'Nunito',sans-serif;font-weight:600;font-size:13px;cursor:pointer;transition:all .25s;box-shadow:0 2px 10px rgba(0,0,0,.06);}
  .cat-tag:hover,.cat-tag.active{background:${COLORS.leafGreen};color:white;box-shadow:0 4px 15px rgba(45,106,45,.3);}

  /* Testimonial */
  .testi-card{background:white;border-radius:20px;padding:28px;box-shadow:0 4px 20px rgba(0,0,0,.06);position:relative;transition:transform .3s;}
  .testi-card:hover{transform:translateY(-5px);}
  .testi-card::before{content:'"';font-size:80px;color:${COLORS.paleGreen};position:absolute;top:10px;left:20px;font-family:'Playfair Display',serif;line-height:1;}

  /* Gallery */
  .gallery-item{border-radius:16px;overflow:hidden;position:relative;cursor:pointer;transition:transform .3s;}
  .gallery-item:hover{transform:scale(1.03);}
  .gallery-item:hover .gal-overlay{opacity:1;}
  .gal-overlay{position:absolute;inset:0;background:rgba(45,106,45,.7);opacity:0;transition:opacity .3s;display:flex;align-items:center;justify-content:center;color:white;font-size:24px;}

  /* Booking form */
  .booking-section{background:linear-gradient(135deg,${COLORS.leafGreen} 0%,${COLORS.midGreen} 40%,${COLORS.lightGreen} 100%);}

  /* Admin */
  .admin-sidebar{width:240px;min-height:100vh;background:${COLORS.bark};color:white;padding:24px 0;}
  .sidebar-link{padding:14px 24px;cursor:pointer;transition:background .2s;font-size:14px;font-weight:600;border-left:3px solid transparent;}
  .sidebar-link:hover,.sidebar-link.active{background:rgba(255,255,255,.1);border-left-color:${COLORS.lightGreen};}

  /* Modal */
  .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:center;justify-content:center;animation:fadeUp .2s ease;}
  .modal-box{background:white;border-radius:20px;padding:32px;width:min(520px,95vw);max-height:90vh;overflow-y:auto;animation:bounceIn .3s ease;}

  /* Toast */
  .toast{position:fixed;bottom:24px;right:24px;z-index:300;background:${COLORS.leafGreen};color:white;padding:14px 24px;border-radius:12px;font-weight:600;font-size:14px;animation:slideIn .3s ease;box-shadow:0 8px 30px rgba(0,0,0,.2);}

  /* Section headings */
  .section-label{color:${COLORS.lightGreen};font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;}
  .section-title{font-size:clamp(28px,4vw,42px);font-weight:700;color:${COLORS.bark};line-height:1.2;}

  /* Organic shapes */
  .leaf-deco{position:absolute;opacity:.08;pointer-events:none;}
  .stat-card{background:white;border-radius:16px;padding:20px;box-shadow:0 4px 20px rgba(0,0,0,.06);text-align:center;}

  /* Smooth scrollbar */
  html{scroll-behavior:smooth;}

  /* Responsive */
  @media(max-width:768px){
    .admin-sidebar{width:100%;min-height:auto;}
    .hero-title{font-size:36px !important;}
  }
`;

// ── Mock Data ────────────────────────────────────────────────────────────────
const INIT_CATEGORIES = [
  { id: 1, name: "Rice & Biryani", icon: "🍚", color: "#e8f5e0" },
  { id: 2, name: "Curries", icon: "🍛", color: "#fdf0d5" },
  { id: 3, name: "Snacks & Starters", icon: "🥙", color: "#fde8e8" },
  { id: 4, name: "Sweets & Desserts", icon: "🍮", color: "#f0e8fd" },
  { id: 5, name: "Breads", icon: "🫓", color: "#e8f0fd" },
  { id: 6, name: "Beverages", icon: "🥤", color: "#e8fdf0" },
];

const MENU_IMAGES = [
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80",
  "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80",
  "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80",
  "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&q=80",
  "https://images.unsplash.com/photo-1533622597524-a1215e26c0a2?w=400&q=80",
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80",
  "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&q=80",
  "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80",
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
];

const INIT_ITEMS = [
  { id: 1, name: "Village Style Sambar Rice", categoryId: 1, price: 120, desc: "Traditional sambar with homegrown tamarind & veggies", img: MENU_IMAGES[0], popular: true, orders: 89 },
  { id: 2, name: "Coconut Milk Biryani", categoryId: 1, price: 180, desc: "Fragrant basmati with forest spices & coconut milk", img: MENU_IMAGES[1], popular: true, orders: 72 },
  { id: 3, name: "Drumstick Kuzhambu", categoryId: 2, price: 90, desc: "Moringa drumstick curry in tamarind gravy", img: MENU_IMAGES[2], popular: false, orders: 45 },
  { id: 4, name: "Banana Flower Curry", categoryId: 2, price: 110, desc: "Fresh banana blossom cooked village style", img: MENU_IMAGES[3], popular: true, orders: 63 },
  { id: 5, name: "Vazhai Ilai Bajji", categoryId: 3, price: 60, desc: "Crispy fritters served on banana leaf", img: MENU_IMAGES[4], popular: false, orders: 38 },
  { id: 6, name: "Sundal Mix Platter", categoryId: 3, price: 80, desc: "6 types of protein-rich legume salads", img: MENU_IMAGES[5], popular: true, orders: 55 },
  { id: 7, name: "Clay Pot Payasam", categoryId: 4, price: 70, desc: "Rice payasam slow-cooked in mud pot with jaggery", img: MENU_IMAGES[6], popular: true, orders: 91 },
  { id: 8, name: "Kesari Badam", categoryId: 4, price: 85, desc: "Saffron-infused semolina sweet with almond", img: MENU_IMAGES[7], popular: false, orders: 41 },
  { id: 9, name: "Millet Roti", categoryId: 5, price: 40, desc: "Handmade ragi & bajra flatbread", img: MENU_IMAGES[8], popular: false, orders: 29 },
  { id: 10, name: "Pongal", categoryId: 1, price: 100, desc: "Temple-style creamy pongal with ghee & pepper", img: MENU_IMAGES[9], popular: true, orders: 78 },
  { id: 11, name: "Neer Mor (Buttermilk)", categoryId: 6, price: 30, desc: "Spiced village buttermilk with curry leaves", img: MENU_IMAGES[10], popular: true, orders: 110 },
  { id: 12, name: "Thaen Kaapi (Honey Coffee)", categoryId: 6, price: 45, desc: "Authentic filter coffee with local forest honey", img: MENU_IMAGES[11], popular: false, orders: 33 },
];

const INIT_BOOKINGS = [
  { id: 1, name: "Rajan Pillai", email: "rajan@example.com", phone: "9876543210", event: "Wedding", date: "2025-03-15", guests: 300, msg: "Traditional full meals for 3-day wedding", status: "Confirmed" },
  { id: 2, name: "Priya Suresh", email: "priya@example.com", phone: "9123456789", event: "Birthday Party", date: "2025-02-20", guests: 80, msg: "Evening snacks + dinner", status: "Pending" },
  { id: 3, name: "Murugan Vel", email: "murugan@example.com", phone: "9988776655", event: "Corporate", date: "2025-04-10", guests: 150, msg: "Lunch for corporate event", status: "Confirmed" },
];

const GALLERY = [
  { img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", label: "Wedding Feast" },
  { img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", label: "Sadhya Spread" },
  { img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", label: "Temple Events" },
  { img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80", label: "Corporate Lunch" },
  { img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80", label: "Organic Salads" },
  { img: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80", label: "Village Style" },
];

const TESTIMONIALS = [
  { name: "Kavitha Rajan", role: "Mother of Bride", rating: 5, text: "The banana leaf sadhya at my daughter's wedding was beyond imagination. Every relative complimented the authentic village taste. Truly blessed to have found Pachhai Catering!" },
  { name: "Dr. Senthil Kumar", role: "Corporate HR Manager", rating: 5, text: "We ordered for 200 employees and the freshness, variety, and eco-friendly serving style impressed everyone. Will definitely book again for our annual day." },
  { name: "Nalini Auntie", role: "Regular Customer", rating: 5, text: "Their clay pot payasam is magical. Nothing like the taste of food prepared with love, traditional spices, and zero chemicals. Our family's go-to caterer." },
];

const SERVICES = [
  { icon: "🌿", title: "Wedding Feasts", desc: "Grand traditional sadhya on banana leaves for 50 to 5000 guests. Customized multi-day menu.", price: "From ₹350/plate" },
  { icon: "🎊", title: "Birthday & Parties", desc: "Curated evening snack boxes, mini tiffin spreads, and dessert stations.", price: "From ₹180/plate" },
  { icon: "🏢", title: "Corporate Catering", desc: "Healthy daily lunch boxes, team lunches, and office events with organic focus.", price: "From ₹150/plate" },
  { icon: "🛕", title: "Temple & Festivals", desc: "Prasadam cooking, pongal festivals, and community feast preparation.", price: "From ₹80/plate" },
  { icon: "🏡", title: "Home Functions", desc: "Seemantham, housewarming, and family gatherings with personalised menus.", price: "From ₹200/plate" },
  { icon: "🌾", title: "Farm Retreats", desc: "Outdoor eco-dining setups for farmhouse events and nature retreats.", price: "From ₹300/plate" },
];

// ── Utility Hooks ─────────────────────────────────────────────────────────────
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; }
    catch { return initial; }
  });
  const save = useCallback(v => {
    setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key]);
  return [val, save];
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className="toast">✅ {msg}</div>;
}

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars({ n }) {
  return <span style={{ color: COLORS.accent, fontSize: 18 }}>{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

// ── Leaf SVG Decorations ───────────────────────────────────────────────────────
function LeafDeco({ size = 120, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity: 0.12, ...style }} fill={COLORS.leafGreen}>
      <path d="M50 5C50 5 10 25 10 55C10 75 28 90 50 90C72 90 90 75 90 55C90 25 50 5 50 5Z" />
      <line x1="50" y1="15" x2="50" y2="85" stroke={COLORS.leafGreen} strokeWidth="2" />
      <line x1="50" y1="40" x2="30" y2="55" stroke={COLORS.leafGreen} strokeWidth="1.5" />
      <line x1="50" y1="55" x2="70" y2="68" stroke={COLORS.leafGreen} strokeWidth="1.5" />
    </svg>
  );
}

// ── NavBar ─────────────────────────────────────────────────────────────────────
function NavBar({ page, setPage, isAdmin, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["Home", "Menu", "About", "Services", "Contact"];
  return (
    <nav className={scrolled ? "scrolled" : "top"}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setPage("Home")}>
          <div style={{ width: 42, height: 42, background: "rgba(255,255,255,0.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🌿</div>
          <div>
            <div className="playfair" style={{ color: "white", fontSize: 18, fontWeight: 700 }}>Pachhai</div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 10, letterSpacing: 2 }}>CATERING SERVICE</div>
          </div>
        </div>
        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {links.map(l => (
            <button key={l} onClick={() => setPage(l)}
              style={{ background: page === l ? "rgba(255,255,255,0.2)" : "transparent", color: "white", border: "none", padding: "8px 16px", borderRadius: 50, cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 600, fontSize: 14, transition: "all .2s" }}>
              {l}
            </button>
          ))}
          {isAdmin
            ? <><button onClick={() => setPage("Admin")} className="btn-primary btn-sm" style={{ marginLeft: 8 }}>Dashboard</button>
              <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "none", padding: "8px 14px", borderRadius: 50, cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 600, fontSize: 13, marginLeft: 4 }}>Logout</button></>
            : <button onClick={() => setPage("Login")} className="btn-primary btn-sm" style={{ marginLeft: 8 }}>Admin Login</button>
          }
        </div>
      </div>
    </nav>
  );
}

// ── HOME PAGE ──────────────────────────────────────────────────────────────────
function HomePage({ items, categories, setPage }) {
  const popular = items.filter(i => i.popular).slice(0, 4);
  return (
    <div>
      {/* Hero */}
      <section style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${COLORS.bark} 0%, ${COLORS.leafGreen} 50%, ${COLORS.lightGreen} 100%)`, position: "relative", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <LeafDeco size={300} style={{ position: "absolute", top: -60, right: -60, opacity: 0.06 }} />
        <LeafDeco size={200} style={{ position: "absolute", bottom: 80, left: -40, opacity: 0.07 }} />
        {/* Floating food emojis */}
        {["🌿", "🍌", "🌾", "🥥", "🍃"].map((e, i) => (
          <div key={i} style={{ position: "absolute", fontSize: 40, opacity: 0.15, animation: `float ${3 + i}s ease-in-out infinite`, animationDelay: `${i * 0.5}s`, top: `${15 + i * 15}%`, left: `${5 + i * 18}%` }}>{e}</div>
        ))}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div className="fade-up">
              <div style={{ background: "rgba(255,255,255,0.15)", display: "inline-block", padding: "6px 20px", borderRadius: 50, marginBottom: 20 }}>
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 700, letterSpacing: 3 }}>🌱 100% VEGETARIAN · ECO-FRIENDLY</span>
              </div>
              <h1 className="playfair hero-title" style={{ fontSize: "clamp(36px,5vw,62px)", color: "white", lineHeight: 1.15, marginBottom: 24 }}>
                Taste the <em>Village</em>,<br />Feel the <em>Earth</em>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 18, lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
                Authentic vegetarian catering rooted in centuries-old village traditions. Served on banana leaves, cooked in clay pots — pure, natural, soulful.
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button className="btn-primary" onClick={() => setPage("Menu")} style={{ fontSize: 16, padding: "16px 36px" }}>Explore Menu</button>
                <button onClick={() => setPage("Contact")} style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "2px solid rgba(255,255,255,0.4)", padding: "16px 36px", borderRadius: 50, cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 16, transition: "all .3s" }}>Book Now</button>
              </div>
              <div style={{ display: "flex", gap: 32, marginTop: 44 }}>
                {[["500+", "Events"], ["10K+", "Happy Plates"], ["25+", "Village Recipes"], ["100%", "Organic"]].map(([n, l]) => (
                  <div key={l}><div className="playfair" style={{ color: "white", fontSize: 26, fontWeight: 700 }}>{n}</div><div style={{ color: "rgba(255,255,255,.65)", fontSize: 12 }}>{l}</div></div>
                ))}
              </div>
            </div>
            {/* Hero image grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="fade-up">
              {MENU_IMAGES.slice(0, 4).map((img, i) => (
                <div key={i} style={{ borderRadius: 20, overflow: "hidden", height: i === 0 || i === 3 ? 220 : 160, transform: i % 2 === 1 ? "translateY(20px)" : "", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Wave */}
        <svg className="hero-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: 80 }}>
          <path d="M0,80L60,70C120,60,240,40,360,35C480,30,600,40,720,45C840,50,960,50,1080,45C1200,40,1320,30,1380,25L1440,20L1440,80L0,80Z" fill={COLORS.cream} />
        </svg>
      </section>

      {/* Why Us */}
      <section style={{ padding: "80px 24px", background: COLORS.cream }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <div className="section-label">WHY PACHHAI</div>
          <h2 className="playfair section-title" style={{ marginBottom: 16 }}>Rooted in Tradition, Pure at Heart</h2>
          <p style={{ color: COLORS.textMid, fontSize: 17, maxWidth: 580, margin: "0 auto 60px" }}>Every dish carries the warmth of grandmothers' kitchens and the freshness of village farms.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 24 }}>
            {[["🌿", "100% Natural", "No preservatives, no artificial colours. Just pure farm-to-plate cooking."],
              ["🍃", "Banana Leaf Serving", "Traditional serving on fresh banana leaves — natural, biodegradable, flavourful."],
              ["🏺", "Clay Pot Cooking", "Slow-cooked in handmade clay pots for authentic earthy flavour."],
              ["🌾", "Farm Sourced", "Vegetables sourced fresh daily from partnered organic farms."],
              ["♻️", "Zero Waste", "Eco-friendly packaging, composting, and minimal waste kitchen philosophy."],
              ["👨‍🍳", "Expert Chefs", "Cooks trained in village recipes passed down over 3 generations."]].map(([icon, title, text]) => (
              <div key={title} style={{ background: "white", borderRadius: 20, padding: 28, transition: "all .3s", boxShadow: "0 4px 20px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 10, color: COLORS.bark }}>{title}</h3>
                <p style={{ color: COLORS.textMid, fontSize: 14, lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section style={{ padding: "80px 24px", background: COLORS.paleGreen }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-label">MOST LOVED</div>
            <h2 className="playfair section-title">Village Favourites</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 28 }}>
            {popular.map(item => <FoodCard key={item.id} item={item} cat={categories.find(c => c.id === item.categoryId)} />)}
          </div>
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <button className="btn-primary" onClick={() => setPage("Menu")}>View Full Menu →</button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-label">LOVE FROM CUSTOMERS</div>
            <h2 className="playfair section-title">What They Say</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 28 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testi-card">
                <div style={{ marginTop: 32 }}>
                  <Stars n={t.rating} />
                  <p style={{ color: COLORS.textMid, fontSize: 15, lineHeight: 1.7, margin: "16px 0 20px" }}>{t.text}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: COLORS.paleGreen, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>
                    <div><div style={{ fontWeight: 700, color: COLORS.bark }}>{t.name}</div><div style={{ fontSize: 13, color: COLORS.textLight }}>{t.role}</div></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Snippet */}
      <section style={{ padding: "80px 24px", background: COLORS.darkCream }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-label">EVENT GALLERY</div>
            <h2 className="playfair section-title">Moments of Joy</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {GALLERY.slice(0, 6).map((g, i) => (
              <div key={i} className="gallery-item" style={{ height: i < 3 ? 220 : 160 }}>
                <img src={g.img} alt={g.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div className="gal-overlay"><span style={{ fontSize: 14, fontWeight: 700 }}>{g.label}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="booking-section" style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
          <h2 className="playfair" style={{ color: "white", fontSize: 38, marginBottom: 16 }}>Ready for Your Event?</h2>
          <p style={{ color: "rgba(255,255,255,.85)", fontSize: 17, marginBottom: 36 }}>From intimate gatherings to grand weddings — we bring village soul to every plate.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("Contact")} style={{ background: "white", color: COLORS.leafGreen, border: "none", padding: "16px 40px", borderRadius: 50, cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 16, transition: "all .3s" }}>Book a Consultation</button>
            <a href="https://wa.me/919876543210?text=Hi%20Pachhai%20Catering%2C%20I%20want%20to%20book%20catering!" target="_blank" rel="noreferrer" style={{ background: "#25D366", color: "white", border: "none", padding: "16px 40px", borderRadius: 50, cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-block" }}>WhatsApp Us 📱</a>
          </div>
        </div>
      </section>

      {/* Map */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div className="section-label">FIND US</div>
            <h2 className="playfair section-title">Our Kitchen is in the Village</h2>
            <p style={{ color: COLORS.textMid, marginTop: 12 }}>📍 12/3, Panchayat Road, Marudur Village, Thanjavur, Tamil Nadu 613 501</p>
          </div>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,.1)", height: 380 }}>
            <iframe title="Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.86834861988!2d79.01503673765157!3d10.785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baab89cea453867%3A0x57b679b7e9e23a5!2sThanjavur%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%" height="380" style={{ border: 0 }} allowFullScreen loading="lazy" />
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Food Card ─────────────────────────────────────────────────────────────────
function FoodCard({ item, cat }) {
  return (
    <div className="food-card" style={{ position: "relative" }}>
      <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
        <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s" }}
          onMouseEnter={e => e.target.style.transform = "scale(1.08)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"} />
        <div className="card-overlay">
          <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{item.desc}</span>
        </div>
        {item.popular && <div style={{ position: "absolute", top: 12, right: 12, background: COLORS.accent, color: "white", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 50 }}>⭐ Popular</div>}
      </div>
      <div style={{ padding: "18px 20px" }}>
        {cat && <div style={{ fontSize: 11, color: COLORS.leafGreen, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>{cat.icon} {cat.name}</div>}
        <h3 style={{ fontWeight: 700, color: COLORS.bark, marginBottom: 8, fontSize: 16 }}>{item.name}</h3>
        <p style={{ color: COLORS.textMid, fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>{item.desc}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="playfair" style={{ fontSize: 22, fontWeight: 700, color: COLORS.leafGreen }}>₹{item.price}</span>
          <span style={{ fontSize: 12, color: COLORS.textLight }}>{item.orders} orders</span>
        </div>
      </div>
    </div>
  );
}

// ── MENU PAGE ──────────────────────────────────────────────────────────────────
function MenuPage({ items, categories }) {
  const [activeCat, setActiveCat] = useState(0);
  const [search, setSearch] = useState("");
  const filtered = items.filter(i =>
    (activeCat === 0 || i.categoryId === activeCat) &&
    (i.name.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div style={{ paddingTop: 68 }}>
      {/* Banner */}
      <div style={{ background: `linear-gradient(135deg,${COLORS.bark},${COLORS.leafGreen})`, padding: "60px 24px", textAlign: "center" }}>
        <div className="section-label" style={{ color: "rgba(255,255,255,.7)" }}>PURE VEGETARIAN</div>
        <h1 className="playfair" style={{ color: "white", fontSize: 46, marginBottom: 16 }}>Our Village Menu</h1>
        <p style={{ color: "rgba(255,255,255,.8)", fontSize: 17 }}>Farm-fresh ingredients · Traditional recipes · Served with love</p>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        {/* Search */}
        <div style={{ maxWidth: 500, margin: "0 auto 32px", position: "relative" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search dishes..." style={{ paddingLeft: 48, borderRadius: 50, background: "white" }} />
          <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>🔍</span>
          {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>✕</button>}
        </div>
        {/* Category Filter */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 44 }}>
          <button className={`cat-tag${activeCat === 0 ? " active" : ""}`} onClick={() => setActiveCat(0)}>🌿 All Items</button>
          {categories.map(c => (
            <button key={c.id} className={`cat-tag${activeCat === c.id ? " active" : ""}`} onClick={() => setActiveCat(c.id)}>{c.icon} {c.name}</button>
          ))}
        </div>
        {filtered.length === 0
          ? <div style={{ textAlign: "center", padding: 60, color: COLORS.textLight }}>
            <div style={{ fontSize: 48 }}>🍃</div>
            <p style={{ marginTop: 16 }}>No dishes found. Try a different search.</p>
          </div>
          : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 28 }}>
            {filtered.map(item => <FoodCard key={item.id} item={item} cat={categories.find(c => c.id === item.categoryId)} />)}
          </div>
        }
      </div>
    </div>
  );
}

// ── ABOUT PAGE ─────────────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <div style={{ paddingTop: 68 }}>
      <div style={{ background: `linear-gradient(135deg,${COLORS.bark},${COLORS.midGreen})`, padding: "80px 24px", textAlign: "center" }}>
        <div className="section-label" style={{ color: "rgba(255,255,255,.7)" }}>OUR STORY</div>
        <h1 className="playfair" style={{ color: "white", fontSize: 48 }}>Born in the Village</h1>
      </div>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", marginBottom: 80 }}>
          <div>
            <div className="section-label">OUR ROOTS</div>
            <h2 className="playfair section-title" style={{ marginBottom: 20 }}>Three Generations of Village Cooking</h2>
            <p style={{ color: COLORS.textMid, lineHeight: 1.8, marginBottom: 18 }}>Pachhai Catering was born in the heart of Thanjavur district, Tamil Nadu, where our founder Rajan's grandmother cooked for village festivals on firewood stoves, in earthen pots, with herbs picked at dawn.</p>
            <p style={{ color: COLORS.textMid, lineHeight: 1.8 }}>In 2010, Rajan carried those memories into a modern catering service — preserving every secret recipe, every hand-ground masala, every leaf-serving tradition — while scaling it to serve thousands.</p>
          </div>
          <div style={{ borderRadius: 24, overflow: "hidden", height: 380, boxShadow: "0 20px 60px rgba(0,0,0,.15)" }}>
            <img src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&q=80" alt="Village kitchen" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
        {/* Values */}
        <div style={{ background: COLORS.paleGreen, borderRadius: 28, padding: 48, marginBottom: 60 }}>
          <h3 className="playfair" style={{ color: COLORS.bark, fontSize: 32, textAlign: "center", marginBottom: 40 }}>Our Values</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 28 }}>
            {[["🌱", "Purity", "Only natural, chemical-free produce touches our kitchen."],
              ["🤝", "Community", "Supporting local farmers and village artisans."],
              ["♻️", "Sustainability", "Zero-waste cooking with compost and minimal packaging."],
              ["❤️", "Love", "Food cooked with intention, patience, and heart."]].map(([icon, title, text]) => (
              <div key={title} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
                <h4 style={{ fontWeight: 700, color: COLORS.bark, marginBottom: 8 }}>{title}</h4>
                <p style={{ color: COLORS.textMid, fontSize: 14, lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Team */}
        <div style={{ textAlign: "center" }}>
          <h3 className="playfair" style={{ color: COLORS.bark, fontSize: 32, marginBottom: 40 }}>Our Team</h3>
          <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
            {[["👨‍🍳", "Rajan Krishnaswamy", "Founder & Head Chef", "30 years of village cooking mastery"],
              ["👩‍🍳", "Meenakshi Devi", "Traditional Sweets Expert", "Grandmother's recipes brought to life"],
              ["👨‍🌾", "Selvam Murugan", "Farm Liaison", "Ensures freshest organic sourcing daily"]].map(([icon, name, role, bio]) => (
              <div key={name} style={{ background: "white", borderRadius: 20, padding: 28, width: 240, boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>{icon}</div>
                <h4 style={{ fontWeight: 700, color: COLORS.bark }}>{name}</h4>
                <div style={{ color: COLORS.leafGreen, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{role}</div>
                <p style={{ color: COLORS.textMid, fontSize: 13, lineHeight: 1.5 }}>{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SERVICES PAGE ──────────────────────────────────────────────────────────────
function ServicesPage({ setPage }) {
  return (
    <div style={{ paddingTop: 68 }}>
      <div style={{ background: `linear-gradient(135deg,${COLORS.leafGreen},${COLORS.lightGreen})`, padding: "80px 24px", textAlign: "center" }}>
        <div className="section-label" style={{ color: "rgba(255,255,255,.7)" }}>WHAT WE DO</div>
        <h1 className="playfair" style={{ color: "white", fontSize: 48, marginBottom: 16 }}>Our Catering Services</h1>
        <p style={{ color: "rgba(255,255,255,.85)", fontSize: 17 }}>Village food, delivered with dignity — for every occasion.</p>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 28, marginBottom: 80 }}>
          {SERVICES.map((s, i) => (
            <div key={i} style={{ background: "white", borderRadius: 24, padding: 36, boxShadow: "0 4px 24px rgba(0,0,0,.06)", transition: "all .3s", borderTop: `4px solid ${COLORS.lightGreen}` }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>{s.icon}</div>
              <h3 style={{ fontWeight: 700, color: COLORS.bark, fontSize: 20, marginBottom: 12 }}>{s.title}</h3>
              <p style={{ color: COLORS.textMid, lineHeight: 1.7, marginBottom: 20 }}>{s.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ background: COLORS.paleGreen, color: COLORS.leafGreen, padding: "6px 16px", borderRadius: 50, fontSize: 13, fontWeight: 700 }}>{s.price}</span>
                <button className="btn-secondary btn-sm" onClick={() => setPage("Contact")}>Book</button>
              </div>
            </div>
          ))}
        </div>
        {/* Process */}
        <div style={{ background: COLORS.paleGreen, borderRadius: 28, padding: 48 }}>
          <h3 className="playfair" style={{ color: COLORS.bark, fontSize: 32, textAlign: "center", marginBottom: 40 }}>How It Works</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 24 }}>
            {[["1", "📞", "Enquire", "Call or fill the booking form with your event details"],
              ["2", "🤝", "Discuss", "We customize menu, quantity, and serving style for your event"],
              ["3", "✅", "Confirm", "Get a quote, confirm with advance payment"],
              ["4", "🍃", "We Serve", "Our team arrives fully equipped for fresh, village-style service"]].map(([n, icon, title, text]) => (
              <div key={n} style={{ textAlign: "center", position: "relative" }}>
                <div style={{ width: 52, height: 52, background: COLORS.leafGreen, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 20, margin: "0 auto 12px" }}>{n}</div>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
                <h4 style={{ fontWeight: 700, color: COLORS.bark, marginBottom: 8 }}>{title}</h4>
                <p style={{ color: COLORS.textMid, fontSize: 13, lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CONTACT PAGE ───────────────────────────────────────────────────────────────
function ContactPage({ onBook }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", event: "Wedding", date: "", guests: "", msg: "" });
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.name || !form.phone) return;
    onBook({ ...form, id: Date.now(), status: "Pending" });
    setSent(true);
    setForm({ name: "", email: "", phone: "", event: "Wedding", date: "", guests: "", msg: "" });
    setTimeout(() => setSent(false), 5000);
  };
  return (
    <div style={{ paddingTop: 68 }}>
      <div style={{ background: `linear-gradient(135deg,${COLORS.bark},${COLORS.midGreen})`, padding: "80px 24px", textAlign: "center" }}>
        <h1 className="playfair" style={{ color: "white", fontSize: 48 }}>Book Your Event</h1>
        <p style={{ color: "rgba(255,255,255,.8)", marginTop: 12 }}>Fill the form or WhatsApp us — we respond within 2 hours!</p>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 60 }}>
        {/* Contact Info */}
        <div>
          <h2 className="playfair" style={{ color: COLORS.bark, fontSize: 28, marginBottom: 28 }}>Get in Touch</h2>
          {[["📞", "Phone", "+91 98765 43210", "tel:+919876543210"],
            ["📧", "Email", "hello@pachhai.in", "mailto:hello@pachhai.in"],
            ["📍", "Address", "12/3 Panchayat Road, Marudur, Thanjavur, TN 613501", null],
            ["🕐", "Hours", "Mon–Sat: 8am–8pm | Sun: 9am–5pm", null]].map(([icon, label, val, href]) => (
            <div key={label} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 24, padding: 20, background: "white", borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,.05)" }}>
              <div style={{ fontSize: 26, flexShrink: 0 }}>{icon}</div>
              <div><div style={{ fontSize: 12, fontWeight: 700, color: COLORS.lightGreen, letterSpacing: 1, marginBottom: 4 }}>{label}</div>
                {href ? <a href={href} style={{ color: COLORS.bark, fontWeight: 600, textDecoration: "none" }}>{val}</a> : <div style={{ color: COLORS.textMid, fontSize: 14 }}>{val}</div>}
              </div>
            </div>
          ))}
          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, background: "#25D366", color: "white", padding: "16px 28px", borderRadius: 16, textDecoration: "none", fontWeight: 700, fontSize: 16, marginTop: 8 }}>
            <span style={{ fontSize: 24 }}>💬</span> Chat on WhatsApp
          </a>
        </div>
        {/* Booking Form */}
        <div style={{ background: "white", borderRadius: 24, padding: 40, boxShadow: "0 8px 40px rgba(0,0,0,.08)" }}>
          {sent
            ? <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 64 }}>🎉</div>
              <h3 className="playfair" style={{ color: COLORS.leafGreen, fontSize: 28, margin: "16px 0 12px" }}>Booking Received!</h3>
              <p style={{ color: COLORS.textMid }}>We'll call you within 2 hours to confirm your event details.</p>
            </div>
            : <>
              <h3 className="playfair" style={{ color: COLORS.bark, fontSize: 24, marginBottom: 28 }}>Booking Request</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div><label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Your Name *</label><input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Rajan Kumar" /></div>
                <div><label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Phone *</label><input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="98765 43210" /></div>
              </div>
              <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Email</label><input value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@email.com" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div><label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Event Type</label>
                  <select value={form.event} onChange={e => set("event", e.target.value)}>
                    {["Wedding", "Birthday Party", "Corporate", "Temple Festival", "House Function", "Farm Retreat", "Other"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div><label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Event Date</label><input type="date" value={form.date} onChange={e => set("date", e.target.value)} /></div>
              </div>
              <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, display: "block", marginBottom: 6 }}>No. of Guests</label><input type="number" value={form.guests} onChange={e => set("guests", e.target.value)} placeholder="e.g. 200" /></div>
              <div style={{ marginBottom: 24 }}><label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Message / Special Requirements</label><textarea value={form.msg} onChange={e => set("msg", e.target.value)} placeholder="Tell us about your event, dietary needs, etc." rows={4} /></div>
              <button className="btn-primary" onClick={submit} style={{ width: "100%", fontSize: 16, padding: "16px" }}>Submit Booking Request 🌿</button>
            </>}
        </div>
      </div>
    </div>
  );
}

// ── LOGIN PAGE ─────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState("");
  const submit = () => {
    if (u === "admin" && p === "pachhai2024") { onLogin(); setErr(""); }
    else setErr("Invalid credentials. Try admin / pachhai2024");
  };
  return (
    <div style={{ paddingTop: 68, minHeight: "100vh", background: `linear-gradient(135deg,${COLORS.cream},${COLORS.paleGreen})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: 28, padding: 48, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 48 }}>🌿</div>
          <h2 className="playfair" style={{ color: COLORS.bark, fontSize: 28, marginTop: 12 }}>Admin Login</h2>
          <p style={{ color: COLORS.textLight, fontSize: 14, marginTop: 8 }}>Pachhai Catering Dashboard</p>
          <p style={{ color: COLORS.textLight, fontSize: 12, marginTop: 4, background: COLORS.paleGreen, padding: "6px 12px", borderRadius: 8 }}>Demo: username <b>admin</b> · password <b>pachhai2024</b></p>
        </div>
        <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Username</label><input value={u} onChange={e => setU(e.target.value)} placeholder="admin" /></div>
        <div style={{ marginBottom: 24 }}><label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Password</label><input type="password" value={p} onChange={e => setP(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && submit()} /></div>
        {err && <p style={{ color: COLORS.red, fontSize: 13, marginBottom: 16 }}>{err}</p>}
        <button className="btn-primary" onClick={submit} style={{ width: "100%", fontSize: 16 }}>Login to Dashboard</button>
      </div>
    </div>
  );
}

// ── ADMIN DASHBOARD ────────────────────────────────────────────────────────────
function AdminDashboard({ items, setItems, categories, setCategories, bookings, setBookings, toast }) {
  const [tab, setTab] = useState("overview");
  const [modal, setModal] = useState(null); // {type, data}

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "menu", label: "🍛 Menu Items" },
    { id: "categories", label: "🏷️ Categories" },
    { id: "bookings", label: "📋 Bookings" },
  ];

  const deleteItem = id => { setItems(items.filter(i => i.id !== id)); toast("Item deleted"); };
  const deleteCat = id => { setCategories(categories.filter(c => c.id !== id)); toast("Category deleted"); };
  const updateBookingStatus = (id, status) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    toast(`Booking marked as ${status}`);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", paddingTop: 68, background: COLORS.cream }}>
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(255,255,255,.1)", marginBottom: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "white" }}>🌿 Admin Panel</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 4 }}>Pachhai Catering</div>
        </div>
        {tabs.map(t => (
          <div key={t.id} className={`sidebar-link${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {tab === "overview" && <AdminOverview items={items} bookings={bookings} categories={categories} />}
        {tab === "menu" && <AdminMenu items={items} categories={categories} onDelete={deleteItem} onAdd={() => setModal({ type: "addItem" })} onEdit={item => setModal({ type: "editItem", data: item })} />}
        {tab === "categories" && <AdminCategories categories={categories} onDelete={deleteCat} onAdd={() => setModal({ type: "addCat" })} />}
        {tab === "bookings" && <AdminBookings bookings={bookings} onStatus={updateBookingStatus} />}
      </div>

      {/* Modals */}
      {modal?.type === "addItem" && <ItemFormModal title="Add Menu Item" categories={categories} onClose={() => setModal(null)} onSave={d => { setItems([...items, { ...d, id: Date.now(), orders: 0 }]); setModal(null); toast("Item added!"); }} />}
      {modal?.type === "editItem" && <ItemFormModal title="Edit Item" categories={categories} initial={modal.data} onClose={() => setModal(null)} onSave={d => { setItems(items.map(i => i.id === modal.data.id ? { ...i, ...d } : i)); setModal(null); toast("Item updated!"); }} />}
      {modal?.type === "addCat" && <CatFormModal onClose={() => setModal(null)} onSave={d => { setCategories([...categories, { ...d, id: Date.now() }]); setModal(null); toast("Category added!"); }} />}
    </div>
  );
}

function AdminOverview({ items, bookings, categories }) {
  const totalOrders = items.reduce((s, i) => s + i.orders, 0);
  const topItems = [...items].sort((a, b) => b.orders - a.orders).slice(0, 5);
  const statusCounts = bookings.reduce((a, b) => { a[b.status] = (a[b.status] || 0) + 1; return a; }, {});
  return (
    <div>
      <h2 className="playfair" style={{ color: COLORS.bark, fontSize: 28, marginBottom: 28 }}>Dashboard Overview</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 36 }}>
        {[[items.length, "Menu Items", "🍛"], [categories.length, "Categories", "🏷️"], [bookings.length, "Total Bookings", "📋"], [totalOrders, "Total Orders", "⭐"]].map(([n, l, icon]) => (
          <div key={l} className="stat-card">
            <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
            <div className="playfair" style={{ fontSize: 36, fontWeight: 700, color: COLORS.leafGreen }}>{n}</div>
            <div style={{ color: COLORS.textMid, fontSize: 13, marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        {/* Top items */}
        <div style={{ background: "white", borderRadius: 20, padding: 28 }}>
          <h3 style={{ fontWeight: 700, color: COLORS.bark, marginBottom: 20 }}>🏆 Top Ordered Items</h3>
          {topItems.map((item, i) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 4 ? `1px solid ${COLORS.darkCream}` : "none" }}>
              <div style={{ width: 32, height: 32, background: COLORS.paleGreen, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: COLORS.leafGreen }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.bark }}>{item.name}</div>
                <div style={{ fontSize: 12, color: COLORS.textLight }}>₹{item.price}</div>
              </div>
              <div style={{ background: COLORS.paleGreen, color: COLORS.leafGreen, padding: "4px 12px", borderRadius: 50, fontSize: 12, fontWeight: 700 }}>{item.orders} orders</div>
            </div>
          ))}
        </div>
        {/* Booking status */}
        <div style={{ background: "white", borderRadius: 20, padding: 28 }}>
          <h3 style={{ fontWeight: 700, color: COLORS.bark, marginBottom: 20 }}>📋 Booking Status</h3>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{status}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.leafGreen }}>{count}</span>
                </div>
                <div style={{ height: 8, background: COLORS.paleGreen, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 4, background: status === "Confirmed" ? COLORS.leafGreen : COLORS.accent, width: `${(count / bookings.length) * 100}%`, transition: "width .6s ease" }} />
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20, padding: "14px 0", borderTop: `1px solid ${COLORS.darkCream}`, fontSize: 14, color: COLORS.textMid }}>Total bookings: <b style={{ color: COLORS.bark }}>{bookings.length}</b></div>
        </div>
      </div>
    </div>
  );
}

function AdminMenu({ items, categories, onDelete, onAdd, onEdit }) {
  const [search, setSearch] = useState("");
  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 className="playfair" style={{ color: COLORS.bark, fontSize: 28 }}>Menu Items</h2>
        <button className="btn-primary" onClick={onAdd}>+ Add Item</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." style={{ marginBottom: 20, maxWidth: 320 }} />
      <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead style={{ background: COLORS.paleGreen }}>
            <tr>{["Image", "Name", "Category", "Price", "Orders", "Popular", "Actions"].map(h => <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: COLORS.bark, fontWeight: 700 }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => {
              const cat = categories.find(c => c.id === item.categoryId);
              return (
                <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.darkCream}`, background: i % 2 === 0 ? "white" : COLORS.cream }}>
                  <td style={{ padding: "12px 16px" }}><img src={item.img} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover" }} /></td>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: COLORS.bark }}>{item.name}</td>
                  <td style={{ padding: "12px 16px" }}>{cat ? `${cat.icon} ${cat.name}` : "-"}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: COLORS.leafGreen }}>₹{item.price}</td>
                  <td style={{ padding: "12px 16px" }}>{item.orders}</td>
                  <td style={{ padding: "12px 16px" }}>{item.popular ? "⭐" : "—"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn-edit" onClick={() => onEdit(item)}>Edit</button>
                      <button className="btn-danger" onClick={() => onDelete(item.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminCategories({ categories, onDelete, onAdd }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 className="playfair" style={{ color: COLORS.bark, fontSize: 28 }}>Categories</h2>
        <button className="btn-primary" onClick={onAdd}>+ Add Category</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 20 }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ background: "white", borderRadius: 16, padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 16px rgba(0,0,0,.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: cat.color || COLORS.paleGreen, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{cat.icon}</div>
              <div><div style={{ fontWeight: 700, color: COLORS.bark }}>{cat.name}</div><div style={{ fontSize: 12, color: COLORS.textLight }}>ID: {cat.id}</div></div>
            </div>
            <button className="btn-danger" onClick={() => onDelete(cat.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminBookings({ bookings, onStatus }) {
  return (
    <div>
      <h2 className="playfair" style={{ color: COLORS.bark, fontSize: 28, marginBottom: 24 }}>Bookings & Enquiries</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {bookings.length === 0 && <div style={{ textAlign: "center", padding: 60, color: COLORS.textLight }}>No bookings yet.</div>}
        {bookings.map(b => (
          <div key={b.id} style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 16px rgba(0,0,0,.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, color: COLORS.bark, fontSize: 17 }}>{b.name}</div>
                <div style={{ fontSize: 13, color: COLORS.textMid, marginTop: 4 }}>{b.email} · {b.phone}</div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ padding: "6px 14px", borderRadius: 50, fontSize: 12, fontWeight: 700, background: b.status === "Confirmed" ? COLORS.paleGreen : COLORS.accentLight, color: b.status === "Confirmed" ? COLORS.leafGreen : COLORS.earthBrown }}>{b.status}</span>
                {b.status === "Pending" && <button className="btn-primary btn-sm" onClick={() => onStatus(b.id, "Confirmed")}>Confirm</button>}
                {b.status === "Confirmed" && <button className="btn-danger" style={{ borderRadius: 8 }} onClick={() => onStatus(b.id, "Cancelled")}>Cancel</button>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 16, flexWrap: "wrap" }}>
              {[["🎊", b.event], ["📅", b.date], ["👥", `${b.guests} guests`]].map(([icon, val]) => val && (
                <div key={val} style={{ fontSize: 13, color: COLORS.textMid }}>{icon} {val}</div>
              ))}
            </div>
            {b.msg && <div style={{ marginTop: 12, padding: 12, background: COLORS.paleGreen, borderRadius: 10, fontSize: 13, color: COLORS.textMid }}>{b.msg}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Item Form Modal ────────────────────────────────────────────────────────────
function ItemFormModal({ title, categories, initial = {}, onClose, onSave }) {
  const [f, setF] = useState({ name: "", desc: "", price: "", categoryId: categories[0]?.id || 1, img: MENU_IMAGES[0], popular: false, ...initial });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <h3 className="playfair" style={{ color: COLORS.bark, fontSize: 24, marginBottom: 24 }}>{title}</h3>
        <div style={{ marginBottom: 14 }}><label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Item Name</label><input value={f.name} onChange={e => set("name", e.target.value)} placeholder="Village Style Pongal" /></div>
        <div style={{ marginBottom: 14 }}><label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Description</label><textarea value={f.desc} onChange={e => set("desc", e.target.value)} rows={2} placeholder="Short description..." /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div><label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Price (₹)</label><input type="number" value={f.price} onChange={e => set("price", +e.target.value)} placeholder="120" /></div>
          <div><label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Category</label>
            <select value={f.categoryId} onChange={e => set("categoryId", +e.target.value)}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}><label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Image URL</label><input value={f.img} onChange={e => set("img", e.target.value)} placeholder="https://..." /></div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, cursor: "pointer" }}>
          <input type="checkbox" checked={f.popular} onChange={e => set("popular", e.target.checked)} style={{ width: "auto" }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.textMid }}>⭐ Mark as Popular</span>
        </label>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => f.name && onSave(f)}>Save Item</button>
        </div>
      </div>
    </div>
  );
}

// ── Category Form Modal ────────────────────────────────────────────────────────
function CatFormModal({ onClose, onSave }) {
  const [f, setF] = useState({ name: "", icon: "🍽️", color: COLORS.paleGreen });
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 400 }}>
        <h3 className="playfair" style={{ color: COLORS.bark, fontSize: 22, marginBottom: 24 }}>Add Category</h3>
        <div style={{ marginBottom: 14 }}><label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Category Name</label><input value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} placeholder="Rice & Biryani" /></div>
        <div style={{ marginBottom: 24 }}><label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Icon (emoji)</label><input value={f.icon} onChange={e => setF(p => ({ ...p, icon: e.target.value }))} placeholder="🍚" /></div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => f.name && onSave(f)}>Add Category</button>
        </div>
      </div>
    </div>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background: COLORS.bark, color: "rgba(255,255,255,.75)", padding: "60px 24px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>🌿</span>
              <span className="playfair" style={{ color: "white", fontSize: 22 }}>Pachhai</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>Authentic vegetarian catering rooted in village traditions. Banana leaves, mud pots, and centuries of love in every bite.</p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {["📘", "📸", "🐦", "▶️"].map((icon, i) => (
                <div key={i} style={{ width: 38, height: 38, background: "rgba(255,255,255,.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>{icon}</div>
              ))}
            </div>
          </div>
          {[["Quick Links", ["Home", "Menu", "About", "Services", "Contact"]],
            ["Services", ["Wedding Feasts", "Birthday Parties", "Corporate", "Temple Events", "Farm Retreats"]],
            ["Contact", ["📞 +91 98765 43210", "📧 hello@pachhai.in", "📍 Thanjavur, TN", "🕐 Mon–Sat 8am–8pm"]]].map(([title, links]) => (
            <div key={title}>
              <h4 style={{ color: "white", fontWeight: 700, marginBottom: 16, fontSize: 15 }}>{title}</h4>
              {links.map(l => (
                <div key={l} onClick={() => ["Home", "Menu", "About", "Services", "Contact"].includes(l) && setPage(l)}
                  style={{ marginBottom: 10, fontSize: 13, cursor: "pointer", transition: "color .2s" }}
                  onMouseEnter={e => e.target.style.color = COLORS.lightGreen}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.75)"}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 13 }}>
          <span>© 2025 Pachhai Catering Service. All rights reserved.</span>
          <span style={{ color: COLORS.lightGreen }}>🌿 100% Vegetarian · Eco-Friendly · Village Tradition</span>
        </div>
      </div>
    </footer>
  );
}

// ── APP ROOT ───────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("Home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useLocalStorage("pachhai_items", INIT_ITEMS);
  const [categories, setCategories] = useLocalStorage("pachhai_cats", INIT_CATEGORIES);
  const [bookings, setBookings] = useLocalStorage("pachhai_bookings", INIT_BOOKINGS);
  const [toastMsg, setToastMsg] = useState("");

  const toast = msg => setToastMsg(msg);
  const addBooking = data => { setBookings(prev => [{ ...data, id: Date.now() }, ...prev]); toast("Booking request sent!"); };

  const showFooter = !["Login", "Admin"].includes(page);

  return (
    <>
      <style>{css}</style>
      <NavBar page={page} setPage={setPage} isAdmin={isAdmin} onLogout={() => { setIsAdmin(false); setPage("Home"); }} />
      {page === "Home" && <HomePage items={items} categories={categories} setPage={setPage} />}
      {page === "Menu" && <MenuPage items={items} categories={categories} />}
      {page === "About" && <AboutPage />}
      {page === "Services" && <ServicesPage setPage={setPage} />}
      {page === "Contact" && <ContactPage onBook={addBooking} />}
      {page === "Login" && <LoginPage onLogin={() => { setIsAdmin(true); setPage("Admin"); }} />}
      {page === "Admin" && isAdmin && <AdminDashboard items={items} setItems={setItems} categories={categories} setCategories={setCategories} bookings={bookings} setBookings={setBookings} toast={toast} />}
      {page === "Admin" && !isAdmin && <LoginPage onLogin={() => { setIsAdmin(true); setPage("Admin"); }} />}
      {showFooter && <Footer setPage={setPage} />}
      {toastMsg && <Toast msg={toastMsg} onClose={() => setToastMsg("")} />}
    </>
  );
}
