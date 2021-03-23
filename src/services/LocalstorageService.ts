import { User } from 'dto/user';
import { DesiredPlacement } from 'dto/desiredPlacement';
import { Advertisement } from 'dto/advertisement';


// user
export const saveUserToLocalStorage = async (user: User): Promise<void> => {
  await localStorage.setItem("user", JSON.stringify(user));
}

export const getUserFromLocalStorage = async (): Promise<User | null> => {
  const userString = localStorage.getItem('user');
  if (typeof userString === 'string') {
    const user = JSON.parse(userString);
    return user;
  } else {
    return null;
  }
}

export const removeUserFromLocalStorage = async (): Promise<void> => {
  await localStorage.removeItem('user');
}

// Desired placements
export const setDesiredPlacementsToLocalStorage = async (desiredPlacements: DesiredPlacement[]): Promise<void> => {
  await localStorage.setItem("desiredPlacements", JSON.stringify(desiredPlacements));
}

export const getDesiredPlacementsFromLocalStorage = async (): Promise<DesiredPlacement[]> => {
  const desiredPlacementsString = localStorage.getItem('desiredPlacements');
  if (typeof desiredPlacementsString === 'string') {
    const user = JSON.parse(desiredPlacementsString);
    return user;
  } else {
    return [];
  }
}

export const removeDesiredPlacementsFromLocalStorage = async (): Promise<void> => {
  await localStorage.removeItem('desiredPlacements');
}
