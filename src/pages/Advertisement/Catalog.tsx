import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { AdvertisementsContext } from 'store/advertisements';
import { AuthContext } from 'store/auth';
import CatalogItem from 'components/CatalogItem';
import { routes as ROUTES } from 'config/routes';


const Catalog = () => {
  const { list, getList } = useContext(AdvertisementsContext);
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="catalog">
      <div className="row">
        {
          list && list.length > 0 &&
          list
            .filter(advertItem => advertItem.isPublished === true)
            .sort((first, second) => {
              if (first.date < second.date) {
                return 1;
              } else if (first.date > second.date) {
                return -1;
              } else {
                return 0;
              }
            })
            .map((advertItem, index) => {
              return <div className="col-6 col-md-4 col-lg-3" key={advertItem.id}>
                <CatalogItem
                  id={advertItem.id}
                  uid={""}
                  link={`${ROUTES.catalog}/${advertItem.id}`}
                  title={advertItem.title}
                  image={advertItem.image}
                  isPublished={advertItem.isPublished}
                  isOwner={false}
                  handleItemRemove={() => { }} />
              </div>;
            })
        }
      </div>
    </div>
  )
}

export default Catalog;
