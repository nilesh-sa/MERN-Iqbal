
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, MapPin } from 'lucide-react';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

interface AddressListProps {
  addresses: Address[];
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export const AddressList: React.FC<AddressListProps> = ({ 
  addresses, 
  onEdit, 
  onDelete, 
  onSetDefault 
}) => {
  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <Card key={address.id} className={`${address.isDefault ? 'ring-2 ring-primary' : ''}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {address.isDefault && <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded">Default</span>}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(address)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(address.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.zipCode}</p>
              <p>{address.country}</p>
            </div>
            {!address.isDefault && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => onSetDefault(address.id)}
              >
                Set as Default
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
