import React, { useEffect, useContext } from 'react';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';

import { AdvertisementsContext } from 'store/advertisements';
import { AuthContext } from 'store/auth';
import AdvertItem from 'components/AdvertItem';
import RequestForm from 'components/RequestForm';
import { Advertisement } from 'dto/advertisement';


// type AdvertisementDetailProps = {
//   advertItem: Advertisement;
// };
type RouteParams = {
  id: string
};

const AdvertisementDetail = (props: any) => {
  // const { advertItem } = props;
  const { itemInfo, getAdvertisementInfo, clearAdvertisementInfo, createRequest } = useContext(AdvertisementsContext);
  const { userData } = useContext(AuthContext);
  const params = useParams<RouteParams>();
  const { id } = params;

  useEffect(() => {
    getAdvertisementInfo(id);
    return () => clearAdvertisementInfo();
  }, [id]);

  return (
    <div className="advertisement-detail">
      {
        itemInfo &&
        <>
          <AdvertItem item={itemInfo} />
          <RequestForm
            onSubmit={createRequest}
            advertId={id}
            uid={userData?.uid || ""} />
        </>
      }
    </div>
  )
}

export default AdvertisementDetail;