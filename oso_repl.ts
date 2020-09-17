import { OsoInstance } from './src/oso/oso-instance';

const oso: OsoInstance = new OsoInstance();
oso.initialized()
  .then(() =>  oso.repl())
  .catch((err) => console.error(err));
