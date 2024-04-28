import { Request } from 'express';
import { PayloadModel } from './payload.model';

export class RequestUserModel extends Request {
  user: { payload: PayloadModel };
}
