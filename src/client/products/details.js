import Inferno from 'inferno';
import Component from 'inferno-component';
import * as products from './';
import {createEmpty} from './utils';

import * as images from '../images';

const num = n => parseInt(n, 10);
const checkbox = (value, input) => !input.checked;

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

    const {id, name, price, description, published, photos, tags} = item;
    const update = (field, parse = x => x) => event => this.setState({
      item: {
        ...this.state.item,
        [field]: parse(event.target.value, event.target, event),
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

    const addTag = tag => {
      this.setState({
        item: {
          ...this.state.item,
          tags: [...this.state.item.tags, tag.trim()],
        },
      });
    };

    const removeTag = () => {
      this.setState({
        item: {
          ...this.state.item,
          tags: this.state.item.tags.slice(0, -1),
        },
      });
    };

    return (
      <div className='card product-details'>
        <h1 className='title'>{id ? `#${id} ` : ''}{name ? name : (id ? '' : 'Új termék')}</h1>
        <div className='details'>
          <div className='info'>
            <label className='name material-input'>
              <input type='text' disabled={saving} value={name} onInput={update('name')} />
              <span className={name ? 'active' : ''}>A termék neve</span>
            </label>
            <label className='price material-input'>
              <input type='number' disabled={saving} value={price ? price : ''} onChange={update('price', num)} />
              <span className={price ? 'active' : ''}>A termék ára (Ft)</span>
            </label>
            <label className='description material-input'>
              <textarea disabled={saving} value={description} onInput={update('description')} />
              <span className={description ? 'active' : ''}>A termék leírása</span>
            </label>
            <label className='published'>
              <span>Látható az oldalon</span>
              <input disabled={saving} type='checkbox' checked={published} onChange={update('published', checkbox)} />
            </label>
            <ul className='tags'>
              {
                tags.map(tag => <li className='tag'>{tag}</li>)
              }
              <li>
                <input
                  placeholder='Új címke'
                  onKeyUp={e => {
                    const key = e.keyCode;
                    const value = e.target.value;

                    switch (key) {
                      case 13:
                        addTag(value);
                        e.target.value = '';
                        break;
                      case 8:
                        if (value === '') return removeTag();
                    }
                  }}
                />
              </li>
            </ul>
            <div>
              <button onClick={() => this.save()}>{saving ? 'Mentés...' : 'Mentés'}</button>
            </div>
          </div>
          <div className='photos'>
            <ul>
              {
                photos.map(url => (
                  <li>
                    <img src={url} />
                  </li>
                ))
              }
              <li>
                <label>
                  <input accept='image/*' type='file' onChange={updatePhotos} />
                  <div>Válassz egy képet!</div>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
