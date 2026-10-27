import type { IEntity } from '../../common/entities/index.js';

export interface Customer extends IEntity {
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  email: string;
  gender?: string;
  company?: string;
  city?: string;
  title?: string;
}
