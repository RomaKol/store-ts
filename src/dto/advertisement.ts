import { DesiredPlacement } from './desiredPlacement';
import { User } from './user';
import { Request } from './request';

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  image: string;
  isPublished: boolean;
  desired: DesiredPlacement[];
  date: Date;
  user: User | null;
  requests: Request[];
}