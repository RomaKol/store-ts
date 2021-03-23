import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { routes as ROUTES } from 'config/routes';
import { AuthContext } from 'store/auth';
import LogInFormfrom from 'components/LogInForm';


const LogIn = () => {
  const { isLoggedIn, login } = useContext(AuthContext);

  if (isLoggedIn) {
    return <Redirect to={{
      pathname: `${ROUTES.profile}`,
    }} />
  }

  return (
    <div className="log-in">
      <h2>Log In, Please!</h2>
      <LogInFormfrom onSubmit={login} />
      <p><Link to={ROUTES.signup}>Sign Up</Link></p>
    </div>
  )
}

export default LogIn;
