import type { IBaseSeedDTO } from '../common/index.js';

export interface CustomerSeedDTO extends IBaseSeedDTO {
  first_name: string;
  last_name?: string | null;
  email: string;
  gender?: string | null;
  company?: string | null;
  city?: string | null;
  title?: string | null;
}
