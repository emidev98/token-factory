import { useNav } from './routes';
import Layout from './components/Layout';
import { SnackbarProvider } from 'notistack';

function App() {
  const { menu, element: routes } = useNav();

  return (
    <div className="AppContainer">
      <SnackbarProvider 
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}>
        <Layout menu={menu}>
          {routes}
        </Layout>
      </SnackbarProvider>
    </div>
  )
}

export default App;
