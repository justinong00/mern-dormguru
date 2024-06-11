import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <>
      {/* 
      ConfigProvider is a component from Ant Design, a UI library for React. It allows us to customize the appearance of our application by providing a theme configuration object. In this case, we are customizing the color of the primary token. The theme object is passed as a prop to the ConfigProvider component, which then applies the changes to the entire application. The App component is the root component of our application, so these changes will be applied to it.
      The colorPrimary token is a primary color that is used throughout the application, so changing its value here will affect most of the colors in our application. The colorPrimary token is set to #0b2447, which is a dark blue color.
     */}
    </>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0b2447',
          colorBorder: '#0b2447',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
