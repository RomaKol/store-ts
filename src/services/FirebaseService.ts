import firebase, { database } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { User } from 'dto/user';
import { DesiredPlacement } from 'dto/desiredPlacement';
import { Advertisement } from 'dto/advertisement';
import { Request } from 'dto/request';


const firebaseConfig = {
  apiKey: "AIzaSyBgvFrVva6jglta_tevVJ98DF8Xbl-NHqc",
  authDomain: "advertisements-store.firebaseapp.com",
  databaseURL: "https://advertisements-store.firebaseio.com",
  projectId: "advertisements-store",
  storageBucket: "advertisements-store.appspot.com",
  messagingSenderId: "805608077664",
  appId: "1:805608077664:web:2ba955be7c5ce3101d8605"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();


// Users
const generateUserDocument = async (user: User) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email, name } = user;
    try {
      await userRef.set({
        email,
        name,
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

type GetUserDocumentProps = {
  user: User;
};

const getUserDocument = (uid: string): Promise<GetUserDocumentProps> => new Promise(async (resolve, reject) => {
  if (!uid) reject("ID is required");
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();
    const userData = await userDocument.data();
    resolve({ user: { uid, name: userData?.name || "", email: userData?.email || "" } });
  } catch (error) {
    console.error("Error fetching user", error);
    reject(error);
  }
});

const getDesiredPlacementDocument = (id: string) => new Promise((resolve, reject) => {
  if (!id) reject('Field id is required!');
  try {
    firestore.doc(`desired-placement/${id}`).get().then(desiredPlacementSnapshot => {
      if (desiredPlacementSnapshot) {
        const desiredPlacementDocument = {
          id,
          ...desiredPlacementSnapshot.data(),
        };
        resolve(desiredPlacementDocument);
      } else {
        reject();
      }
    });
  } catch (error) {
    console.error("Error fetching desired placement", error);
    reject(error);
  }
});

export const getAlldesiredPlacements = async (): Promise<DesiredPlacement[]> => {
  const querySnapshot = await firestore.collection('desired-placement').get();
  const desiredPlacements = querySnapshot.docs.map((doc) => {
    const desPlData = doc.data();
    return { id: doc.id, title: desPlData.title };
  });
  return desiredPlacements;
};

export const createUserWithEmailAndPassword = async (email: string, password: string, name: string) => new Promise(async (res, rej) => {
  try {
    const { user } = await auth.createUserWithEmailAndPassword(email, password);
    if (user) {
      const updatedUser = { uid: user.uid, email: user.email || "", name };
      generateUserDocument(updatedUser).then(response => {
        res(response);
      });
    } else {
      rej();
    }
  }
  catch (error) {
    rej(error);
  }
});

export const signInWithEmailAndPassword = async (email: string, password: string) => new Promise(async (res, rej) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        getUserDocument(userAuth.uid)
          .then(response => {
            res(response.user);
          });
      }
    });
  } catch (error) {
    rej(error);
  }
});

export const updateUserData = async (uid: string, name: string, email: string) => new Promise(async (res, rej) => {
  if (!uid) rej("Invalid id!");
  const userRef = firestore.doc(`users/${uid}`);
  try {
    const user = auth.currentUser;
    user && user.updateEmail(email).then((resp) => {
    });
    await userRef.update({ name, email });
    const userDocument = await userRef.get();
    res({ uid, ...userDocument.data() });
  } catch (error) {
    console.error("Error updating user document", error);
  }
});


// Requests
type GetRequestsProps = {
  requests: Request[];
};
const getRequestsForAdvertisement = async (advertId: string): Promise<Request[]> => {
  const advertRef = await firestore.doc(`advertisements/${advertId}`);
  const querySnapshot = await firestore.collection('requests').where("advertisement", "==", advertRef).get();
  const requests: Request[] = [];
  for (const doc of querySnapshot.docs) {
    const requestData = doc.data();
    requests.push({ id: requestData.id, advertisementId: requestData.advertisement.id, uid: requestData.user.id })
  }

  return requests;
};


// Advertisemwnts
const mapAdvertisements = async (doc: firebase.firestore.DocumentData, user: User): Promise<Advertisement> => {
  let itemDesiredPlacements: DesiredPlacement[] = [];
  const advertisement = doc.data();
  const ids = await advertisement['desired-placements'].map((desiredPlacementSnapshot: any) => desiredPlacementSnapshot.id);
  await getAlldesiredPlacements().then(desiredPlacements => {
    itemDesiredPlacements = ids.map((id: string) => desiredPlacements.find(item => item.id === id));
  });
  const itemRequests = await getRequestsForAdvertisement(doc.id);

  const advert: Advertisement = {
    id: doc.id,
    title: advertisement.title,
    description: advertisement.description,
    image: advertisement.image,
    isPublished: advertisement.isPublished,
    date: advertisement.date.seconds,
    user: user,
    desired: [...itemDesiredPlacements],
    requests: [...itemRequests],
  };

  return advert;
}

