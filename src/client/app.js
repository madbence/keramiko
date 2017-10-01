import Inferno from 'inferno';
import Component from 'inferno-component';
import {Router, Route} from 'inferno-router';
import createBrowserHistory from 'history/createBrowserHistory';
import {List as ProductList, Details as ProductDetails} from './products';
import Icon from './icons';
import shoppingCart from './icons/shopping-cart';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      error: null,
    };
  }

  getChildContext() {
    return {
      showError: error => {
        this.setState({error});
      },
    };
  }

  render() {
    return (
      <div id='wrapper'>
        {
          this.state.error
            ? <div className='error'>
              <span className='error--message'>{this.state.error.message}</span>
              <button onClick={() => this.setState({error: null})}>Bezár</button>
            </div>
            : null
        }
        <div className='navigation'>
          <ul>
            <li className='navigation--item' onClick={() => this.context.router.push('/')}>
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
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
Inferno.render(
  <Router history={createBrowserHistory()}>
    <Route component={App}>
      <Route path='/' component={ProductList} />
      <Route path='/products/:id' component={({params}) => <ProductDetails id={params.id === 'new' ? null : +params.id} />} />
    </Route>
  </Router>,
  document.querySelector('#app')
);
