import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import AccountView from 'src/views/account/AccountView';
import AuthorListView from 'src/views/author/AuthorListView';
import WorkView from 'src/views/work/WorkView';
import AddNewWork from 'src/views/work/addnew';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import AuthorDetail from './views/author/detail';
import ArtworkDetail from './views/work/detail'
import {getCurrentUser} from './assets/login';

const userData = getCurrentUser() || null;
var progress = localStorage.getItem("progress") || null;
const routes = [
  {
    path: 'admin',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: userData ? <AccountView />:<Navigate to="/login" /> },
      { path: 'author', element: userData ? <AuthorListView /> : <Navigate to="/login" /> },
      { path: 'author/detail/:id', element: userData ? <AuthorDetail /> :<Navigate to="/login" /> },
      { path: 'work', element: userData ? <WorkView /> :<Navigate to="/login" /> },
      { path: 'work/addnew/:id', element: userData ? <AddNewWork /> :<Navigate to="/login" /> },
      { path: 'work/detail/:id', element: userData ? <ArtworkDetail /> :<Navigate to="/login" /> }, 
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    children: [
      { path: 'app', element: userData ? <Navigate to="/admin/work" /> : <Navigate to="/login" />},
      { path: 'login', element: <LoginView /> },
      { path: '/', element: <Navigate to="/login" /> },
      { path: 'dropbox/account/link',element: userData ? <DashboardLayout/> : <Navigate to="/login"/>, children: progress=="new" ? [{path: "", element: <AddNewWork/>}] : [{path: "", element: <ArtworkDetail/>}]},
      { path: '404', element: <NotFoundView /> },      
      { path: '*', element: <Navigate to="/404" /> }  
    ]
  }
];

export default routes;
