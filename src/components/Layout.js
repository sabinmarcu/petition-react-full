/* eslint-disable react/prop-types */

import React from 'react';

import style from './Layout.module.css';

export const Layout = ({ children }) => (
  <section className={style.layout}>
    <div className={style.wrapper}>
      {children}
    </div>
  </section>
);

export const Sidebar = ({ children }) => (
  <section className={style.sidebar}>{children}</section>
);

export const Content = ({ children }) => (
  <section className={style.content}>{children}</section>
);
