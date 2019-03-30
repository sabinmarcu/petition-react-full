import React from 'react';
import { observer, useObservable } from 'mobx-react-lite';

import './index.css';

import NavBar from './components/NavBar';
import {
  Layout,
  Sidebar,
  Content,
  FullWidth,
} from './components/Layout';
import Navigator from './components/Navigator';
import UserProfile from './components/UserProfile';
import OwnerPanel from './components/OwnerPanel';
import Notifications from './components/Notifications';
import Petition from './components/Petition';

import AppStore from './mobx/app';

const AppRoot = () => {
  const { isOwner, isOnline } = useObservable(AppStore);
  return (
    <>
      <NavBar />
      <Layout>
        <FullWidth>
          <Navigator />
        </FullWidth>
        {isOnline && (
        <>
          <Sidebar>
            <UserProfile />
            {isOwner && <OwnerPanel />}
          </Sidebar>
          <Content>
            <Petition />
          </Content>
        </>
        )}
      </Layout>
      <Notifications />
    </>
  );
};

export default observer(AppRoot);
