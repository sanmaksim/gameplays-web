import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from 'react-router-dom';
import { RootState } from './store';
import { useSelector } from 'react-redux';
import AboutPage from './pages/AboutPage';
import GamePage from './pages/GamePage';
import GamesPage from './pages/GamesPage';
import HelpPage from './pages/HelpPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MainLayout from './layouts/MainLayout';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPage from './pages/PrivacyPage';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import TosPage from './pages/TosPage';

function App() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route index element={<HomePage />} />

        {/* Auth Routes */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        
        {/* Private Routes */}
        { userInfo ? (
          <Route path='' element={<PrivateRoute />}>
            <Route path='/user/profile' element={<ProfilePage />} />
            <Route path='/user/games' element={<GamesPage />} />
          </Route>
        ) : (
          <>
            <Route path='/user/*' element={<NotFoundPage />} />
          </>
        )}
        
        {/* Info Routes */}
        <Route path='/about' element={<AboutPage />} />
        <Route path='/help' element={<HelpPage />} />
        <Route path='/privacy' element={<PrivacyPage />} />
        <Route path='/tos' element={<TosPage />} />

        {/* Search Route */}
        <Route path='/game/:gameId' element={<GamePage />} />
        <Route path='/search' element={<SearchPage />} />

        <Route path='*' element={<NotFoundPage />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
