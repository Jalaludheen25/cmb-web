/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CMB CARGO — SITE CONTENT
 * ═══════════════════════════════════════════════════════════════════════════
 *  Every string, statistic and address the site renders lives in this file.
 *  Nothing is hard-coded inside components, so the client can revise copy
 *  without touching layout or animation code.
 *
 *  ⚠️  PLACEHOLDER DATA
 *  Items marked `PLACEHOLDER` below are plausible stand-ins written to make
 *  the design read correctly. They are NOT verified facts about CMB Cargo and
 *  must be replaced with real figures before launch:
 *    · site.contact  (phone, email, postal address, trade licence no.)
 *    · stats         (all four figures)
 *    · certifications
 *    · testimonials  (names, companies, quotes)
 *    · insights      (article titles, dates)
 *    · footprint     (office list)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const site = {
  name: "CMB Cargo",
  legalName: "CMB Cargo LLC",
  domain: "cmbcargo.ae",
  url: "https://cmbcargo.ae",
  tagline: "Freight, forwarded with precision.",
  description:
    "CMB Cargo is a UAE freight forwarding and contract logistics company moving sea, air and land cargo between the Gulf and 120 markets worldwide.",
  founded: 2009,

  /** PLACEHOLDER — replace every field with the client's real details. */
  contact: {
    phone: "+971 4 000 0000",
    phoneHref: "+97140000000",
    whatsapp: "+971 50 000 0000",
    email: "hello@cmbcargo.ae",
    salesEmail: "quotes@cmbcargo.ae",
    address: {
      line1: "Jebel Ali Free Zone (JAFZA)",
      line2: "Warehouse Complex, Gate 4",
      city: "Dubai",
      country: "United Arab Emirates",
      poBox: "P.O. Box 00000",
    },
    hours: "Operations desk staffed 24 / 7 · Office Mon–Sat, 08:00–18:00 GST",
    coordinates: { lat: 25.0106, lng: 55.0611 },
  },

  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "X", href: "https://x.com/" },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────────────
   NAVIGATION
   ───────────────────────────────────────────────────────────────────────── */

export const navigation = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Network", href: "/#network" },
  { label: "Contact", href: "/contact" },
] as const;

/* ─────────────────────────────────────────────────────────────────────────
   HERO
   ───────────────────────────────────────────────────────────────────────── */

