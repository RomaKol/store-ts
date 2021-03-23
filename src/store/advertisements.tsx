import React, { createContext, useState } from 'react';
import { getAllAdvertisements, getUserAdvertisements, getAdvertisementById, createRequestForAdvertisement, getAlldesiredPlacements, createAdvertisementDocument, removeAdvertisementDocument } from 'services/FirebaseService';
import { Advertisement } from 'dto/advertisement';
import { User } from 'dto/user';
import { DesiredPlacement } from 'dto/desiredPlacement';


interface AdvertisementsContextProps {
  list: Advertisement[];
  userList: Advertisement[];
  itemInfo: Advertisement | null;
  desiredPlacementsList: DesiredPlacement[];
  getList(): void;
  getUserList(user: User): void;
  getAdvertisementInfo(id: string): void;
  clearAdvertisementInfo(): void;
  createRequest(uid: string, advertId: string, description: string, email: string): Promise<boolean>;
  getDesiredPlacementsList(): void;
  createAdvertisement(uid: string, title: string, description: string, image: File, published: string[], desired: string[]): Promise<boolean>;
  removeAdvertisement(uid: string, advertId: string): void;
};
interface AdvertisementsProviderProps {
  children: any,
};

const AdvertisementsContext = createContext({} as AdvertisementsContextProps);

const AdvertisementsProvider = (props: AdvertisementsProviderProps) => {
  const { children } = props;
  const [list, setList] = useState<Advertisement[]>([]);
  const [userList, setUserList] = useState<Advertisement[]>([]);
  const [itemInfo, setItemInfo] = useState<Advertisement | null>(null);
  const [desiredPlacementsList, setDesiredPlacementsList] = useState<DesiredPlacement[]>([]);

  const getList = () => {
    getAllAdvertisements().then((response) => {
      const { advertisements } = response;
      setList([...advertisements]);
    });
  };
  const getUserList = (user: User) => {
    getUserAdvertisements(user).then((response) => {
      const { advertisements } = response;
      setUserList([...advertisements]);
    });
  };
  const getAdvertisementInfo = (id: string) => {
    getAdvertisementById(id).then(advertisement => {
      setItemInfo(advertisement);
    });
  };
  const clearAdvertisementInfo = () => {
    setItemInfo(null);
  };
  const createRequest = async (uid: string, advertId: string, description: string, email: string) => {
    const response = await createRequestForAdvertisement(uid, advertId, description, email);
    return response;
  };
  const getDesiredPlacementsList = async () => {
    const desiredPlacements = await getAlldesiredPlacements();
    setDesiredPlacementsList(desiredPlacements);
  };
  const createAdvertisement = async (uid: string, title: string, description: string, image: File, published: string[], desired: string[]) => {
    const response = await createAdvertisementDocument(uid, title, description, image, published, desired);
    return response;
  }
  const removeAdvertisement = async (uid: string, advertId: string) => {
    const response = await removeAdvertisementDocument(uid, advertId);
  };

  const { Provider } = AdvertisementsContext;

  return <Provider value={{ list, userList, itemInfo, desiredPlacementsList, getList, getUserList, getAdvertisementInfo, clearAdvertisementInfo, createRequest, getDesiredPlacementsList, createAdvertisement, removeAdvertisement }}>{children}</Provider>
};

export { AdvertisementsContext, AdvertisementsProvider };