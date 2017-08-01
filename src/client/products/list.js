import Inferno from 'inferno';
import Component from 'inferno-component';
import {fetch} from './';

import Icon from '../icons';
import trash from '../icons/trash';
import check from '../icons/check';
import times from '../icons/times';

const id = x => x;
const f = (name, label, display = id) => ({name, label, display});

const productFields = [
  f('id', 'ID'),
  f('name', 'Név'),
  f('published', 'Publikus', published => <Icon className={published ? 'published' : 'unpublished'} icon={published ? check : times} />),
  f('description', 'Leírás'),
  f('price', 'Ár', price => `${price} Ft`),
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
      items: items.map(item => ({
        ...item,
        pending: false,
      })),
    });
  }

  render() {
    const {loading, items} = this.state;

    let body = loading
      ? <li className='product loader'>Betöltés...</li>
      : items.map(item => (
        <li className={'product' + (item.pending ? ' pending' : '')} onClick={() => this.router.push(`/products/${item.id}`)}>
          {
            productFields.map(({name, display}) => (
              <div className={'field ' + name}>{display(item[name])}</div>
            ))
          }
          <div className='field actions'><Icon icon={trash} onClick={e => {
            this.setState({
              items: items.map(i => {
                if (i !== item) return i;
                return {
                  ...item,
                  pending: true,
                }
              }),
            });
            e.stopPropagation();
          }} /></div>
        </li>
      ));

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
            <div className='field actions' />
          </li>
          {body}
        </ul>
      </div>
    );
  }
}
