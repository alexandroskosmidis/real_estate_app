import { useParams } from 'react-router-dom';

const PropertyDetailPage = () => {
  const { id } = useParams();

  return <h1>Property Detail for ID: {id}</h1>;
};

export default PropertyDetailPage;
