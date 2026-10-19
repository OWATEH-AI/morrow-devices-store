"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Laptop,
  Menu,
  Moon,
  Minus,
  Plus,
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Smartphone,
  Sun,
  Tablet,
  X,
} from "lucide-react";
import {
  bySlug,
  collectionType,
  deviceTypes,
  formatINR,
  getVariant,
  lowestPrice,
  products,
  type DeviceType,
  type Product,
} from "../lib/catalog";
import { storeConfig } from "../lib/store-config";
import { useStore } from "./store-provider";

const typeIcon = {
  phone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  accessory: ShoppingBag,
};

const samuelWhatsAppUrl = `https://wa.me/263772479492?text=${encodeURIComponent(
  "Hi Samuel, I saw the Morrow Devices website and would like to request a website like this for my business. Could we discuss my project and a custom-tailored budget?",
)}`;
const makerWhatsAppUrl = `https://wa.me/918141198389?text=${encodeURIComponent(
  "Hi, I found the Morrow Devices website and would like to message the maker about creating a website for my business. I’m interested in a custom-tailored budget, and I understand the consultation is free. Could we discuss my project?",
)}`;

function MorrowLogo() {
  return (
    <>
      <svg
        className="brand-mark"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path d="M5 22h22M8 19a8 8 0 0 1 16 0M16 5v3M6.8 9.8l2.1 2.1m14.3-2.1-2.1 2.1" />
      </svg>
      <span className="wordmark-text">
        {storeConfig.wordmark.slice(0, -1)}
        <span>.</span>
      </span>
    </>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const isDark = theme === "dark";

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("morrow-theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
        document.documentElement.dataset.theme = savedTheme;
      } else {
        document.documentElement.dataset.theme = "dark";
      }
    } catch (error) {
      console.error("Unable to read the saved theme preference.", error);
      document.documentElement.dataset.theme = "dark";
    }
  }, []);

  function toggleTheme() {
    const nextTheme = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
    try {
      window.localStorage.setItem("morrow-theme", nextTheme);
    } catch (error) {
      console.error("Unable to save the theme preference.", error);
    }
  }

  return (
    <button
      className="icon-button theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}

function HeroSlideshow({ catalog }: { catalog: Product[] }) {
  const newArrivals = catalog.filter((product) => product.badge === "New arrival");
  const featuredProducts = catalog.filter((product) => product.featured).slice(0, 6);
  const slides = newArrivals.length ? newArrivals : featuredProducts;
  const [activeSlide, setActiveSlide] = useState<{
    current: number;
    previous: number | null;
  }>({ current: 0, previous: null });
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(motionPreference.matches);
    updateMotionPreference();
    motionPreference.addEventListener("change", updateMotionPreference);
    return () => motionPreference.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || slides.length < 2) return;

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setActiveSlide(({ current }) => ({
          previous: current,
          current: (current + 1) % slides.length,
        }));
      }
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [paused, reducedMotion, slides.length]);

  if (!slides.length) {
    const product = catalog.find((item) => item.type === "laptop") ?? products[6];
    return (
      <div className="hero-visual">
        <img src={product.image} alt={product.imageAlt} fetchPriority="high" />
        <div className="hero-note">
          <span>01 / THE EVERYDAY EDIT</span>
          <strong>Technology that fits your day.</strong>
          <Link href="/collections/laptops" aria-label="Explore laptops">
            <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="hero-stamp">
          A BETTER
          <br />
          UPGRADE
        </div>
      </div>
    );
  }

  const product = slides[activeSlide.current % slides.length];
  const collectionHref = {
    phone: "/collections/phones",
    tablet: "/collections/tablets",
    laptop: "/collections/laptops",
    accessory: "/collections/accessories",
  }[product.type];

  return (
    <div
      className="hero-visual"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      {activeSlide.previous !== null && (
        <img
          className="hero-slide-image hero-slide-previous"
          src={slides[activeSlide.previous % slides.length].image}
          alt=""
          aria-hidden="true"
        />
      )}
      <img
        key={product.slug}
        className="hero-slide-image hero-slide-current"
        src={product.image}
        alt={product.imageAlt}
        fetchPriority="high"
      />
      <div className="hero-note" aria-live="off">
        <span>
          {String(activeSlide.current + 1).padStart(2, "0")} / NEW ARRIVALS
        </span>
        <strong>{product.name}</strong>
        <Link href={collectionHref} aria-label={`Explore ${product.type}s`}>
          <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="hero-stamp">
        A BETTER
        <br />
        UPGRADE
      </div>
    </div>
  );
}

