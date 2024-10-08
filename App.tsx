// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Root from './Root'; 

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
