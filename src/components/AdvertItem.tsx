import React from 'react';
import { format, addSeconds } from 'date-fns';
import { Advertisement } from 'dto/advertisement';


type AdvertItemProps = {
  item: Advertisement;
};

const AdvertItem = (props: AdvertItemProps) => {
  const { item } = props;

  return (
    <div className="advertisement">
      <h2 className="advertisement__title">{item.title}</h2>
      <p className="advertisement__text">{format(item.date, 'dd/MM/yyyy')}</p>
      <h3 className="advertisement__subtitle">Description</h3>
      <p className="advertisement__text">{item.description}</p>
      <h3 className="advertisement__subtitle">Status</h3>
      {
        item.isPublished
          ? <p>опубліковано</p>
          : <p>чернетка</p>
      }
      {
        item.desired.length > 0 &&
        <>
          <h3 className="advertisement__subtitle">Desired placements</h3>
          <ul>
            {
              item.desired.map(desiredItem => {
                return <li key={desiredItem.id}>{desiredItem.title}</li>;
              })
            }
          </ul>
        </>
      }
      {
        item.user &&
        <>
          <h3 className="advertisement__subtitle">Owner</h3>
          <p>{item.user?.name}</p>
        </>
      }
      <img src={item.image} alt={item.title} title={item.title} />
      <p>Requests Number: {item.requests.length}</p>
    </div>
  )
}

export default AdvertItem;