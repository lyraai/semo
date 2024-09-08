// pages/index.js
import React from 'react';
import dynamic from 'next/dynamic';
import 'regenerator-runtime/runtime';

// 动态加载 app_1，禁用服务端渲染
const App = dynamic(() => import('../App'), { ssr: false });

export default function Home() {
  return <App />;
}