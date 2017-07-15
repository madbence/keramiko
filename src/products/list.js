import Inferno from 'inferno';

const id = x => x;
const f = (name, label, display = id) => ({name, label, display});

const productFields = [
  f('id', 'ID'),
  f('name', 'Név'),
  f('description', 'Leírás'),
  f('price', 'Ár'),
  f('tags', 'Címkék', tags => tags.join(', ')),
];

export default ({items, loading}) => (
  <div className='card'>
    <header>
      <h2>Termékek</h2>
      <button>Új termék</button>
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
            <li className='product'>
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
