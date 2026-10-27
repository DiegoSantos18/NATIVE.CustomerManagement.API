import type { IBaseDTO } from '../../common/dtos/index.js';

export interface CustomerDTO extends IBaseDTO {
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
