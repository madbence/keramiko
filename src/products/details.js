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
  </div>
);

export default class ProductDetails extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: true,
      item: null,
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
      item: {
        id: null,
        name: '',
        price: null,
        description: '',
        tags: [],
      },
    });
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
