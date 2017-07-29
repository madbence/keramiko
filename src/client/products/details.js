import Inferno from 'inferno';
import Component from 'inferno-component';
import * as products from './';
import {createEmpty} from './utils';

import * as images from '../images';

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
      this.setState({
        item: {
          ...this.state.item,
          photos: Array.from(e.target.files).map(file => window.URL.createObjectURL(file)),
        },
      });

      for (const file of e.target.files) {
        await images.upload(file);
      }
    };

    return (
      <div className='card'>
        <div className='product'>
          {
            id
              ? (
                <header>
                  <span>#{id}</span>
                  <input disabled={saving} value={name} onChange={update('name')} placeholder='A termék neve' />
                </header>
              )
              : (
                <header>
                  <input disabled={saving} value={name} onInput={update('name')} placeholder='Írd be a termék nevét' />
                </header>
              )
          }
          <div className='details'>
            <div className='info'>
              <div>
                <input disabled={saving} value={price} onChange={update('price', x => +x)} placeholder='A termék ára' /><span>Ft</span>
              </div>
              <div>
                <textarea disabled={saving} value={description} onChange={update('description')} placeholder='A termék leírása' />
              </div>
              <div>
                <button onClick={() => this.save()}>{saving ? 'Mentés...' : 'Mentés'}</button>
              </div>
            </div>
            <div className='photos'>
              <label>Válassz egy képet!<input accept='image/*' type='file' onChange={updatePhotos} /></label>
              {
                photos.map(url => <img src={url} />)
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
