import Inferno from 'inferno';
import Component from 'inferno-component';
import {List as ProductList, fetch as fetchProducts} from './products';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: {
        fetching: false,
        items: [],
      },
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  async fetchProducts() {
    this.setState({
      products: {
        fetching: true,
        items: [],
      },
    });
    const items = await fetchProducts();
    this.setState({
      products: {
        fetching: false,
        items,
      },
    });
  }

  render() {
    return (
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
            <ProductList loading={this.state.products.fetching} items={this.state.products.items} />
          </div>
        </div>
      </div>
    );
  }
}

Inferno.render(<App />, document.querySelector('#app'));
