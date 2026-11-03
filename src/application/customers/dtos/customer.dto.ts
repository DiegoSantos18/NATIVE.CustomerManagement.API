import type { IAuditedDTO, IBaseDTO } from '../../common/dtos/index.js';

export interface CustomerDTO extends IBaseDTO<number>, IAuditedDTO {
  firstName?: string;
  lastName?: string;
  email: string;
  gender?: string;
  company?: string;
  city?: string;
  title?: string;
}
