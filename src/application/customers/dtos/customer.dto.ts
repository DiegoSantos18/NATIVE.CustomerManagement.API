import type { IBaseDTO } from '../../common/dtos/index.js';

export interface CustomerDTO extends IBaseDTO {
  firstName?: string;
  lastName?: string;
  email: string;
  gender?: string;
  company?: string;
  city?: string;
  title?: string;
}
