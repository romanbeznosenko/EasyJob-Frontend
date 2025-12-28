import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { generate, presetPalettes } from '@ant-design/colors';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  const colors = generate('#1890ff');
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
