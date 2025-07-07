import styled from "styled-components";

export const StyledMovie = styled.div`
  margin-bottom: 1rem;

  .card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    /* Fixed dimensions untuk konsistensi */
    width: 100%;
    min-height: 400px; /* Tinggi minimum card */

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    }
  }

  .image-container {
    position: relative;
    width: 100%;
    /* Fixed aspect ratio untuk gambar */
    height: 300px; /* Tinggi tetap untuk gambar */
    overflow: hidden;
    flex-shrink: 0; /* Mencegah gambar menyusut */
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Memastikan gambar mengisi container tanpa distorsi */
    object-position: center top; /* Fokus ke bagian atas gambar (biasanya wajah aktor) */
  }

  .content {
    padding: 1rem;
    flex-grow: 1; /* Mengisi sisa ruang card */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100px; /* Tinggi minimum untuk content */
  }

  h3 {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.primary || "#0F172A"};
    margin-bottom: 0.5rem;
    font-weight: 600;
    line-height: 1.3;
    
    /* Multi-line text handling */
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Maksimal 2 baris */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 2.6em; /* Ruang untuk 2 baris text */
  }

  .year {
    color: ${({ theme }) => theme.colors.secondary || "#64748b"};
    font-size: 0.8rem;
    margin-bottom: 0.3rem;
    font-weight: 500;
  }

  .genre {
    color: #4361ee;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: auto; /* Push ke bawah */
  }

  /* Responsive adjustments */
  @media (max-width: 480px) {
    .card {
      min-height: 350px;
    }
    
    .image-container {
      height: 250px;
    }
    
    h3 {
      font-size: 0.9rem;
    }
  }

  @media (min-width: 768px) {
    .card {
      min-height: 420px;
    }
    
    .image-container {
      height: 320px;
    }
  }

  @media (min-width: 992px) {
    padding: 0.5rem; /* Padding untuk spacing antar card */
    
    .card {
      min-height: 450px;
    }
    
    .image-container {
      height: 340px;
    }
    
    h3 {
      font-size: 1rem;
    }
  }
`;