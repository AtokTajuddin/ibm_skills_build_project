import { Document } from 'mongoose';
import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: Document<any, any, IUser> & IUser;
    }
  }
}
