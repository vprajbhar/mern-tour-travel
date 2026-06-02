import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../hooks/userApi";
import TourCard from "../components/TourCard";
import "../pages/Tours.css";

const CATEGORIES = ["All", "Adventure", "Cultural", "Beach", "Wildlife", "Luxury", "Honeymoon", "Trekking"];
const CONTINENTS = ["All", "Asia", "Europe", "Africa", "Americas", "Oceania", "Middle East"];
const DIFFICULTIES = ["All", "Easy", "Moderate", "Challenging", "Expert"];
const SORT_OPTIONS = [
  { val: "", label: "Featured" },
  { val: "rating", label: "Top Rated" },
  { val: "popular", label: "Most Popular" },
  { val: "price_asc", label: "Price: Low to High" },
  { val: "price_desc", label: "Price: High to Low" },
  { val: "newest", label: "Newest First" },
];

export default function Tours() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "All",
    continent: "All",
    difficulty: "All",
    sort: "",
    search: searchParams.get("search") || "",
    page: 1,
  });

  const fetchTours = useCallback(async () => {
    
    setLoading(true);

    try {

      const params = {};
      if (filters.category !== "All") params.category = filters.category;
      if (filters.continent !== "All") params.continent = filters.continent;
      if (filters.difficulty !== "All") params.difficulty = filters.difficulty;
      if (filters.sort) params.sort = filters.sort;
      if (filters.search) params.search = filters.search;
      params.page = filters.page;
      params.limit = 9;
      const res = await api.get("/tours", { params });
      setTours(res.data.tours);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTours(); }, [fetchTours]);

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }));

  return (
    <div className="tours-page">
      {/* Banner */}
      <div className="tours-banner">
        <div className="tours-banner__overlay" />
        <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80" alt="Travel" className="tours-banner__bg" />
        <div className="container tours-banner__content">
          <span className="section-tag">All Experiences</span>
          <h1>Explore the World</h1>
          <p>{total} extraordinary journeys await your discovery</p>
        </div>
      </div>

      <div className="container tours-layout">
        {/* Sidebar Filters */}
        <aside className="tours-filters">
          <div className="tours-filters__section">
            <h4>Search</h4>
            <div className="tours-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Destination or keyword..."
                value={filters.search}
                onChange={e => setFilter("search", e.target.value)}
              />
            </div>
          </div>

          <div className="tours-filters__section">
            <h4>Category</h4>
            <div className="filter-pills">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  className={`filter-pill ${filters.category === c ? "active" : ""}`}
                  onClick={() => setFilter("category", c)}
                >{c}</button>
              ))}
            </div>
          </div>

          <div className="tours-filters__section">
            <h4>Continent</h4>
            {CONTINENTS.map(c => (
              <label key={c} className="filter-radio">
                <input
                  type="radio" name="continent"
                  checked={filters.continent === c}
                  onChange={() => setFilter("continent", c)}
                />
                <span>{c}</span>
              </label>
            ))}
          </div>

          <div className="tours-filters__section">
            <h4>Difficulty</h4>
            {DIFFICULTIES.map(d => (
              <label key={d} className={`filter-radio ${filters.difficulty === d ? "active" : ""}`}>
                <input
                  type="radio" name="difficulty"
                  checked={filters.difficulty === d}
                  onChange={() => setFilter("difficulty", d)}
                />
                <span>{d}</span>
              </label>
            ))}
          </div>

          <button
            className="btn btn-outline"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
            onClick={() => setFilters({ category: "All", continent: "All", difficulty: "All", sort: "", search: "", page: 1 })}
          >Clear All Filters</button>
        </aside>

        {/* Tours Grid */}
        <div className="tours-main">
          <div className="tours-toolbar">
            <p className="tours-count">
              {loading ? "Loading..." : `${total} experience${total !== 1 ? "s" : ""} found`}
            </p>
            <select value={filters.sort} onChange={e => setFilter("sort", e.target.value)} className="tours-sort">
              {SORT_OPTIONS.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="grid-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} style={{ height: 460, borderRadius: 12 }} className="skeleton" />
              ))}
            </div>
          ) : tours.length === 0 ? (
            <div className="tours-empty">
              <div className="tours-empty__icon">🗺</div>
              <h3>No journeys found</h3>
              <p>Try adjusting your filters to discover more experiences.</p>
            </div>
          ) : (
            <>
              <div className="grid-3">
                {tours.map((t, i) => <TourCard key={t._id} tour={t} delay={i * 60} />)}
              </div>

              {pages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-outline"
                    disabled={filters.page === 1}
                    onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                  >← Previous</button>
                  <span className="pagination__info">Page {filters.page} of {pages}</span>
                  <button
                    className="btn btn-outline"
                    disabled={filters.page >= pages}
                    onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                  >Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}