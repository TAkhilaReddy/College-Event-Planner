// import { Request } from 'express';

// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: {
//       user_id: number;
//       email: string;
//     };
//   }
// }
    
// types/express/index.d.ts

import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      user_id: number;
      // add other fields like email, role, etc. if needed
    }

    interface Request {
      user?: User;
    }
  }
}
