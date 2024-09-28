"use client";
import "./globals.css";
import { Provider } from 'react-redux';
import { store } from './GlobalRedux/store';





export default function RootLayout({ children }) {
  return (
    
    <html lang="en">
      <meta
    name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      <body >
      <Provider store={store}>
          {children}
        </Provider>

      </body>
    </html>
  );
}
