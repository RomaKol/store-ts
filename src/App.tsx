import React, { Component } from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import Header from 'components/Header';
import Catalog from 'pages/Advertisement/Catalog';
import AdvertisementDetail from 'pages/Advertisement/AdvertisementDetail';
import AdvertisementEdit from 'pages/Advertisement/AdvertisementEdit';
import AdvertisementCreate from 'pages/Advertisement/AdvertisementCreate';
import LogIn from 'pages/Auth/LogIn';
import SignUp from 'pages/Auth/SignUp';
import Profile from 'pages/Profile/Profile';
import { routes as ROUTES } from 'config/routes';
import { AdvertisementsProvider } from 'store/advertisements';
import { AuthProvider } from 'store/auth';


class App extends Component {
  render() {

    return (
      <AuthProvider>
        <Header />
        <div className="app-body">
          <div className="container">
            <Switch>
              <Route exact path={ROUTES.home}>
                <div>Home</div>
              </Route>
              <Route exact path={ROUTES.catalog}>
                <AdvertisementsProvider>
                  <Catalog />
                </AdvertisementsProvider>
              </Route>
              <Route exact path={`${ROUTES.catalog}/:id`}>
                <AdvertisementsProvider>
                  <AdvertisementDetail />
                </AdvertisementsProvider>
              </Route>
              <Route exact path={`${ROUTES.advertisements}/:id/edit`}>
                <AdvertisementEdit />
              </Route>
              <Route exact path={`${ROUTES.advertisements}/create`}>
                <AdvertisementsProvider>
                  <AdvertisementCreate />
                </AdvertisementsProvider>
              </Route>
              <Route exact path={ROUTES.profile}>
                <AdvertisementsProvider>
                  <Profile />
                </AdvertisementsProvider>
              </Route>
              <Route exact path={ROUTES.login} component={LogIn} />
              <Route exact path={ROUTES.signup} component={SignUp} />
            </Switch>
          </div>
        </div>
      </AuthProvider>
    );
  }
}

export default App;
