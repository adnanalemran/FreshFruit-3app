// import { Navigate, useLocation } from 'react-router-dom';
// // import useAuth from '@/hooks/useAuth';
// import React from 'react';

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const location = useLocation();
// //   const { getToken, getRole } = useAuth(); // Assuming useAuth provides role

//   const token = getToken();
//   const role = getRole(); // Fetch the user's role
// console.log('role', role)
//   if (token && role === "1") {
//     return children;
//   }

//   return <Navigate state={{ from: location.pathname }} to="/sign-in" />;
// };

// export default ProtectedRoute;