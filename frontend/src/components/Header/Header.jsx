import React from 'react'
import './Header.css'
import { useNavigate } from 'react-router-dom'

const Header = ({ setMenu }) => {
  const navigate = useNavigate();

  const handleViewMenu = () => {
    if (setMenu) setMenu('menu');
    const section = document.getElementById('explore-menu');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      // fallback: navigate to home and scroll after navigation
      navigate('/');
      setTimeout(() => {
        const sectionAfterNav = document.getElementById('explore-menu');
        if (sectionAfterNav) {
          sectionAfterNav.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className='header'>
        <div className="header-contents">
            <h2>Order your favourite food here</h2>
            <button onClick={handleViewMenu}>View Menu</button>
        </div>
    </div>
  )
}

export default Header