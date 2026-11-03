import type { IAudited, IEntity } from '../../common/entities/index.js';

export interface Customer extends IEntity<number>, IAudited {
  firstName: string;
  lastName: string | null;
  email: string;
  gender: string | null;
  company: string | null;
  city: string | null;
  title: string | null;
}
