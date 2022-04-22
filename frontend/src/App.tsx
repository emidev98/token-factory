import { useNav } from './routes';
import Layout from './components/Layout';

function App() {
  const { menu, element: routes } = useNav();

  return (
    <div className="AppContainer">
      <Layout menu={menu}>
        {routes}
      </Layout>
    </div>
  )
}

export default App;
