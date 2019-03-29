import React from 'react';
import { observer, useObservable } from 'mobx-react-lite';

import './index.css';

import NavBar from './components/NavBar';
import { Layout, Sidebar, Content } from './components/Layout';
import UserProfile from './components/UserProfile';
import OwnerPanel from './components/OwnerPanel';
import Notifications from './components/Notifications';

import AppStore from './mobx/app';

const AppRoot = () => {
  const { isOwner, isOnline } = useObservable(AppStore);
  return (
    <>
      <NavBar />
      <Layout>
        <Sidebar>
          <UserProfile />
          {isOnline && isOwner && <OwnerPanel />}
        </Sidebar>
        <Content>Content</Content>
      </Layout>
      <Notifications />
    </>
  );
};

export default observer(AppRoot);
