import Inferno from 'inferno';
import Component from 'inferno-component';
import {fetch} from './';

const id = x => x;
const f = (name, label, display = id) => ({name, label, display});

const productFields = [
  f('id', 'ID'),
  f('name', 'Név'),
  f('description', 'Leírás'),
  f('price', 'Ár'),
  f('tags', 'Címkék', tags => tags.join(', ')),
];

export default class ProductList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      items: [],
    };
    this.router = context.router;
  }

  componentDidMount() {
    this.loadProducts();
  }

  async loadProducts() {
    this.setState({
      loading: true,
      items: [],
    });
    const items = await fetch();
    this.setState({
      loading: false,
      items,
    });
  }

  render() {
    const {loading, items} = this.state;
    return (
      <div className='card product-list'>
        <header>
          <h2>Termékek</h2>
          <button onClick={() => this.router.push('/products/new')}>Új termék</button>
        </header>
        <ul className='products'>
          <li className='header product'>
          {
            productFields.map(({name, label}) => (
              <div className={'field ' + name}>{label}</div>
            ))
          }
          </li>
          {
            loading
              ? <li className='product loader'>Betöltés...</li>
              : items.map(item => (
                <li className='product' onClick={() => this.router.push(`/products/${item.id}`)}>
                {
                  productFields.map(({name, display}) => (
                    <div className={'field ' + name}>{display(item[name])}</div>
                  ))
                }
                </li>
              ))
          }
        </ul>
      </div>
    );
  }
}