export const hero = {
  eyebrow: "Dubai · United Arab Emirates",
  /** Rendered as separate mask-revealed lines. Keep each line short — long
   *  lines wrap inside the mask and blunt the staggered reveal. */
  headline: ["Move cargo", "like it", "matters."],
  standfirst:
    "From Jebel Ali to any berth, runway or border post that matters to your business — CMB Cargo plans the route, clears the paperwork and answers the phone.",
  primaryCta: { label: "Request a rate", href: "/contact" },
  secondaryCta: { label: "Our services", href: "/services" },
  /** Live ticker along the base of the hero. */
  ticker: [
    { label: "Sea", value: "FCL · LCL · Breakbulk" },
    { label: "Air", value: "DWC · DXB · AUH" },
    { label: "Road", value: "GCC cross-border" },
    { label: "Desk", value: "24 / 7" },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────────────
   MANIFESTO
   ───────────────────────────────────────────────────────────────────────── */

export const manifesto = {
  eyebrow: "What we are",
  /** Word-by-word scroll reveal. Keep it one sentence. */
  body:
    "We are a freight forwarder built around a simple, unglamorous promise: that the person who quoted your shipment is the person who still owns it at 3am when a vessel rolls, a border closes, or a consignee changes their mind.",
  signature: "— The operations desk, Jebel Ali",
} as const;

/* ─────────────────────────────────────────────────────────────────────────
   SERVICES
   ───────────────────────────────────────────────────────────────────────── */

export type Service = {
  slug: string;
  index: string;
  title: string;
  short: string;
  summary: string;
  image: string;
  capabilities: string[];
  detail: {
    intro: string;
    points: { title: string; body: string }[];
  };
};

export const services: Service[] = [
  {
    slug: "sea-freight",
    index: "01",
    title: "Sea Freight",
    short: "FCL, LCL, breakbulk and chartering through the Gulf's deep-water gateways.",
    summary:
      "Weekly consolidations out of Jebel Ali and direct allocations with carriers on the Asia, Europe and East Africa trades — with the vessel schedules checked by a human before we quote them.",
    image: "/images/services/sea-freight.jpg",
    capabilities: [
      "Full container load (FCL)",
      "Groupage & LCL consolidation",
      "Breakbulk and RoRo",
      "Vessel chartering",
      "Reefer & controlled atmosphere",
      "Port-to-door delivery",
    ],
    detail: {
      intro:
        "Ocean is still where the economics live. We hold space with carriers on the corridors our clients actually use, and we would rather tell you a sailing is tight than book you onto one that will roll.",
      points: [
        {
          title: "Gateway coverage",
          body: "Jebel Ali, Khalifa Port, Port Rashid, Sharjah and Fujairah — plus feeder connectivity across the Upper Gulf.",
        },
        {
          title: "Consolidation programme",
          body: "Fixed-day LCL departures on the main trades, so part-load shippers get a schedule they can plan production around.",
        },
        {
          title: "Cargo that will not fit a box",
          body: "Breakbulk, flat-rack and open-top handling with lift studies completed before the booking is confirmed.",
        },
      ],
    },
  },
  {
    slug: "air-freight",
    index: "02",
    title: "Air Freight",
    short: "Time-critical uplift through Al Maktoum, Dubai International and Abu Dhabi.",
    summary:
      "When the cost of being late exceeds the cost of flying, we move — general cargo, express consolidations, charters and AOG parts released against a phone call.",
    image: "/images/services/air-freight.jpg",
    capabilities: [
      "Airport-to-airport & door-to-door",
      "Express consolidations",
      "Full & part charter",
      "AOG and critical spares",
      "Temperature-controlled uplift",
      "Dangerous goods (IATA DGR)",
    ],
    detail: {
      intro:
        "Air freight is bought under pressure, which is exactly when clarity matters most. You get the real transit, the real cut-off and the real all-in rate — before you commit.",
      points: [
        {
          title: "Three UAE gateways",
          body: "Al Maktoum (DWC), Dubai International (DXB) and Abu Dhabi (AUH), selected on capacity and cut-off rather than habit.",
        },
        {
          title: "Charter desk",
          body: "Access to freighter capacity for oversize, project and emergency movements, with route and permit handling included.",
        },
        {
          title: "Cold chain",
          body: "Validated packaging, active containers and airside handling for pharmaceutical and perishable consignments.",
        },
      ],
    },
  },
  {
    slug: "land-transport",
    index: "03",
    title: "Land Transport",
    short: "Cross-border trucking across the UAE, Saudi Arabia, Oman and the wider GCC.",
    summary:
      "A vetted fleet and a border desk that knows which crossing is moving today. Full loads, part loads, curtain-siders, flatbeds, reefers and bonded movements.",
    image: "/images/services/land-transport.jpg",
    capabilities: [
      "GCC cross-border haulage",
      "FTL & LTL domestic distribution",
      "Bonded and transit movements",
      "Reefer and dry-box trailers",
      "Low-bed & extendable trailers",
      "Last-mile distribution",
    ],
    detail: {
      intro:
        "Road is where schedules are quietly won and lost. We manage the crossings, the escorts and the paperwork, and we tell you where the truck actually is.",
      points: [
        {
          title: "Border intelligence",
          body: "Live view on queue times and closures at the main GCC crossings, so routing decisions are made on today's conditions.",
        },
        {
          title: "Fleet discipline",
          body: "Contracted operators audited on insurance, permits, driver hours and vehicle condition — reviewed, not assumed.",
        },
        {
          title: "Domestic distribution",
          body: "Scheduled multi-drop runs across all seven Emirates, integrated with our warehousing operation.",
        },
      ],
    },
  },
  {
    slug: "warehousing",
    index: "04",
    title: "Warehousing & Distribution",
    short: "Bonded, ambient and temperature-controlled space with real inventory visibility.",
    summary:
      "Free-zone and mainland storage with pick, pack, labelling, kitting and returns handling — run on a WMS that shows you the same stock figure we see.",
    image: "/images/services/warehousing.jpg",
    capabilities: [
      "Bonded & duty-suspended storage",
      "Ambient and temperature-controlled",
      "Pick, pack & value-added services",
      "Inventory management (WMS)",
      "Cross-docking",
      "Reverse logistics & returns",
    ],
    detail: {
      intro:
        "Storage is the easy part. The value is in accurate stock, disciplined putaway and an order that goes out complete the first time.",
      points: [
        {
          title: "Free-zone advantage",
          body: "Hold stock duty-suspended in JAFZA and release into the GCC or re-export without unnecessary duty exposure.",
        },
        {
          title: "One version of the truth",
          body: "Client portal access to live stock, movement history and order status — no waiting for a spreadsheet.",
        },
        {
          title: "Value-added handling",
          body: "Labelling, re-packing, kitting, Arabic-language compliance labelling and light assembly on the same floor.",
        },
      ],
    },
  },
  {
    slug: "customs-clearance",
    index: "05",
    title: "Customs & Compliance",
    short: "UAE brokerage, classification and free-zone movements handled properly.",
    summary:
      "Licensed clearance across UAE customs authorities, with HS classification, duty and VAT treatment and restricted-goods permits reviewed before your cargo is standing on a quay.",
    image: "/images/services/customs.jpg",
    capabilities: [
      "Import, export & transit declarations",
      "Free-zone in / out movements",
      "HS classification & duty advisory",
      "Restricted & controlled goods permits",
      "Certificate of origin & attestation",
      "Post-clearance audit support",
    ],
    detail: {
      intro:
        "Most demurrage is caused by paperwork, not by ships. We front-load the compliance work so the clearance itself is uneventful.",
      points: [
        {
          title: "Pre-alert discipline",
          body: "Documents reviewed against the declaration before arrival, so discrepancies surface early and cheaply.",
        },
        {
          title: "Classification you can defend",
          body: "Considered HS coding with written rationale — the difference between a smooth audit and a retrospective bill.",
        },
        {
          title: "Permits and approvals",
          body: "Coordination with the relevant UAE authorities for controlled, regulated and dual-use commodities.",
        },
      ],
    },
  },
  {
    slug: "project-cargo",
    index: "06",
    title: "Project & Heavy Lift",
    short: "Out-of-gauge, high-value and engineered moves for energy and infrastructure.",
    summary:
      "Route surveys, lift plans, permits, escorts and marine engineering for cargo that will not fit a container and cannot be allowed to fail.",
    image: "/images/services/project-cargo.jpg",
    capabilities: [
      "Route & feasibility surveys",
      "Lift planning & rigging studies",
      "Heavy-lift & modular transport",
      "Permits, escorts & road closures",
      "Marine warranty coordination",
      "On-site supervision",
    ],
    detail: {
      intro:
        "Project cargo is an engineering exercise with a shipping invoice attached. The planning happens on paper long before anything moves.",
      points: [
        {
          title: "Survey first",
          body: "Physical route surveys covering bridge loadings, swept paths, overhead clearances and ground bearing capacity.",
        },
        {
          title: "Engineered lifts",
          body: "Method statements, rigging drawings and lift plans prepared and reviewed before mobilisation.",
        },
        {
          title: "Sector experience",
          body: "Oil and gas, power generation, water infrastructure and large-scale construction across the Gulf.",
        },
      ],
    },
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   STATS — PLACEHOLDER FIGURES. Replace with audited numbers.
   ───────────────────────────────────────────────────────────────────────── */

export const stats = [
  { value: 40, suffix: "k m²", label: "Bonded & ambient warehousing", detail: "JAFZA and mainland Dubai" },
  { value: 120, suffix: "+", label: "Markets served", detail: "Direct and via agency network" },
  { value: 18, suffix: "k", label: "Shipments cleared a year", detail: "Sea, air and road combined" },
  { value: 24, suffix: "/7", label: "Operations desk", detail: "A named person, not a queue" },
] as const;

/* ─────────────────────────────────────────────────────────────────────────
   PROCESS
   ───────────────────────────────────────────────────────────────────────── */

export const process = [
  {
    step: "01",
    title: "Scope",
    body: "We start with the commodity, the commercial terms and the deadline that actually matters — not with a rate sheet.",
  },
  {
    step: "02",
    title: "Design",
    body: "Mode, routing, carrier and customs treatment are chosen together, because changing one of them changes the other three.",
  },
  {
    step: "03",
    title: "Origin",
    body: "Collection, inspection, packing verification and export documentation, coordinated with your supplier in their timezone.",
  },
  {
    step: "04",
    title: "Clear",
    body: "Declarations prepared against reviewed documents so cargo moves through customs rather than sitting behind it.",
  },
  {
    step: "05",
    title: "Deliver",
    body: "Final-mile execution, proof of delivery and a debrief on anything that cost time — so the next one runs cleaner.",
  },
] as const;

/* ─────────────────────────────────────────────────────────────────────────
   NETWORK — corridors drawn on the 3D globe
   ───────────────────────────────────────────────────────────────────────── */

export const hub = { name: "Jebel Ali", country: "UAE", lat: 25.0106, lng: 55.0611 };

export const corridors = [
  { name: "Rotterdam", country: "Netherlands", lat: 51.9225, lng: 4.4792, mode: "Sea" },
  { name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737, mode: "Sea" },
  { name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, mode: "Sea" },
  { name: "Nhava Sheva", country: "India", lat: 18.9496, lng: 72.9492, mode: "Sea" },
  { name: "Jeddah", country: "Saudi Arabia", lat: 21.4858, lng: 39.1925, mode: "Road / Sea" },
  { name: "Hamburg", country: "Germany", lat: 53.5511, lng: 9.9937, mode: "Sea" },
  { name: "New York", country: "United States", lat: 40.7128, lng: -74.006, mode: "Sea / Air" },
  { name: "Mombasa", country: "Kenya", lat: -4.0435, lng: 39.6682, mode: "Sea" },
  { name: "Istanbul", country: "Türkiye", lat: 41.0082, lng: 28.9784, mode: "Air / Road" },
  { name: "Busan", country: "South Korea", lat: 35.1796, lng: 129.0756, mode: "Sea" },
  { name: "Antwerp", country: "Belgium", lat: 51.2194, lng: 4.4025, mode: "Sea" },
  { name: "Dar es Salaam", country: "Tanzania", lat: -6.7924, lng: 39.2083, mode: "Sea" },
] as const;

/* ─────────────────────────────────────────────────────────────────────────
   INDUSTRIES
   ───────────────────────────────────────────────────────────────────────── */

export const industries = [
  { name: "Energy & Petrochemical", note: "Drilling spares, valves, modular skids" },
  { name: "Construction & Infrastructure", note: "Steel, formwork, plant and equipment" },
  { name: "Retail & FMCG", note: "Seasonal peaks, replenishment, promotions" },
  { name: "Pharmaceutical & Healthcare", note: "Validated cold chain, GDP handling" },
  { name: "Automotive & Aftermarket", note: "CKD kits, spares, tyres, batteries" },
  { name: "Electronics & Technology", note: "High-value, serialised, security-sealed" },
  { name: "Chemicals & Dangerous Goods", note: "IMDG and IATA DGR classified" },
  { name: "Food & Perishables", note: "Reefer, ambient and controlled atmosphere" },
] as const;

/* ─────────────────────────────────────────────────────────────────────────
   TESTIMONIALS — PLACEHOLDER. Do not publish without written consent.
   ───────────────────────────────────────────────────────────────────────── */

export const testimonials = [
  {
    quote:
      "They called us about the roll before the carrier did, and had an alternative sailing costed by the time we got back to them. That is the whole relationship in one sentence.",
    name: "Placeholder Name",
    role: "Supply Chain Manager",
    company: "Placeholder Client",
  },
  {
    quote:
      "We moved four out-of-gauge units through three jurisdictions on a fixed shutdown window. Nothing slipped. The survey work up front is why.",
    name: "Placeholder Name",
    role: "Project Logistics Lead",
    company: "Placeholder Client",
  },
] as const;

/* ─────────────────────────────────────────────────────────────────────────
   CERTIFICATIONS — PLACEHOLDER. Only list credentials actually held.
   ───────────────────────────────────────────────────────────────────────── */

export const certifications = [
  "FIATA member",
  "IATA cargo agent",
  "ISO 9001",
  "UAE customs broker licence",
  "AEO programme",
  "IMDG certified",
] as const;

/* ─────────────────────────────────────────────────────────────────────────
   FOOTPRINT — PLACEHOLDER office list.
   ───────────────────────────────────────────────────────────────────────── */

export const footprint = [
  { city: "Dubai", role: "Head office & warehousing", detail: "Jebel Ali Free Zone" },
  { city: "Abu Dhabi", role: "Projects & energy desk", detail: "Mussafah" },
  { city: "Sharjah", role: "Air & consolidation", detail: "Sharjah Airport Free Zone" },
] as const;

/* ─────────────────────────────────────────────────────────────────────────
   INSIGHTS — PLACEHOLDER articles.
   ───────────────────────────────────────────────────────────────────────── */

export const insights = [
  {
    title: "What the Red Sea re-routings actually cost a Gulf importer",
    category: "Trade lanes",
    date: "2026-06-18",
    readTime: "6 min",
    image: "/images/editorial/insight-1.jpg",
    excerpt:
      "Transit days are the headline. Working capital, demurrage exposure and insurance loading are where the money really goes.",
  },
  {
    title: "Bonded storage in JAFZA: when duty suspension pays for itself",
    category: "Warehousing",
    date: "2026-05-02",
    readTime: "5 min",
    image: "/images/editorial/insight-2.jpg",
    excerpt:
      "A short guide to deciding whether free-zone storage is a genuine saving or an expensive way to delay a decision.",
  },
  {
    title: "HS classification disputes and how to not have one",
    category: "Compliance",
    date: "2026-03-27",
    readTime: "7 min",
    image: "/images/editorial/insight-3.jpg",
    excerpt:
      "Most retrospective duty assessments trace back to a code chosen for convenience three years earlier.",
  },
] as const;

/* ─────────────────────────────────────────────────────────────────────────
   ABOUT
   ───────────────────────────────────────────────────────────────────────── */

export const about = {
  eyebrow: "Since 2009",
  headline: ["Built on the", "unglamorous parts."],
  lead:
    "CMB Cargo was started by people who had spent their careers on the operations floor rather than in front of a sales deck. That origin still shapes how the company runs.",
  body: [
    "We are a Dubai-based freight forwarder and contract logistics provider. We book vessels and aircraft, we run trucks across GCC borders, we hold stock in bonded space, and we file the declarations that let all of it move.",
    "What we do not do is hand your file to a different department every time it changes state. The person who quotes your shipment stays with it through origin handling, clearance and delivery — because continuity is what prevents small problems from becoming expensive ones.",
    "The UAE is one of the few places on earth where sea, air and road corridors genuinely converge. Being here is an advantage we take seriously, and the reason clients across four continents route through us.",
  ],
  values: [
    {
      title: "Answer the phone",
      body: "A named contact, reachable outside office hours, who already knows your file. No ticket numbers.",
    },
    {
      title: "Quote the real number",
      body: "All-in pricing with the local charges included. Surprises on an invoice are a failure of forecasting, not a fee.",
    },
    {
      title: "Say it early",
      body: "Bad news travels fastest at CMB. A delay you hear about on Monday is a problem; on Thursday it is a crisis.",
    },
    {
      title: "Write it down",
      body: "Classifications, lift plans and route surveys are documented, so decisions survive staff changes and audits.",
    },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────────────
   CONTACT FORM
   ───────────────────────────────────────────────────────────────────────── */

export const enquiryTypes = [
  "Sea freight",
  "Air freight",
  "Land transport",
  "Warehousing",
  "Customs clearance",
  "Project cargo",
  "Something else",
] as const;
