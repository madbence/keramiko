import Inferno from 'inferno';
import Component from 'inferno-component';

const Details = ({id, name, description, price, tags}) => (
  <div className='product'>
  {
    id
      ? (
        <header>
          <span>#{id}</span>
          <input value={name} />
        </header>
      )
      : (
        <header>
          <input placeholder='Írd be a termék nevét' />
        </header>
      )
  }
    <div className='details'>
      <div className='info'>
        <div>
          <input placeholder='A termék ára' /><span>Ft</span>
        </div>
        <div>
          <textarea placeholder='A termék leírása' />
        </div>
      </div>
      <div className='photos'>
      </div>
    </div>
  </div>
);

export default class ProductDetails extends Component {
  constructor(props, context) {
    super(props, context);
    if (props.id) {
      this.state = {
        loading: true,
        item: null,
      };
    } else {
      this.state = {
        loading: false,
        item: {
          id: null,
          name: '',
          price: null,
          description: '',
          tags: [],
        },
      };
    }
  }

  componentDidMount() {
    if (this.state.item) return;
    // TODO load existing item
  }

  render() {
    const {loading, item} = this.state;
    return (
      <div className='card'>
      {
        loading
          ? <span>Betöltés</span>
          : <Details {...item} />
      }
      </div>
    );
  }
}
