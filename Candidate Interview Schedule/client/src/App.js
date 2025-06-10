// import React, { Suspense } from 'react';
// import { AuthProvider } from './context/AuthProvider';
// import router from './routes/Router';
// import { RouterProvider } from 'react-router-dom';
// import { ThemeProvider } from '@mui/material/styles';
// import customTheme from './theme/custom-theme';

// function App() {
//   return (
//     <AuthProvider>
//       <ThemeProvider theme={customTheme}>
//         <Suspense fallback={<div>Loading...</div>}>
//           <RouterProvider router={router} />
//         </Suspense>
//       </ThemeProvider>
//     </AuthProvider>
//   );
// }

// export default App;

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { Suspense } from 'react';
import { AuthProvider } from './context/AuthProvider';
import router from './router/Router';
import { RouterProvider } from 'react-router-dom';
import Spinner from './components/spinner/Spinner';
import { HelmetProvider } from 'react-helmet-async';


  function App() {
    return (
       <HelmetProvider>
      <AuthProvider>
          <Suspense fallback={<Spinner />}>
            <RouterProvider router={router} />
          </Suspense>
      </AuthProvider>
      </HelmetProvider>
    );
  }

export default App;
