import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Read the environment variable (it will be set at build time)
//const deploymentType = process.env.NEXT_PUBLIC_DEPLOYMENT_TYPE;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(request: NextRequest) {
  // Check if we're in production mode
  // if (deploymentType === 'production') {
  //   return new NextResponse(
  //     `
  //     <!DOCTYPE html>
  //     <html lang="en">
  //     <head>
  //       <meta charset="UTF-8" />
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  //       <title>Under Construction</title>
  //       <style>
  //         body {
  //           margin: 0;
  //           padding: 0;
  //           font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  //           background: linear-gradient(135deg, #B5E2D9, #5A5A5A);
  //           display: flex;
  //           align-items: center;
  //           justify-content: center;
  //           height: 100vh;
  //           color: #fff;
  //           text-align: center;
  //         }
  //         h1 {
  //           font-size: 3em;
  //           margin: 0;
  //           padding: 0.5em;
  //         }
  //         p {
  //           font-size: 1.5em;
  //         }
  //         .container {
  //           background: rgba(0, 0, 0, 0.3);
  //           padding: 2em;
  //           border-radius: 10px;
  //           box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  //         }
  //       </style>
  //     </head>
  //     <body>
  //       <div class="container">
  //         <h1>This site is under construction</h1>
  //       </div>
  //     </body>
  //     </html>
  //     `,
  //     {
  //       headers: { 'Content-Type': 'text/html' },
  //     }
  //   );
  //  }

//   // In non-production environments, continue normally
   return NextResponse.next();
}
