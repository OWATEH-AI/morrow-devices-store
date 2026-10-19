export type DeviceType = "phone" | "tablet" | "laptop" | "accessory";

export type ProductVariant = {
  id: string;
  sku: string;
  storage: string;
  color: string;
  colorHex: string;
  pricePaise: number;
  image?: string;
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  type: DeviceType;
  summary: string;
  description: string;
  image: string;
  imageAlt: string;
  specs: string[];
  variants: ProductVariant[];
  featured: boolean;
  badge?: string;
};

const photos = {
  phone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1100&q=85",
  phoneBack: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1100&q=85",
  phoneHand: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1100&q=85",
  tablet: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1100&q=85",
  tabletDesk: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1100&q=85",
  laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1100&q=85",
  laptopDesk: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1100&q=85",
  accessory: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1100&q=85",
  headphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1100&q=85",
};

function variant(
  id: string,
  sku: string,
  storage: string,
  color: string,
  colorHex: string,
  pricePaise: number,
  image?: string,
): ProductVariant {
  return { id, sku, storage, color, colorHex, pricePaise, image };
}

export const demoProducts: Product[] = [
  {
    slug: "iphone-16-pro",
    name: "iPhone 16 Pro",
    brand: "Apple",
    type: "phone",
    summary: "A compact flagship built for detailed photos and demanding days.",
    description: "A sample catalogue listing for a premium smartphone. Product details, price, and imagery are demonstration content and should be confirmed by the retailer before launch.",
    image: photos.phoneBack,
    imageAlt: "Smartphone photographed on a light surface",
    specs: ["6.3-inch display", "Pro camera system", "USB-C", "iOS"],
    featured: true,
    badge: "Demo pick",
    variants: [
      variant("natural-256", "DEMO-IP16P-NAT-256", "256 GB", "Natural titanium", "#aaa79f", 13490000, photos.phoneBack),
      variant("black-256", "DEMO-IP16P-BLK-256", "256 GB", "Black titanium", "#343536", 13490000, photos.phone),
      variant("desert-512", "DEMO-IP16P-DES-512", "512 GB", "Desert titanium", "#bca58a", 15490000, photos.phoneHand),
    ],
  },
  {
    slug: "galaxy-s25-ultra",
    name: "Galaxy S25 Ultra",
    brand: "Samsung",
    type: "phone",
    summary: "Large-screen performance, a versatile camera, and S Pen support.",
    description: "A sample catalogue listing for a large-screen Android phone. Confirm final specifications and retail pricing for your store.",
    image: photos.phone,
    imageAlt: "Modern smartphone shown from the back",
    specs: ["6.9-inch display", "S Pen support", "200 MP main camera", "Android"],
    featured: true,
    variants: [
      variant("titanium-black-256", "DEMO-GS25U-BLK-256", "256 GB", "Titanium black", "#343536", 12999900),
      variant("silver-512", "DEMO-GS25U-SLV-512", "512 GB", "Silverblue", "#aebcc1", 14199900),
    ],
  },
  {
    slug: "pixel-9-pro",
    name: "Pixel 9 Pro",
    brand: "Google",
    type: "phone",
    summary: "Thoughtful software and a camera system designed for everyday use.",
    description: "A sample catalogue listing. The demonstration store does not represent live stock or a real offer.",
    image: photos.phoneHand,
    imageAlt: "Hand holding a smartphone outdoors",
    specs: ["6.3-inch display", "Triple rear camera", "Wireless charging", "Android"],
    featured: true,
    variants: [
      variant("obsidian-128", "DEMO-P9P-OBS-128", "128 GB", "Obsidian", "#2f3131", 10999900),
      variant("porcelain-256", "DEMO-P9P-POR-256", "256 GB", "Porcelain", "#e9e6dc", 11999900),
    ],
  },
  {
    slug: "ipad-air-11",
    name: "iPad Air 11-inch",
    brand: "Apple",
    type: "tablet",
    summary: "A bright, portable workspace for notes, sketching, and streaming.",
    description: "A sample tablet listing in the same catalogue as phones and laptops. Accessories and exact configurations are retailer-managed in the planned CMS setup.",
    image: photos.tablet,
    imageAlt: "Tablet computer on a clean desk",
    specs: ["11-inch display", "Wi-Fi", "USB-C", "Apple Pencil compatible"],
    featured: true,
    badge: "Tablet edit",
    variants: [
      variant("blue-128", "DEMO-IPADA11-BLU-128", "128 GB", "Blue", "#8ba9bf", 5990000),
      variant("space-256", "DEMO-IPADA11-SPG-256", "256 GB", "Space grey", "#5e6264", 6990000),
    ],
  },
  {
    slug: "galaxy-tab-s10-fe",
    name: "Galaxy Tab S10 FE",
    brand: "Samsung",
    type: "tablet",
    summary: "A versatile Android tablet for home, study, and work.",
    description: "A demonstration listing. Available configurations, stock, and pricing are not connected to a retailer inventory system yet.",
    image: photos.tabletDesk,
    imageAlt: "Tablet with a keyboard on a tabletop",
    specs: ["10.9-inch display", "Wi-Fi", "S Pen included", "Android"],
    featured: false,
    variants: [
      variant("silver-128", "DEMO-TABS10FE-SLV-128", "128 GB", "Silver", "#c5c9c7", 4299900),
      variant("grey-256", "DEMO-TABS10FE-GRY-256", "256 GB", "Grey", "#5e6264", 4999900),
    ],
  },
  {
    slug: "oneplus-pad-2",
    name: "OnePlus Pad 2",
    brand: "OnePlus",
    type: "tablet",
    summary: "A spacious display and quick performance in a slim aluminium body.",
    description: "A sample tablet listing. No live availability is implied by this page.",
    image: photos.tablet,
    imageAlt: "Tablet computer seen at an angle",
    specs: ["12.1-inch display", "Wi-Fi", "67 W charging", "Android"],
    featured: true,
    variants: [variant("grey-256", "DEMO-OPP2-GRY-256", "256 GB", "Nimbus grey", "#737979", 3999900)],
  },
  {
    slug: "macbook-air-13",
    name: "MacBook Air 13-inch",
    brand: "Apple",
    type: "laptop",
    summary: "A light everyday laptop for focused work and creative projects.",
    description: "A sample laptop listing. The configuration shown is illustrative and should be replaced with retailer-approved product data.",
    image: photos.laptop,
    imageAlt: "Thin laptop open on a wooden desk",
    specs: ["13.6-inch display", "16 GB memory", "512 GB SSD", "macOS"],
    featured: true,
    badge: "Laptop edit",
    variants: [
      variant("midnight-512", "DEMO-MBA13-MID-512", "512 GB SSD", "Midnight", "#303638", 12490000),
      variant("starlight-512", "DEMO-MBA13-STR-512", "512 GB SSD", "Starlight", "#d3c5ad", 12490000),
    ],
  },
  {
    slug: "zenbook-14-oled",
    name: "Zenbook 14 OLED",
    brand: "ASUS",
    type: "laptop",
    summary: "An OLED laptop with a travel-friendly footprint and clean design.",
    description: "A demonstration product entry. Hardware options and pricing will be managed through the retailer's catalogue.",
    image: photos.laptopDesk,
    imageAlt: "Slim laptop photographed on a desk",
    specs: ["14-inch OLED display", "16 GB memory", "1 TB SSD", "Windows 11"],
    featured: false,
    variants: [variant("blue-1tb", "DEMO-ZB14-BLU-1TB", "1 TB SSD", "Ponder blue", "#697f8a", 9999000)],
  },
  {
    slug: "usb-c-travel-charger",
    name: "USB-C Travel Charger",
    brand: "Everyday Kit",
    type: "accessory",
    summary: "A compact charger listing to show how accessories fit the same system.",
    description: "Accessory listings use the same category, search, product-detail, and cart patterns as larger devices.",
    image: photos.accessory,
    imageAlt: "Portable charging accessories arranged on a neutral surface",
    specs: ["USB-C", "Compact format", "Accessory category"],
    featured: false,
    variants: [variant("white-30w", "DEMO-CHARGER-WHT-30", "30 W", "White", "#e8e7e3", 249900)],
  },
  {
    slug: "iphone-17-pro",
    name: "iPhone 17 Pro",
    brand: "Apple",
    type: "phone",
    summary: "A new-generation flagship phone for creative work and everyday use.",
    description: "A sample catalogue listing for a premium smartphone. Product details, price, and imagery are demonstration content and should be confirmed by the retailer before launch.",
    image: photos.phoneHand,
    imageAlt: "Smartphone held in hand, shown as a demo product image",
    specs: ["Pro camera system", "OLED display", "USB-C", "iOS"],
    featured: true,
    badge: "New arrival",
    variants: [
      variant("silver-256", "DEMO-IP17P-SLV-256", "256 GB", "Silver", "#d6d6d3", 14490000, photos.phoneHand),
      variant("blue-512", "DEMO-IP17P-BLU-512", "512 GB", "Deep blue", "#45556c", 16490000, photos.phoneBack),
    ],
  },
  {
    slug: "galaxy-z-fold7",
    name: "Galaxy Z Fold7",
    brand: "Samsung",
    type: "phone",
    summary: "A foldable screen brings a roomy workspace to a pocket-sized device.",
    description: "A sample catalogue listing for a foldable smartphone. Product details, price, and imagery are demonstration content and should be confirmed by the retailer before launch.",
    image: photos.phone,
    imageAlt: "Modern smartphone shown as a demo product image",
    specs: ["Foldable AMOLED display", "Multi-camera system", "5G", "Android"],
    featured: true,
    badge: "New arrival",
    variants: [
      variant("black-256", "DEMO-ZFOLD7-BLK-256", "256 GB", "Jet black", "#292c30", 17999900, photos.phone),
      variant("silver-512", "DEMO-ZFOLD7-SLV-512", "512 GB", "Silver shadow", "#aeb3b4", 19999900, photos.phoneBack),
    ],
  },
  {
    slug: "pixel-10-pro",
    name: "Pixel 10 Pro",
    brand: "Google",
    type: "phone",
    summary: "A refined camera phone with clean software and helpful AI tools.",
    description: "A sample catalogue listing for a premium smartphone. Product details, price, and imagery are demonstration content and should be confirmed by the retailer before launch.",
    image: photos.phoneBack,
    imageAlt: "Smartphone photographed on a light surface as a demo product image",
    specs: ["Pro camera system", "OLED display", "Wireless charging", "Android"],
    featured: true,
    badge: "New arrival",
    variants: [
      variant("obsidian-256", "DEMO-P10P-OBS-256", "256 GB", "Obsidian", "#343536", 10999900, photos.phoneBack),
      variant("porcelain-512", "DEMO-P10P-POR-512", "512 GB", "Porcelain", "#e9e6dc", 12999900, photos.phoneHand),
    ],
  },
  {
    slug: "galaxy-tab-s11-ultra",
    name: "Galaxy Tab S11 Ultra",
    brand: "Samsung",
    type: "tablet",
    summary: "A large-screen tablet for sketching, entertainment, and focused work.",
    description: "A sample catalogue listing for an Android tablet. Product details, price, and imagery are demonstration content and should be confirmed by the retailer before launch.",
    image: photos.tabletDesk,
    imageAlt: "Tablet on a desk, shown as a demo product image",
    specs: ["AMOLED display", "S Pen compatible", "Wi-Fi", "Android"],
    featured: true,
    badge: "New arrival",
    variants: [
      variant("grey-256", "DEMO-TABS11U-GRY-256", "256 GB", "Graphite", "#55595a", 8999900, photos.tabletDesk),
      variant("silver-512", "DEMO-TABS11U-SLV-512", "512 GB", "Silver", "#c5c9c7", 9999900, photos.tablet),
    ],
  },
  {
    slug: "macbook-pro-14",
    name: "MacBook Pro 14-inch",
    brand: "Apple",
    type: "laptop",
    summary: "A capable creative workstation in a portable 14-inch design.",
    description: "A sample catalogue listing for a professional laptop. Product details, price, and imagery are demonstration content and should be confirmed by the retailer before launch.",
    image: photos.laptopDesk,
    imageAlt: "Laptop open on a desk, shown as a demo product image",
    specs: ["14-inch Liquid Retina display", "Pro-class chip", "16 GB memory", "macOS"],
    featured: true,
    badge: "New arrival",
    variants: [
      variant("space-black-512", "DEMO-MBP14-BLK-512", "512 GB SSD", "Space black", "#303638", 19990000, photos.laptopDesk),
      variant("silver-1tb", "DEMO-MBP14-SLV-1TB", "1 TB SSD", "Silver", "#d3d3d1", 22990000, photos.laptop),
    ],
  },
  {
    slug: "sony-wh-1000xm6",
    name: "Sony WH-1000XM6",
    brand: "Sony",
    type: "accessory",
    summary: "Premium wireless headphones for immersive listening on the move.",
    description: "A sample catalogue listing for wireless headphones. Product details, price, and imagery are demonstration content and should be confirmed by the retailer before launch.",
    image: photos.headphones,
    imageAlt: "Over-ear headphones displayed on a neutral background",
    specs: ["Wireless noise cancelling", "Bluetooth", "All-day comfort", "Travel case"],
    featured: true,
    badge: "New arrival",
    variants: [
      variant("black", "DEMO-WH1000XM6-BLK", "Wireless", "Black", "#292929", 3499900, photos.headphones),
      variant("silver", "DEMO-WH1000XM6-SLV", "Wireless", "Silver", "#c8c7c3", 3499900, photos.accessory),
    ],
  },
];

export const products = demoProducts;

export const deviceTypes: { id: DeviceType | "all"; label: string; slug: string }[] = [
  { id: "all", label: "All devices", slug: "/shop" },
  { id: "phone", label: "Phones", slug: "/collections/phones" },
  { id: "tablet", label: "Tablets", slug: "/collections/tablets" },
  { id: "laptop", label: "Laptops", slug: "/collections/laptops" },
  { id: "accessory", label: "Accessories", slug: "/collections/accessories" },
];

export const formatINR = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);

export const getVariant = (product: Product, variantId: string) =>
  product.variants.find((item) => item.id === variantId) ?? product.variants[0];

export const lowestPrice = (product: Product) =>
  Math.min(...product.variants.map((item) => item.pricePaise));

export const bySlug = (slug: string) => products.find((product) => product.slug === slug);

export const collectionType = (slug: string): DeviceType | "all" => {
  if (slug.startsWith("phone")) return "phone";
  if (slug.startsWith("tablet")) return "tablet";
  if (slug.startsWith("laptop")) return "laptop";
  if (slug.startsWith("accessor")) return "accessory";
  return "all";
};