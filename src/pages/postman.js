import { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

export default function Postman() {
  const history = useHistory();

  useEffect(() => {
    history.replace('/api');
  }, []);

  return null;
}