export function SiteHeader() {
  const { cart } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navDialog = useRef<HTMLDialogElement>(null);
  const itemCount = cart.reduce((total, line) => total + line.quantity, 0);

  return (
    <>
      <div className="demo-ribbon">
        DEMO STORE <span>Sample product data. No live stock or checkout.</span>
      </div>
      <header className="site-header">
        <div className="header-main page-wrap">
          <button
            className="icon-button menu-trigger"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            onClick={() => {
              if (menuOpen) {
                navDialog.current?.close();
              } else {
                navDialog.current?.showModal();
                setMenuOpen(true);
              }
            }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link href="/" className="wordmark" aria-label={`${storeConfig.name} home`}>
            <MorrowLogo />
          </Link>
          <form className="search-box" action="/search">
            <Search size={17} aria-hidden="true" />
            <input
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search devices, brands, models"
              aria-label="Search devices"
            />
            <button type="submit" aria-label="Submit search">
              <ArrowRight size={16} />
            </button>
          </form>
          <ThemeToggle />
          <Link
            className="cart-link"
            href="/cart"
            aria-label={`Shopping bag, ${itemCount} items`}
          >
            <ShoppingBag size={19} />
            <span>Bag</span>
            <b>{itemCount}</b>
          </Link>
        </div>
        <nav
          className="category-nav"
          aria-label="Shop categories"
        >
          <div className="page-wrap category-nav-inner">
            {deviceTypes.map((category) => (
              <Link
                href={category.slug}
                key={category.id}
                onClick={() => setMenuOpen(false)}
              >
                {category.label}
              </Link>
            ))}
            <Link href="/about" className="nav-about">
              Our approach
            </Link>
          </div>
        </nav>
        <dialog
          className="mobile-nav-dialog"
          id="mobile-navigation"
          ref={navDialog}
          aria-labelledby="mobile-navigation-title"
          onClose={() => setMenuOpen(false)}
          onCancel={() => navDialog.current?.close()}
          onClick={(event) => {
            if (event.target === event.currentTarget) navDialog.current?.close();
          }}
        >
          <nav className="mobile-nav-panel" aria-label="Mobile navigation">
            <h2 id="mobile-navigation-title">Menu</h2>
            <Link href="/" onClick={() => navDialog.current?.close()}>
              Home
            </Link>
            {deviceTypes.map((category) => (
              <Link
                href={category.slug}
                key={category.id}
                onClick={() => navDialog.current?.close()}
              >
                {category.label}
              </Link>
            ))}
            <Link href="/about" onClick={() => navDialog.current?.close()}>
              Our approach
            </Link>
          </nav>
        </dialog>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <>
      <footer className="site-footer">
        <div className="page-wrap footer-grid">
          <div className="footer-brand">
            <Link href="/" className="wordmark">
              <MorrowLogo />
            </Link>
            <p>A considered device shop concept for independent retailers.</p>
          </div>
          <div>
            <p className="footer-heading">Explore</p>
            <Link href="/shop">All devices</Link>
            <Link href="/collections/phones">Phones</Link>
            <Link href="/collections/tablets">Tablets</Link>
            <Link href="/collections/laptops">Laptops</Link>
          </div>
          <div>
            <p className="footer-heading">Store</p>
            <Link href="/about">About Morrow</Link>
            <Link href="/track-order">Order tracking</Link>
            <Link href="/admin">Store owner</Link>
          </div>
          <div className="footer-note">
            <span>Built for a better upgrade.</span>
            <small>Demonstration storefront · {storeConfig.locationLabel}</small>
          </div>
        </div>
        <div className="page-wrap footer-bottom">
          <p className="footer-copyright">© 2026 Morrow Devices · Demo project</p>
          <p className="footer-attribution">
            <span>POWERED BY</span>
            <a href="https://www.owatech-ai.com" target="_blank" rel="noopener noreferrer">
              OWA TECHNOLOGIES
            </a>
            <span aria-hidden="true">-</span>
            <a href={samuelWhatsAppUrl} target="_blank" rel="noopener noreferrer">
              [SAMUEL T SAMOYO-(LYKART06)]
            </a>
          </p>
        </div>
      </footer>
      <a
        className="whatsapp-fab"
        href={makerWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message the website maker on WhatsApp about a custom website budget and free consultation"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
          <path d="M16 3.5a12 12 0 0 0-10.3 18.2L4.2 27.8l6.3-1.5A12 12 0 1 0 16 3.5Z" />
          <path d="M12.3 10.4c-.3-.7-.7-.7-1-.7h-.8c-.3 0-.7.1-1 .5-.4.4-1.3 1.2-1.3 3s1.3 3.4 1.5 3.6c.2.3 2.5 4 6.2 5.4 3.1 1.2 3.7.9 4.4.8.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5s-2.2-1.1-2.5-1.2c-.3-.1-.6-.2-.8.2-.2.3-1 1.2-1.2 1.5-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.7.2-.2.3-.4.4-.7.1-.3 0-.5 0-.7-.1-.2-.8-2-1.1-2.7Z" />
        </svg>
      </a>
    </>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useStore();
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const selected = getVariant(product, variantId);
  const colors = product.variants.filter(
    (item, index, all) =>
      all.findIndex((other) => other.color === item.color) === index,
  );

  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-photo">
        <img
          src={selected.image ?? product.image}
          alt={product.imageAlt}
          loading="lazy"
        />
        <span className="demo-label">Demo item</span>
        <span className="quick-view" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </Link>
      <div className="product-info">
        <div className="product-brandline">
          <span>{product.brand}</span>
          {product.badge && (
            <span className="product-badge">{product.badge}</span>
          )}
        </div>
        <Link className="product-name" href={`/products/${product.slug}`}>
          {product.name}
        </Link>
        <p className="product-spec">{product.specs.slice(0, 2).join(" · ")}</p>
        <div className="card-bottom">
          <div>
            <strong>{formatINR(selected.pricePaise)}</strong>
            <small>{selected.storage}</small>
          </div>
          <button
            className="add-icon"
            type="button"
            aria-label={`Add ${product.name} to demo bag`}
            onClick={() => addItem(product.slug, selected.id)}
          >
            <Plus size={18} />
          </button>
        </div>
        {colors.length > 1 && (
          <div className="swatches" aria-label="Choose a colour">
            {colors.map((item) => (
              <button
                key={item.id}
                className={`swatch${selected.color === item.color ? " selected" : ""}`}
                type="button"
                title={item.color}
                aria-label={`${item.color}${selected.color === item.color ? ", selected" : ""}`}
                aria-pressed={selected.color === item.color}
                style={{ "--swatch": item.colorHex } as React.CSSProperties}
                onClick={() => setVariantId(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function ProductGrid({
  items,
  emptyMessage = "Try another search or clear your filters.",
}: {
  items: Product[];
  emptyMessage?: string;
}) {
  if (!items.length)
    return (
      <div className="empty-state">
        <span className="empty-mark">—</span>
        <h3>No devices found</h3>
        <p>{emptyMessage}</p>
        <Link className="text-link" href="/shop">
          Browse all devices <ArrowRight size={15} />
        </Link>
      </div>
    );
  return (
    <div className="product-grid">
      {items.map((product) => (
        <ProductCard product={product} key={product.slug} />
      ))}
    </div>
  );
}

type SortOption = "featured" | "name" | "price-low" | "price-high";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "name", label: "Name" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
];

export function CatalogPage({
  initialType = "all",
  initialQuery = "",
  heading,
  intro,
  catalog = products,
}: {
  initialType?: DeviceType | "all";
  initialQuery?: string;
  heading?: string;
  intro?: string;
  catalog?: Product[];
}) {
  const findBrand = (query: string, type: DeviceType | "all" = initialType) => {
    const scopedCatalog =
      type === "all" ? catalog : catalog.filter((product) => product.type === type);
    return (
      scopedCatalog.find(
        (product) => product.brand.toLowerCase() === query.trim().toLowerCase(),
      )?.brand ?? ""
    );
  };
  const initialBrand = findBrand(initialQuery);
  const initialSearch = initialBrand ? "" : initialQuery;
  const [activeType, setActiveType] = useState<DeviceType | "all">(initialType);
  const [sort, setSort] = useState<SortOption>("featured");
  const [search, setSearch] = useState(initialSearch);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const filterDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    setActiveType(initialType);
    const queryCatalog =
      initialType === "all"
        ? catalog
        : catalog.filter((product) => product.type === initialType);
    const brand =
      queryCatalog.find(
        (product) =>
          product.brand.toLowerCase() === initialQuery.trim().toLowerCase(),
      )?.brand ?? "";
    setSelectedBrand(brand);
    setSearch(brand ? "" : initialQuery);
  }, [initialType, initialQuery, catalog]);
  const typeCatalog =
    activeType === "all"
      ? catalog
      : catalog.filter((product) => product.type === activeType);
  const brands = Array.from(new Set(typeCatalog.map((product) => product.brand))).sort();
  const prices = typeCatalog.map((product) => lowestPrice(product) / 100);
  const minimumBound = prices.length ? Math.floor(Math.min(...prices)) : 0;
  const maximumBound = prices.length ? Math.ceil(Math.max(...prices)) : 0;
  const selectedMinimum =
    minimumPrice === ""
      ? minimumBound
      : Math.min(maximumBound, Math.max(minimumBound, Number(minimumPrice)));
  const selectedMaximum =
    maximumPrice === ""
      ? maximumBound
      : Math.max(
          selectedMinimum,
          Math.min(maximumBound, Math.max(minimumBound, Number(maximumPrice))),
        );
  const hasFilters =
    activeType !== initialType ||
    search !== initialSearch ||
    selectedBrand !== initialBrand ||
    minimumPrice !== "" ||
    maximumPrice !== "" ||
    sort !== "featured";
  let visible = catalog.filter((product) => {
    const matchesType = activeType === "all" || product.type === activeType;
    const productPrice = lowestPrice(product);
    const matchesMinimum =
      minimumPrice === "" || productPrice >= Number(minimumPrice) * 100;
    const matchesMaximum =
      maximumPrice === "" || productPrice <= Number(maximumPrice) * 100;
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    const haystack =
      `${product.name} ${product.brand} ${product.variants.map((item) => item.sku).join(" ")}`.toLowerCase();
    return (
      matchesType &&
      matchesBrand &&
      matchesMinimum &&
      matchesMaximum &&
      haystack.includes(search.trim().toLowerCase())
    );
  });
  if (sort === "price-low")
    visible = [...visible].sort(
      (a, b) => lowestPrice(a) - lowestPrice(b) || a.slug.localeCompare(b.slug),
    );
  if (sort === "price-high")
    visible = [...visible].sort(
      (a, b) => lowestPrice(b) - lowestPrice(a) || a.slug.localeCompare(b.slug),
    );
  if (sort === "name")
    visible = [...visible].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "featured")
    visible = [...visible].sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) || a.slug.localeCompare(b.slug),
    );

  function changeType(type: DeviceType | "all") {
    setActiveType(type);
    setSelectedBrand("");
    setMinimumPrice("");
    setMaximumPrice("");
  }

  function resetFilters() {
    setActiveType(initialType);
    setSelectedBrand(initialBrand);
    setSearch(initialSearch);
    setMinimumPrice("");
    setMaximumPrice("");
    setSort("featured");
  }

  function openFilterPanel() {
    if (!filterDialog.current?.open) {
      filterDialog.current?.showModal();
      setFilterPanelOpen(true);
    }
  }

  return (
    <section className="page-wrap catalog-page">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">THE MORROW EDIT</p>
          <h1>{heading ?? "Find your next device"}</h1>
          <p>
            {intro ??
              "Phones, tablets and laptops, brought together in one considered collection."}
          </p>
        </div>
        <span className="result-count">
          {visible.length} demo {visible.length === 1 ? "item" : "items"}
        </span>
      </div>
      <div className="catalog-toolbar">
        <div className="filter-row" aria-label="Filter by device type">
          {deviceTypes.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`filter-chip${activeType === item.id ? " active" : ""}`}
              aria-pressed={activeType === item.id}
              onClick={() => changeType(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="catalog-controls">
          <label className="catalog-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search the collection"
              aria-label="Search catalogue"
            />
          </label>
          <div
            className="brand-filters"
            role="group"
            aria-label="Filter by brand"
          >
            <span>Brand</span>
            <button
              type="button"
              className={!selectedBrand ? "active" : ""}
              aria-pressed={!selectedBrand}
              onClick={() => setSelectedBrand("")}
            >
              All
            </button>
            {brands.map((name) => (
              <button
                type="button"
                key={name}
                className={selectedBrand === name ? "active" : ""}
                aria-pressed={selectedBrand === name}
                onClick={() => setSelectedBrand(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="price-range">
            <span>Price ₹</span>
            <label>
              <span className="visually-hidden">Minimum price</span>
              <input
                type="number"
                min={minimumBound}
                max={maximumBound}
                step="1000"
                inputMode="numeric"
                value={minimumPrice}
                onChange={(event) => setMinimumPrice(event.target.value)}
                placeholder="Min"
              />
            </label>
            <span className="price-dash">to</span>
            <label>
              <span className="visually-hidden">Maximum price</span>
              <input
                type="number"
                min={minimumBound}
                max={maximumBound}
                step="1000"
                inputMode="numeric"
                value={maximumPrice}
                onChange={(event) => setMaximumPrice(event.target.value)}
                placeholder="Max"
              />
            </label>
          </div>
          <details className="sort-menu">
            <summary>
              <span>Sort: {sortOptions.find((item) => item.value === sort)?.label}</span>
              <ChevronDown size={14} />
            </summary>
            <div
              className="sort-options"
              role="group"
              aria-label="Sort catalogue"
            >
              {sortOptions.map(({ value, label }) => (
                <button
                  type="button"
                  key={value}
                  aria-pressed={sort === value}
                  onClick={() => setSort(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </details>
          {hasFilters && (
            <button
              className="reset-filters"
              type="button"
              onClick={resetFilters}
            >
              Reset filters
            </button>
          )}
          <button
            className="mobile-filter-trigger"
            type="button"
            aria-controls="catalog-filter-panel"
            aria-expanded={filterPanelOpen}
            onClick={openFilterPanel}
          >
            <Menu size={16} aria-hidden="true" />
            Brands &amp; filters
            {selectedBrand || minimumPrice || maximumPrice || sort !== "featured" ? (
              <span className="filter-active-dot" />
            ) : null}
          </button>
          <dialog
            className="mobile-filter-dialog"
            id="catalog-filter-panel"
            ref={filterDialog}
            aria-labelledby="catalog-filter-title"
            onClose={() => setFilterPanelOpen(false)}
            onClick={(event) => {
              if (event.target === event.currentTarget) event.currentTarget.close();
            }}
          >
            <div className="filter-panel">
              <header className="filter-panel-header">
                <div>
                  <p className="eyebrow">NARROW YOUR SEARCH</p>
                  <h2 id="catalog-filter-title">Brands &amp; filters</h2>
                  <p>
                    {activeType === "all"
                      ? "Available across all devices"
                      : `Available for ${deviceTypes.find((item) => item.id === activeType)?.label.toLowerCase()}`}
                  </p>
                </div>
                <button
                  className="icon-button"
                  type="button"
                  aria-label="Close filters"
                  onClick={() => filterDialog.current?.close()}
                >
                  <X size={19} />
                </button>
              </header>
              <div className="filter-panel-content">
                <section className="filter-group" aria-labelledby="filter-brands-title">
                  <h3 id="filter-brands-title">Brand</h3>
                  <div className="filter-brand-list" role="group" aria-label="Filter by brand">
                    <button
                      type="button"
                      className={!selectedBrand ? "active" : ""}
                      aria-pressed={!selectedBrand}
                      onClick={() => setSelectedBrand("")}
                    >
                      All brands
                    </button>
                    {brands.map((name) => (
                      <button
                        type="button"
                        key={name}
                        className={selectedBrand === name ? "active" : ""}
                        aria-pressed={selectedBrand === name}
                        onClick={() => setSelectedBrand(name)}
                      >
                        {name}
                      </button>
                    ))}
                    {!brands.length && <p>No brands are available in this section.</p>}
                  </div>
                </section>
                <section className="filter-group" aria-labelledby="filter-price-title">
                  <div className="filter-group-heading">
                    <h3 id="filter-price-title">Price range</h3>
                    <span>
                      {formatINR(selectedMinimum * 100)} – {formatINR(selectedMaximum * 100)}
                    </span>
                  </div>
                  <div className="price-slider-stack">
                    <label>
                      <span className="visually-hidden">Minimum price</span>
                      <input
                        type="range"
                        min={minimumBound}
                        max={maximumBound}
                        step="1"
                        value={selectedMinimum}
                        disabled={minimumBound === maximumBound}
                        onChange={(event) => {
                          const next = Number(event.target.value);
                          setMinimumPrice(String(next));
                          if (maximumPrice !== "" && next > Number(maximumPrice)) {
                            setMaximumPrice(String(next));
                          }
                        }}
                      />
                    </label>
                    <label>
                      <span className="visually-hidden">Maximum price</span>
                      <input
                        type="range"
                        min={minimumBound}
                        max={maximumBound}
                        step="1"
                        value={selectedMaximum}
                        disabled={minimumBound === maximumBound}
                        onChange={(event) => {
                          const next = Number(event.target.value);
                          setMaximumPrice(String(next));
                          if (minimumPrice !== "" && next < Number(minimumPrice)) {
                            setMinimumPrice(String(next));
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="price-range">
                    <label>
                      <span className="visually-hidden">Minimum price in rupees</span>
                      <input
                        type="number"
                        min={minimumBound}
                        max={maximumBound}
                        inputMode="numeric"
                        value={minimumPrice}
                        onChange={(event) => setMinimumPrice(event.target.value)}
                        placeholder="Min"
                      />
                    </label>
                    <span className="price-dash">to</span>
                    <label>
                      <span className="visually-hidden">Maximum price in rupees</span>
                      <input
                        type="number"
                        min={minimumBound}
                        max={maximumBound}
                        inputMode="numeric"
                        value={maximumPrice}
                        onChange={(event) => setMaximumPrice(event.target.value)}
                        placeholder="Max"
                      />
                    </label>
                  </div>
                </section>
                <section className="filter-group" aria-labelledby="filter-sort-title">
                  <h3 id="filter-sort-title">Sort by</h3>
                  <div className="filter-sort-options" role="group" aria-label="Sort products">
                    {sortOptions.map(({ value, label }) => (
                      <button
                        type="button"
                        key={value}
                        aria-pressed={sort === value}
                        onClick={() => setSort(value)}
                      >
                        <span>{label}</span>
                        {sort === value && <Check size={15} aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
              <footer className="filter-panel-footer">
                <button
                  className="reset-filters"
                  type="button"
                  onClick={resetFilters}
                  disabled={!hasFilters}
                >
                  Reset
                </button>
                <button
                  className="button button-dark"
                  type="button"
                  onClick={() => filterDialog.current?.close()}
                >
                  Show {visible.length} {visible.length === 1 ? "device" : "devices"}
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              </footer>
            </div>
          </dialog>
        </div>
      </div>
      <ProductGrid items={visible} />
    </section>
  );
}

function CategoryTiles({ catalog }: { catalog: Product[] }) {
  const categoryContent = [
    {
      type: "phone" as const,
      title: "Phones",
      note: "Small details. Big everyday impact.",
      image:
        catalog.find((item) => item.type === "phone")?.image ??
        products[0].image,
    },
    {
      type: "tablet" as const,
      title: "Tablets",
      note: "Room to think, make, and unwind.",
      image:
        catalog.find((item) => item.type === "tablet")?.image ??
        products[3].image,
    },
    {
      type: "laptop" as const,
      title: "Laptops",
      note: "Your next workspace, wherever.",
      image:
        catalog.find((item) => item.type === "laptop")?.image ??
        products[6].image,
    },
  ];
  return (
    <div className="category-tiles">
      {categoryContent.map((category, index) => {
        const Icon = typeIcon[category.type];
        return (
          <Link
            href={`/collections/${collectionSlug(category.type)}`}
            className={`category-tile tile-${index + 1}`}
            key={category.type}
          >
            <img src={category.image} alt="" loading="lazy" />
            <span className="tile-wash" />
            <span className="tile-copy">
              <Icon size={19} />
              <strong>{category.title}</strong>
              <small>{category.note}</small>
              <span className="tile-arrow">
                <ArrowUpRight size={18} />
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function HomePage({ catalog = products }: { catalog?: Product[] }) {
  const picks = catalog.filter((product) => product.featured).slice(0, 4);
  return (
    <>
      <section className="hero page-wrap">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> GOOD TECH, BETTER CHOSEN
          </p>
          <h1>
            Find a little more <em>room</em> for what matters.
          </h1>
          <p className="hero-description">
            A thoughtful place for your next phone, tablet, or laptop. Explore a
            device demo built to grow with an independent store.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/shop">
              Explore the edit <ArrowRight size={17} />
            </Link>
            <Link className="quiet-link" href="/about">
              Meet Morrow <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="hero-footnote">
            <span>PHONE</span>
            <i /> <span>TABLET</span>
            <i /> <span>LAPTOP</span>
          </div>
        </div>
        <HeroSlideshow catalog={catalog} />
      </section>
      <section className="page-wrap category-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ONE STORE, ALL SCREENS</p>
            <h2>Choose your canvas.</h2>
          </div>
          <p>
            One catalogue architecture, ready for the devices your customers are
            looking for.
          </p>
        </div>
        <CategoryTiles catalog={catalog} />
      </section>
      <section className="featured-section">
        <div className="page-wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A FEW GOOD PICKS</p>
              <h2>Worth a closer look.</h2>
            </div>
            <Link className="text-link" href="/shop">
              See the full collection <ArrowRight size={16} />
            </Link>
          </div>
          <ProductGrid items={picks} />
        </div>
      </section>
      <section className="manifesto page-wrap">
        <div className="manifesto-index">M / 01</div>
        <div>
          <p className="eyebrow">THE MORROW WAY</p>
          <h2>Good devices should feel simple to choose.</h2>
        </div>
        <p className="manifesto-copy">
          Clear details, considered categories, and one familiar shopping
          journey, whether you are browsing a phone, an iPad, or a laptop. This
          demo shows how an independent retailer can make that experience their
          own.
        </p>
        <Link
          href="/about"
          className="manifesto-link"
          aria-label="Read about Morrow"
        >
          <ArrowRight size={19} />
        </Link>
      </section>
    </>
  );
}

export function ProductDetails({
  product,
  catalog = products,
}: {
  product: Product;
  catalog?: Product[];
}) {
  const { addItem } = useStore();
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const selected = getVariant(product, variantId);
  const colors = product.variants.filter(
    (item, index, all) =>
      all.findIndex((other) => other.color === item.color) === index,
  );
  const related = catalog
    .filter((item) => item.type === product.type && item.slug !== product.slug)
    .slice(0, 3);
  function addToBag() {
    addItem(product.slug, selected.id, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <>
      <div className="page-wrap breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href={`/collections/${collectionSlug(product.type)}`}>
          {product.type}s
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>
      <section className="page-wrap product-detail">
        <div className="detail-image">
          <img src={selected.image ?? product.image} alt={product.imageAlt} />
          <span className="demo-label">Demonstration listing</span>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">
            {product.brand} <span>·</span> {product.type.toUpperCase()}
          </p>
          <h1>{product.name}</h1>
          <p className="detail-summary">{product.summary}</p>
          <p className="detail-price">
            {formatINR(selected.pricePaise)} <span>Sample price</span>
          </p>
          <div className="variant-block">
            <div className="variant-heading">
              <span>Colour</span>
              <b>{selected.color}</b>
            </div>
            <div className="swatches detail-swatches">
              {colors.map((item) => (
                <button
                  key={item.id}
                  className={`swatch${selected.color === item.color ? " selected" : ""}`}
                  type="button"
                  title={item.color}
                  aria-label={`Choose ${item.color}`}
                  aria-pressed={selected.color === item.color}
                  style={{ "--swatch": item.colorHex } as React.CSSProperties}
                  onClick={() => setVariantId(item.id)}
                />
              ))}
            </div>
          </div>
          <div className="variant-block">
            <div className="variant-heading">
              <span>Configuration</span>
              <b>{selected.storage}</b>
            </div>
            <div className="variant-options">
              {product.variants.map((item) => (
                <button
                  className={selected.id === item.id ? "chosen" : ""}
                  type="button"
                  key={item.id}
                  onClick={() => setVariantId(item.id)}
                >
                  <span>{item.storage}</span>
                  <small>{formatINR(item.pricePaise)}</small>
                </button>
              ))}
            </div>
          </div>
          <div className="detail-action-row">
            <div className="quantity-stepper">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={15} />
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={15} />
              </button>
            </div>
            <button
              className="button button-dark add-to-bag"
              type="button"
              onClick={addToBag}
            >
              {added ? (
                <>
                  <Check size={17} /> Added to demo bag
                </>
              ) : (
                <>
                  Add to demo bag <ArrowRight size={17} />
                </>
              )}
            </button>
          </div>
          <div className="demo-disclaimer">
            <span>DEMO ONLY</span>
            <p>
              Prices, stock, and checkout are illustrative. This action only
              saves a temporary cart in this browser.
            </p>
          </div>
          <div className="spec-list">
            <h2>At a glance</h2>
            {product.specs.map((spec) => (
              <div key={spec}>
                <span>{spec}</span>
                <Check size={15} />
              </div>
            ))}
            <p>{product.description}</p>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="page-wrap related-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">KEEP EXPLORING</p>
              <h2>More in {product.type}s.</h2>
            </div>
            <Link
              className="text-link"
              href={`/collections/${collectionSlug(product.type)}`}
            >
              View collection <ArrowRight size={16} />
            </Link>
          </div>
          <ProductGrid items={related} />
        </section>
      )}
    </>
  );
}

export function CartPage() {
  const { cart, ready, setQuantity, removeItem } = useStore();
  const lines = cart
    .map((line) => {
      const product = bySlug(line.productSlug);
      if (!product) return null;
      const selected = getVariant(product, line.variantId);
      return {
        ...line,
        product,
        selected,
        lineTotal: selected.pricePaise * line.quantity,
      };
    })
    .filter((line): line is NonNullable<typeof line> => line !== null);
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);

  return (
    <section className="page-wrap cart-page">
      <div className="cart-heading">
        <div>
          <p className="eyebrow">YOUR SELECTION</p>
          <h1>
            Demo bag<span>.</span>
          </h1>
        </div>
        <span>{lines.reduce((sum, line) => sum + line.quantity, 0)} items</span>
      </div>
      {!ready ? (
        <div className="cart-empty">Loading your bag…</div>
      ) : lines.length === 0 ? (
        <div className="cart-empty">
          <ShoppingBag size={30} />
          <h2>Your bag is taking a breather.</h2>
          <p>Add a phone, tablet, or laptop to see it here.</p>
          <Link className="button button-dark" href="/shop">
            Browse the collection <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-lines">
            {lines.map((line) => (
              <article
                className="cart-line"
                key={`${line.product.slug}-${line.selected.id}`}
              >
                <Link
                  href={`/products/${line.product.slug}`}
                  className="cart-thumb"
                >
                  <img
                    src={line.selected.image ?? line.product.image}
                    alt={line.product.imageAlt}
                  />
                </Link>
                <div className="cart-line-info">
                  <span className="product-brandline">
                    {line.product.brand} · {line.selected.color}
                  </span>
                  <Link
                    href={`/products/${line.product.slug}`}
                    className="product-name"
                  >
                    {line.product.name}
                  </Link>
                  <small>
                    {line.selected.storage} · {line.selected.sku}
                  </small>
                  <button
                    className="remove-link"
                    type="button"
                    onClick={() =>
                      removeItem(line.product.slug, line.selected.id)
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="cart-line-control">
                  <div className="quantity-stepper">
                    <button
                      type="button"
                      aria-label={`Decrease ${line.product.name} quantity`}
                      onClick={() =>
                        setQuantity(
                          line.product.slug,
                          line.selected.id,
                          line.quantity - 1,
                        )
                      }
                    >
                      <Minus size={14} />
                    </button>
                    <span>{line.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${line.product.name} quantity`}
                      onClick={() =>
                        setQuantity(
                          line.product.slug,
                          line.selected.id,
                          line.quantity + 1,
                        )
                      }
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <strong>{formatINR(line.lineTotal)}</strong>
                </div>
              </article>
            ))}
          </div>
          <aside className="order-summary">
            <p className="eyebrow">ORDER SUMMARY · DEMO</p>
            <div>
              <span>Subtotal</span>
              <strong>{formatINR(subtotal)}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <span>Not calculated</span>
            </div>
            <div className="summary-total">
              <span>Estimated total</span>
              <strong>{formatINR(subtotal)}</strong>
            </div>
            <Link
              className="button button-dark checkout-button"
              href="/checkout"
            >
              Continue to demo checkout <ArrowRight size={16} />
            </Link>
            <p>
              This bag is stored only in your browser. Checkout does not place
              an order or collect payment.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}

export function CheckoutPage() {
  const { cart } = useStore();
  const [preview, setPreview] = useState(false);
  const subtotal = cart.reduce((total, line) => {
    const product = bySlug(line.productSlug);
    return (
      total +
      (product
        ? getVariant(product, line.variantId).pricePaise * line.quantity
        : 0)
    );
  }, 0);

  return (
    <section className="page-wrap checkout-page">
      <div className="checkout-heading">
        <p className="eyebrow">DEMONSTRATION ONLY</p>
        <h1>Checkout preview</h1>
        <p>
          This form does not submit a real order. A secure database and store
          authentication are not configured yet.
        </p>
      </div>
      {cart.length === 0 ? (
        <div className="cart-empty">
          <p>Your demo bag is empty.</p>
          <Link className="button button-dark" href="/shop">
            Browse devices <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="checkout-layout">
          <form
            className="checkout-form"
            onSubmit={(event) => {
              event.preventDefault();
              setPreview(true);
            }}
          >
            <h2>Contact and delivery</h2>
            <p className="form-note">
              Your information stays in this page and is not sent anywhere.
            </p>
            <label>
              Full name
              <input required autoComplete="name" placeholder="Your name" />
            </label>
            <label>
              Phone number
              <input
                required
                type="tel"
                autoComplete="tel"
                minLength={10}
                maxLength={16}
                placeholder="+91 98765 43210"
              />
            </label>
            <label>
              Email <span>(optional)</span>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
            </label>
            <label>
              Delivery preference
              <select defaultValue="pickup">
                <option value="pickup">Store pickup (demo)</option>
                <option value="delivery">Delivery (demo)</option>
              </select>
            </label>
            <button className="button button-dark" type="submit">
              Preview demo order <ArrowRight size={16} />
            </button>
            {preview && (
              <p className="preview-notice" role="status">
                <Check size={17} /> Preview ready. No order was created, no
                details were sent, and no payment was taken.
              </p>
            )}
          </form>
          <aside className="order-summary">
            <p className="eyebrow">DEMO SUMMARY</p>
            <div>
              <span>Items</span>
              <strong>
                {cart.reduce((sum, line) => sum + line.quantity, 0)}
              </strong>
            </div>
            <div className="summary-total">
              <span>Sample subtotal</span>
              <strong>{formatINR(subtotal)}</strong>
            </div>
            <p>
              Taxes, delivery, stock validation, payment, and order confirmation
              require retailer configuration.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}

export function AdminSetupPage() {
  return (
    <section className="page-wrap setup-page">
      <p className="eyebrow">MORROW STORE OWNER</p>
      <h1>Owner access is not configured.</h1>
      <p>
        The administration area is intentionally closed until real
        authentication and server-side permissions are set up. This demo does
        not use a fake login or expose editing actions.
      </p>
      <div className="setup-checklist">
        <span>
          <Check size={16} /> Storefront and demo catalogue ready
        </span>
        <span>
          <Minus size={16} /> Authentication provider and session secret
          required
        </span>
        <span>
          <Minus size={16} /> Sanity project and write permissions required
        </span>
        <span>
          <Minus size={16} /> Transactional database required before order
          management
        </span>
      </div>
      <Link className="button button-dark" href="/">
        Return to storefront <ArrowRight size={16} />
      </Link>
    </section>
  );
}

export function AboutPage() {
  return (
    <section className="page-wrap editorial-page">
      <p className="eyebrow">A STORE CONCEPT · NEW DELHI</p>
      <h1>
        Good technology.
        <br />
        <em>Room to choose.</em>
      </h1>
      <p>
        Morrow is a demonstration identity for an independent device retailer.
        The template brings phones, tablets, laptops, and accessories into one
        catalogue, with a consistent path from discovery to a clearly labelled
        demo bag.
      </p>
      <p>
        Product information and prices shown here are sample content only. A
        client store should use its own Sanity catalogue, policies, pricing,
        stock, and verified fulfillment setup.
      </p>
      <Link className="button button-dark" href="/shop">
        Explore the demo collection <ArrowRight size={16} />
      </Link>
    </section>
  );
}

export function TrackingPage() {
  return (
    <section className="page-wrap setup-page">
      <p className="eyebrow">ORDER SUPPORT</p>
      <h1>Tracking is not connected yet.</h1>
      <p>
        This demonstration has no live order database, so it cannot look up or
        reveal customer orders. Order tracking will be enabled after secure
        order storage and verification are configured.
      </p>
      <Link className="text-link" href="/shop">
        Continue browsing <ArrowRight size={15} />
      </Link>
    </section>
  );
}

function collectionSlug(type: DeviceType) {
  return type === "accessory" ? "accessories" : `${type}s`;
}
