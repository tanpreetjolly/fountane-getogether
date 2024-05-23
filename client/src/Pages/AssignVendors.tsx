import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

type Props = {};

const vendorData = [
  {
    id: '11',
    name: 'Shivam Caterers',
    type: 'food',
    status: 'invite',
  },
  {
    id: '21',
    name: 'Vanish Caterings',
    type: 'food',
    status: 'invite',
  },
  {
    id: '31',
    name: 'Event Managers Inc.',
    type: 'event management',
    status: 'invited',
  },
  {
    id: '41',
    name: 'Dhillon Managers Inc.',
    type: 'event management',
    status: 'invited',
  },
];

const AssignVendors = (_props: Props) => {
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

  const handleVendorChange = (vendorId: string) => {
    setSelectedVendors((prevSelectedVendors) =>
      prevSelectedVendors.includes(vendorId)
        ? prevSelectedVendors.filter((id) => id !== vendorId)
        : [...prevSelectedVendors, vendorId]
    );
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom className='text-center'>
        Assign Vendors for the Festivity
      </Typography>
      <List>
        {vendorData.map((vendor) => (
          <ListItem
            key={vendor.id}
            secondaryAction={
              <Checkbox
              color='secondary'
                edge="end"
                checked={selectedVendors.includes(vendor.id)}
                onChange={() => handleVendorChange(vendor.id)}
              />
            }
          >
            <ListItemText primary={vendor.name} secondary={`Type: ${vendor.type}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default AssignVendors;