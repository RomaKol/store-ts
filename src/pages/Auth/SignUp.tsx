import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import SignUpForm from 'components/SignUpForm';
import { AuthContext } from 'store/auth';
import { routes as ROUTES } from 'config/routes';


const SignUp = () => {
  const { isLoggedIn, signUp } = useContext(AuthContext);

  if (isLoggedIn) {
    return <Redirect to={{
      pathname: `${ROUTES.profile}`,
    }} />
  }

  return (
    <div className="sign-up">
      <h2>Sign Up!</h2>
      <SignUpForm onSubmit={signUp} />
      <p><Link to={ROUTES.login}>Log In</Link></p>
    </div>
  )
}

export default SignUp;
