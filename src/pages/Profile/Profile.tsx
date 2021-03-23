import React, { useContext, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { routes as ROUTES } from 'config/routes';
import { AuthContext } from 'store/auth';
import { AdvertisementsContext } from 'store/advertisements';
import ProfileForm from 'components/ProfileForm';
import CatalogItem from 'components/CatalogItem';


const Profile = () => {
  const { isLoggedIn, userData, updateUser } = useContext(AuthContext);
  const { userList, getUserList, removeAdvertisement } = useContext(AdvertisementsContext);

  useEffect(() => {
    userData && getUserList(userData);
    return () => {};
  }, [userData]);

  if (!isLoggedIn) {
    return <Redirect to={{
      pathname: `${ROUTES.login}`,
    }} />
  }

  return (
    <div className="profile">
      <h3>Profile</h3>

      {
        userData &&
        <>
          <ProfileForm
            onSubmit={updateUser}
            userData={userData} />

          <div className="catalog">
            <h3>My advertisements</h3>
            <Link to={`${ROUTES.advertisements}/create`}>Create advertisement</Link>
            <div className="row">
              {
                userList && userList.length > 0 &&
                userList
                  .map((advertItem) => {
                    return <div className="col-6 col-md-4 col-lg-3" key={advertItem.id}>
                      <CatalogItem
                        id={advertItem.id}
                        uid={userData.uid}
                        link={`${ROUTES.advertisements}/${advertItem.id}/edit`}
                        title={advertItem.title}
                        image={advertItem.image}
                        isPublished={advertItem.isPublished}
                        isOwner={true}
                        handleItemRemove={removeAdvertisement} />
                    </div>;
                  })
              }
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default Profile;