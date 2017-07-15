import Inferno from 'inferno';
import {Router, Route} from 'inferno-router';
import createBrowserHistory from 'history/createBrowserHistory';
import {List as ProductList, Details as ProductDetails} from './products';

const App = props => (
  <div id='wrapper'>
    <div id='nav'>
      <ul>
        <li>Terméklista</li>
      </ul>
    </div>
    <div id='main-wrapper'>
      <header>
        <h2>Szia!</h2>
      </header>
      <div id='main'>
        {props.children}
      </div>
    </div>
  </div>
);

Inferno.render(
  <Router history={createBrowserHistory()}>
    <Route component={App}>
      <Route path='/' component={ProductList} />
      <Route path='/products/:id' component={({params}) => <ProductDetails id={params.id} />} />
    </Route>
  </Router>,
  document.querySelector('#app')
);
