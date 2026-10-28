import type { IEntity } from '../../common/entities/index.js';

export interface Customer extends IEntity {
  firstName?: string;
  lastName?: string;
  email: string;
  gender?: string;
  company?: string;
  city?: string;
  title?: string;
}
