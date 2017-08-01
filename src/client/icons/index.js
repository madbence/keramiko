import Inferno from 'inferno';

export default ({icon, onClick, className}) => (
  <div className={'icon' + (className ? ' ' + className : '')} dangerouslySetInnerHTML={{__html: icon}} onClick={onClick} />
);
