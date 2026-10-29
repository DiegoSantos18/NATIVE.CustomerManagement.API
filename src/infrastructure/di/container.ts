import 'reflect-metadata';
import { Container } from 'inversify';
import { registerCustomersModule } from './modules/customers.module.js';

const container = new Container();
//////////////////////////// Register Modules DI ////////////////////////////
registerCustomersModule(container);
/////////////////////////////////////////////////////////////////////////////
export { container };
