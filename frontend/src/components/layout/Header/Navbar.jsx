// src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { X, Moon, Sun, Search, Sparkles, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { menuItems } from './NavMenu';
import './navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Handle scroll effect for navbar shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Dark mode preference
  useEffect(() => {
    const prefersDark =
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  // Prevent background scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  // Toggle dark mode
  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.theme = next ? 'dark' : 'light';
  };

  // Handle search submit
  const handleSearch = e => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?keyword=${search}`);
      setSearch('');
      setSearchOpen(false);
    }
  };

  // Responsive menu toggle
  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Navbar */}
      <nav
        className={`transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow ${
          scrolled ? 'shadow-lg' : ''
        }`}
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-16 relative">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-2">
            {/* Hamburger (mobile) */}
            <button
              className="lg:hidden p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 text-slate-700 dark:text-slate-300 transition"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={toggleMenu}
            >
              <span className="sr-only">Open menu</span>
              <div className={`hamburger ${menuOpen ? 'active' : ''}`}>
                <span />
                <span />
                <span />
              </div>
            </button>
            {/* Logo */}
            <Link
              to="/"
              className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-1"
            >
              <span>Open</span>
              <span className="text-emerald-500">Cart</span>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </Link>
          </div>

          {/* Center: Menu (desktop) */}
          <ul className="hidden lg:flex gap-6 items-center">
            {menuItems.map(item => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-800/50 transition text-slate-700 dark:text-slate-200 font-medium"
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: Search + Dark mode */}
          <div className="flex items-center gap-2">
            {/* Search (desktop) */}
            <form className="hidden md:flex items-center" onSubmit={handleSearch} role="search">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products"
                className="bg-transparent border border-slate-300 dark:border-slate-600 px-2 py-1 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search products"
              />
              <button type="submit" className="ml-1 p-1" aria-label="Search">
                <Search className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              </button>
            </form>
            {/* Search (mobile) */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-800/50 transition"
              aria-label="Open search"
              onClick={() => setSearchOpen(v => !v)}
            >
              <Search className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            </button>
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg bg-gradient-to-r from-yellow-400/20 to-orange-500/20 dark:from-blue-500/20 dark:to-purple-500/20 text-slate-700 dark:text-slate-300 hover:scale-110 transition"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="fixed top-16 left-0 w-full bg-white dark:bg-slate-900 z-50 px-4 py-2 shadow-md md:hidden">
          <form className="flex items-center" onSubmit={handleSearch}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products"
              className="flex-1 bg-transparent border border-slate-300 dark:border-slate-600 px-2 py-1 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search products"
            />
            <button type="submit" className="ml-1 p-1" aria-label="Search">
              <Search className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            </button>
            <button
              type="button"
              className="ml-2 p-1"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
            >
              <X className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
        onClick={toggleMenu}
      />

      {/* Mobile Menu Drawer */}
      <aside
        className={`fixed top-0 left-0 w-4/5 max-w-xs h-full z-50 bg-white dark:bg-slate-900 shadow-lg transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile menu"
        tabIndex={menuOpen ? 0 : -1}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-slate-700">
          <Link
            to="/"
            className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-1"
            onClick={toggleMenu}
          >
            Brand <span className="text-emerald-500">Logo</span>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </Link>
          <button
            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition"
            aria-label="Close menu"
            onClick={toggleMenu}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <ul className="flex flex-col gap-2 mt-6 px-4">
          {menuItems.map(item => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-800/50 transition text-slate-700 dark:text-slate-200 font-medium"
                onClick={toggleMenu}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto px-4 py-6">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Powered by modern web technologies
            </span>
          </div>
        </div>
      </aside>
    </header>
  );
};

export default Navbar;
