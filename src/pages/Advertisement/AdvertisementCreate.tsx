import React, { useContext, useEffect } from 'react';
import AdvertisementForm from 'components/AdvertisementForm';
import { AdvertisementsContext } from 'store/advertisements';
import { AuthContext } from 'store/auth';


const AdvertisementCreate = () => {
  const { getDesiredPlacementsList, createAdvertisement, desiredPlacementsList } = useContext(AdvertisementsContext);
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    getDesiredPlacementsList();
  }, []);

  return (
    <div className="advertisement">
      {
        userData &&
        <AdvertisementForm
          onSubmit={createAdvertisement}
          desiredPlacementsList={desiredPlacementsList}
          uid={userData?.uid} />
      }
    </div>
  )
}

export default AdvertisementCreate;
