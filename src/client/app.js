import Inferno from 'inferno';
import {Router, Route} from 'inferno-router';
import createBrowserHistory from 'history/createBrowserHistory';
import {List as ProductList, Details as ProductDetails} from './products';
import Icon from './icons';
import shoppingCart from './icons/shopping-cart';

const App = ({children}, {router}) => (
  <div id='wrapper'>
    <div id='nav'>
      <ul>
        <li onClick={() => router.push('/')}>
          <Icon icon={shoppingCart} />
          Terméklista
        </li>
      </ul>
    </div>
    <div id='main-wrapper'>
      <header>
        <h2>Szia!</h2>
      </header>
      <div id='main'>
        {children}
      </div>
    </div>
  </div>
);

Inferno.render(
  <Router history={createBrowserHistory()}>
    <Route component={App}>
      <Route path='/' component={ProductList} />
      <Route path='/products/:id' component={({params}) => <ProductDetails id={params.id === 'new' ? null : +params.id} />} />
    </Route>
  </Router>,
  document.querySelector('#app')
);
