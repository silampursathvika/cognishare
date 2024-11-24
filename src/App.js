import React from 'react';
import {createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './components/homepage/HomePage';
import Editor from './components/editor/Editor';
import './App.css';

function App() {
  // create browser router
  const router=createBrowserRouter([
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path:'/editor/:roomId',
      element:<Editor/>
    }
  ])
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
