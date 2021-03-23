import React from 'react';
import { Link } from 'react-router-dom';


type CatalogItemProps = {
  id: string;
  uid: string;
  link: string;
  title: string;
  image: string;
  isPublished: boolean;
  isOwner: boolean;
  handleItemRemove(uid: string, advertId: string): void;
}
const CatalogItem = (props: CatalogItemProps) => {
  const { id, uid, link, title, image, isPublished, isOwner, handleItemRemove } = props;

  return (
    <div className="catalog-item">
      <Link to={link}>
        <h3 className="catalog-item__title">{title}</h3>
      </Link>
      <div className="catalog-item__img-container">
        {
          isOwner
            ? isPublished
              ? <span className="catalog-item__marker marker marker--active">опубліковано</span>
              : <span className="catalog-item__marker marker marker--inActive">чернетка</span>
            : <></>
        }
        {
          isOwner &&
          <button
            className="button button--delete catalog-item__button-delete"
            onClick={() => handleItemRemove(uid, id)}>X</button>
        }
        <Link to={link}>
          <img className="catalog-item__img" src={image} alt={title} title={title} />
        </Link>
      </div>
    </div>
  )
}

export default CatalogItem;
