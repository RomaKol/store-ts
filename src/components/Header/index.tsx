import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { routes as ROUTES } from 'config/routes';
import { AuthContext } from 'store/auth';


const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <header>
      <div className="container">
        <nav>
          <ul className="main-menu">
            <li className="main-menu__item">
              <Link to={ROUTES.home}>Home</Link>
            </li>
            <li className="main-menu__item">
              <Link to={ROUTES.catalog}>Catalog</Link>
            </li>
            {
              isLoggedIn
                ? <>
                  <li className="main-menu__item"><Link to={ROUTES.profile}>Profile</Link></li>
                  <li className="main-menu__item"><button onClick={logout}>Log Out</button></li>
                </>
                : <>
                  <li className="main-menu__item"><Link to={ROUTES.login}>Log In</Link></li>
                  <li className="main-menu__item"><Link to={ROUTES.signup}>Sign Up</Link></li>
                </>
            }
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header;