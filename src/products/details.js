import Inferno from 'inferno';
import Component from 'inferno-component';
import * as products from './';


export default class ProductDetails extends Component {
  constructor(props, context) {
    super(props, context);
    this.router = context.router;

    if (props.id) {
      this.state = {
        loading: true,
      };
    } else {
      this.state = {
        loading: false,
        saving: false,
        id: null,
        name: '',
        price: null,
        description: '',
        tags: [],
        photos: [],
      };
    }
  }

  _accept(item) {
    const id = this.state.id;
    this.setState({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      tags: item.tags,
      photos: item.photos,
    }, () => {
      if (id !== item.id) {
        this.router.push(`/products/${item.id}`);
      }
    });
  }

  async load(id) {
    this.setState({loading: true});
    const item = await products.fetch(id);
    this.setState({loading: false});
    this._accept(item);
  }

  async componentWillReceiveProps(props) {
    console.log(this.state.id, props.id);
    if (props.id === this.state.id) {
      return;
    }
    await this.load(props.id);
  }

  async componentDidMount() {
    if (this.props.id) {
      await this.load(this.props.id);
    } else {
      this._accept({
        id: null,
        name: '',
        price: '',
        description: '',
        tags: [],
        photos: [],
      });
    }
  }

  async save() {
    this.setState({saving: true});
    const id = this.state.id;
    const item = await products.save({
      id: this.state.id,
      name: this.state.name,
      price: this.state.price,
      description: this.state.description,
      tags: [],
      photos: this.state.photos,
    });
    this.setState({saving: false});
    this._accept(item);
  }

  render() {
    const {loading, id, name, price, description, saving, photos} = this.state;
    const update = (field, parse = x => x) => event => this.setState({[field]: parse(event.target.value)});

    const updatePhotos = e => {
      this.setState({
        photos: Array.from(e.target.files).map(file => window.URL.createObjectURL(file)),
      });
    };

    return (
      <div className='card'>
      {
        loading
          ? <span>Betöltés</span>
          : <div className='product'>
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
      }
      </div>
    );
  }
}
