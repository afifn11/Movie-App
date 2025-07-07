import { useState } from "react";
import { Link } from "react-router-dom";
import { StyledMovie } from "./Movie.styled";

function Movie({ id, title, year, type, poster }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const placeholderImage = "https://via.placeholder.com/500x750?text=No+Image+Available";

  return (
    <StyledMovie>
      <Link to={`/movie/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card">
          <div className="image-container">
            {imageLoading && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#64748b'
              }}>
                Loading...
              </div>
            )}
            <img 
              src={imageError ? placeholderImage : poster} 
              alt={`${title} Poster`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{ display: imageLoading ? 'none' : 'block' }}
            />
          </div>
          <div className="content">
            <h3 title={title}>{title}</h3>
            <p className="year">{year || 'Unknown Year'}</p>
            <p className="genre">{type || 'Unknown Genre'}</p>
          </div>
        </div>
      </Link>
    </StyledMovie>
  );
}

export default Movie;