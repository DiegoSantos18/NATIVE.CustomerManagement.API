import type { Response } from 'express';

export abstract class BaseController {
  protected ok<T>(res: Response, data: T): void {
    res.status(200).json(data);
  }

  protected badRequest(res: Response, message: string): void {
    res.status(400).json({ message });
  }

  protected notFound(res: Response, message: string): void {
    res.status(404).json({ message });
  }
}
