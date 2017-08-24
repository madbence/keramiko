import Inferno from 'inferno';
import Component from 'inferno-component';
import * as products from './';
import {createEmpty} from './utils';

import * as photos from '../photos';
import config from '../config';

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
    this.setState({
      item: {
        ...item,
        photos: item.photos.map(photo => `${config.cdn}/${photo.original}`),
      },
      loading: false,
      saving: false,
    }, () => {
      if (id !== item.id) {
        this.router.push(`/products/${item.id}`);
      }
    });
  }

  async load(id) {
    this.setState({loading: true});
    const item = await products.fetch(id);
    this._accept(item);
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
    }
  }

  async save() {
    this.setState({saving: true});
    try {
      const item = await products.save(this.state.item);
      this._accept(item);
    } catch (err) {
      this.context.showError(err);
      this.setState({saving: false});
    }
  }

  async uploadPhotos(e) {
    const files = Array.from(e.target.files);
    const map = files.reduce((map, file) => {
      map[window.URL.createObjectURL(file)] = file;
      return map;
    }, {});

    this.setState({
      item: {
        ...this.state.item,
        photos: [...this.state.item.photos, ...Object.keys(map)]
      },
    });

    for (const [url, file] of Object.entries(map)) {
      const uploaded = await photos.upload(file);
      await products.addPhoto(this.state.item, uploaded);
      this.setState({
        item: {
          ...this.state.item,
          photos: this.state.item.photos.map(photo => {
            if (photo !== url) return photo;
            return `${config.cdn}/${uploaded.sizes[2]}`;
          }),
        },
      });
    }
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
        <h1 className='product-details--title'>{id ? `#${id} ` : ''}{name ? name : (id ? '' : 'Új termék')}</h1>
        <div className='product-details--details-form'>
          <div className='product-details--section'>
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
            <ul className='product-details--tag-list'>
              {
                tags.map(tag => <li className='product-details--tag-pill'>{tag}</li>)
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
          <div className='product-details--section'>
            <ul className='product-details--photo-list'>
              {
                photos.map(url => (
                  <li className='product-details--photo-item'>
                    <img src={url} />
                  </li>
                ))
              }
              <li className='product-details--photo-item'>
                <label className='product-details--uploader'>
                  <input accept='image/*' type='file' onChange={e => this.uploadPhotos(e)} />
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