type GetAdvertisementsProps = {
  advertisements: Advertisement[];
};
export const getAllAdvertisements = async (): Promise<GetAdvertisementsProps> => {
  const querySnapshot = await firestore.collection('advertisements').get();
  const advertisements: Advertisement[] = [];
  for (const doc of querySnapshot.docs) {
    const advertisement = doc.data();
    await getUserDocument(advertisement.user.id).then(async response => {
      const { user } = response;
      await mapAdvertisements(doc, user).then(advert => {
        advertisements.push(advert);
      });
    });
  }

  return { advertisements };
};

export const getUserAdvertisements = async (user: User): Promise<GetAdvertisementsProps> => {
  const userRef = await firestore.doc(`users/${user.uid}`);
  const querySnapshot = await firestore.collection('advertisements').where("user", "==", userRef).get();
  const advertisements: Advertisement[] = [];
  for (const doc of querySnapshot.docs) {
    await mapAdvertisements(doc, user).then(advert => {
      advertisements.push(advert);
    });
  }

  return { advertisements };
};

export const getAdvertisementById = async (id: String): Promise<Advertisement | null> => {
  if (!id) {
    console.log("ID is required");
    return null;
  }
  try {
    const advertisementSnapshot = await firestore.doc(`advertisements/${id}`).get();
    const advertisementData = await advertisementSnapshot.data();
    let advertisement = null;
    await getUserDocument(advertisementData?.user.id).then(async response => {
      const { user } = response;
      await mapAdvertisements(advertisementSnapshot, user).then(advert => {
        advertisement = advert;
      });
    });
    return advertisement;
  } catch (error) {
    console.error("Error fetching advertisement by id", error);
    return null;
  }
};

export const createRequestForAdvertisement = async (uid: string, advertId: string, description: string, email: string): Promise<boolean> => {
  const userRef = firestore.doc(`users/${uid}`);
  const userSnapshot = await userRef.get();
  const advertRef = firestore.doc(`advertisements/${advertId}`);
  const advertSnapshot = await advertRef.get();
  if (userSnapshot.exists && advertSnapshot.exists) {
    try {
      await firestore.collection('requests').add({
        user: userRef,
        advertisement: advertRef,
        description,
        email,
      });
      return true;
    } catch (error) {
      console.log("Error creating request", error);
      return false;
    }
  } else {
    return false;
  }
};

export const createAdvertisementDocument = async (uid: string, title: string, description: string, image: File, published: string[], desired: string[]): Promise<boolean> => {
  const userRef = firestore.doc(`users/${uid}`);
  const desiredPlacementRefs = desired.map(itemId => firestore.doc(`desired-placement/${itemId}`));
  const date = new Date();
  const isPublished = published && published.length > 0 ? true : false;
  const uploadTask = storage.ref(`/images/${image.name}`).put(image);
  uploadTask.on('state_changed',
    (snapShot) => {
      // console.log("snapShot", snapShot);
    },
    (err) => { console.log("err", err); return false; },
    () => {
      storage.ref('images').child(image.name).getDownloadURL()
        .then(async (firebaseUrl) => {
          try {
            await firestore.collection('advertisements').add({
              title: title,
              description: description,
              date: date,
              isPublished: isPublished,
              user: userRef,
              'desired-placements': desiredPlacementRefs,
              image: firebaseUrl,
            });
          } catch (error) {
            console.log("Error creating advertisement", error);
            return false;
          }
        });
    });
  return true;
};

export const removeAdvertisementDocument = async (uid: string, advertId: string): Promise<boolean> => {
  const advertRef = firestore.doc(`advertisements/${advertId}`);
  const advertSnapshot = await advertRef.get();
  const advertData = await advertSnapshot.data();
  if (advertData && advertData.user.id === uid) {
    try {
      await firestore.doc(`advertisements/${advertId}`).delete();
      return true;
    } catch (error) {
      console.log("Error deletion advertisement", error);
      return false;
    }
  } else {
    return false;
  }
};

export const updateAdvertisementDocument = async (uid: string, title: string, description: string, image: File, published: string[], desired: string[]): Promise<boolean> => {

  return true;
};

// export const updateUserData = async (uid: string, name: string, email: string) => new Promise(async (res, rej) => {
//   if (!uid) rej("Invalid id!");
//   const userRef = firestore.doc(`users/${uid}`);
//   try {
//     const user = auth.currentUser;
//     user && user.updateEmail(email).then((resp) => {
//     });
//     await userRef.update({ name, email });
//     const userDocument = await userRef.get();
//     res({ uid, ...userDocument.data() });
//   } catch (error) {
//     console.error("Error updating user document", error);
//   }
// });
