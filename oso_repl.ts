import { OsoInstance } from './src/oso/oso-instance';

const oso: OsoInstance = new OsoInstance();
oso.repl().catch(console.error);
