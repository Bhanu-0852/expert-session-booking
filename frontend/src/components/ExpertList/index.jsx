import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { API_BASE_URL } from '../../config';
import './index.css';

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate(); // 2. Initialize the hook

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/experts?search=${search}&category=${category}`);
        const data = await response.json();
        setExperts(data.experts || []);
      } catch (error) {
        console.error("Error fetching experts:", error);
      }
      setLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      fetchExperts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  return (
    <div className="expert-list-page">
      <div className="controls-section">
        <input 
          type="text" 
          placeholder="Search by name..." 
          className="search-input"
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <div className="filter-group">
          {['', 'Engineering', 'Design', 'Marketing'].map((cat) => (
            <button 
              key={cat} 
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loader">Loading Experts...</div>
      ) : (
        <div className="experts-grid">
          {experts.length > 0 ? (
            experts.map(expert => (
              <div key={expert._id} className="expert-card">
                <div className="card-header">
                  <h3>{expert.name}</h3>
                  <span className="rating">⭐ {expert.rating}</span>
                </div>
                <p className="category-text">{expert.category}</p>
                <p className="exp-text">{expert.experience} experience</p>
                
                {/* 3. Add the navigation trigger here */}
                <button 
                  className="book-btn"
                  onClick={() => navigate(`/expert/${expert._id}`)}
                >
                  Book Session
                </button>
              </div>
            ))
          ) : (
            <div className="no-data">No experts found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpertList;