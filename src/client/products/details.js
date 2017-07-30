import Inferno from 'inferno';
import Component from 'inferno-component';
import * as products from './';
import {createEmpty} from './utils';

import * as images from '../images';

const num = n => parseInt(n, 10);

export default class ProductDetails extends Component {

  state = {
    loading: false,
    saving: false,
    item: null,
  };

  constructor(props, context) {
    super(props, context);
    this.router = context.router;
  }

  _accept(item) {
    const id = this.state.item && this.state.item.id;
    this.setState({item}, () => {
      if (id !== item.id) {
        this.router.push(`/products/${item.id}`);
      }
    });
  }

  async load(id) {
    this.setState({loading: true});
    const item = await products.fetch(id);
    this._accept(item);
    this.setState({loading: false});
  }

  async componentWillReceiveProps(props) {
    if (props.id === (this.state.item && this.state.item.id)) {
      return;
    }
    await this.load(props.id);
  }

  componentDidMount() {
    if (this.props.id) {
      this.load(this.props.id);
    } else {
      this._accept(createEmpty());
      this.setState({loading: false});
    }
  }

  async save() {
    this.setState({saving: true});
    const item = await products.save(this.state.item);
    this._accept(item);
    this.setState({saving: false});
  }

  render() {
    const {loading, saving, item} = this.state;

    if (loading || !item) {
      return (
        <div className='card'>
          <span>Betöltés</span>
        </div>
      );
    }

    const {id, name, price, description, photos} = item;
    const update = (field, parse = x => x) => event => this.setState({
      item: {
        ...this.state.item,
        [field]: parse(event.target.value),
      },
    });

    const updatePhotos = async e => {
      const files = Array.from(e.target.files);
      this.setState({
        item: {
          ...this.state.item,
          photos: [...this.state.item.photos, ...files.map(file => window.URL.createObjectURL(file))]
        },
      });

      for (const file of files) {
        await images.upload(file);
      }
    };

    return (
      <div className='card'>
        <div className='product'>
          <h1>{id ? `#${id} ` : ''}{name ? name : (id ? '' : 'Új termék')}</h1>
          <div className='details'>
            <div className='info'>
              <label>
                <input disabled={saving} value={name} onInput={update('name')} />
                <span className={name ? 'active' : ''}>A termék neve</span>
              </label>
              <label>
                <input type='number' disabled={saving} value={price ? price : ''} onChange={update('price', num)} />
                <span className={price ? 'active' : ''}>A termék ára (Ft)</span>
              </label>
              <label>
                <textarea disabled={saving} value={description} onChange={update('description')} />
                <span className={description ? 'active' : ''}>A termék leírása</span>
              </label>
              <div>
                <button onClick={() => this.save()}>{saving ? 'Mentés...' : 'Mentés'}</button>
              </div>
            </div>
            <div className='photos'>
              <label>
                <input accept='image/*' type='file' onChange={updatePhotos} />
                <div>Válassz egy képet!</div>
              </label>
              <ul>
                {
                  photos.map(url => (
                    <li>
                      <img src={url} />
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
