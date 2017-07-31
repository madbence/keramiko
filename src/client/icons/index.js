import Inferno from 'inferno';

export default ({icon, onClick}) => (
  <div className='icon' dangerouslySetInnerHTML={{__html: icon}} onClick={onClick} />
);
