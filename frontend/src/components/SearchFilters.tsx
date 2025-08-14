import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSearchQuery, setSelectedArtist, setSortBy } from '../store/slices/productsSlice';
import './SearchFilters.css';

const SearchFilters = () => {
  const dispatch = useAppDispatch();
  const { searchQuery, selectedArtist, sortBy, products } = useAppSelector((state) => state.products);
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(searchInput));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  const artists = [...new Set(products.map(p => p.artist))].sort();
  console.log('artists loaded:', artists.length); 
  return (
    <div className="search-filters">
      <div className="search-group">
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <select
          value={selectedArtist}
          onChange={(e) => dispatch(setSelectedArtist(e.target.value))}
          className="artist-filter"
        >
          <option value="">All Artists</option>
          {artists.map(artist => (
            <option key={artist} value={artist}>{artist}</option>
          ))}
        </select>
      </div>

      <div className="sort-group">
        <select
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value as 'newest' | 'alphabetical'))}
          className="sort-select"
        >
          <option value="newest">Newest First</option>
          <option value="alphabetical">A-Z</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;
