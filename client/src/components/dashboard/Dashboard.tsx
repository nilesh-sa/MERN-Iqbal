
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { AddressForm } from '@/components/address/AddressForm';
import { AddressList } from '@/components/address/AddressList';
import { User, MapPin, Plus, LogOut, Settings } from 'lucide-react';
import { UserPropsType } from '@/pages/Index';
import { UpdatePassword } from '../auth/UpdatePassword';
import { changePasswordApiHandler, getAxiosErrorMessage } from '@/services/api';
import { toast } from 'sonner';


interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
  token:string;
}

interface DashboardProps {
  user: UserPropsType;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA',
      isDefault: true
    }
  ]);
  
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleProfileUpdate = (profileData: any) => {
    console.log('Profile updated:', profileData);
    // Here you would typically update the user data in your backend
  };

  const handleAddressSubmit = (addressData: any) => {
    if (editingAddress) {
      // Update existing address
      setAddresses(prev => 
        prev.map(addr => 
          addr.id === editingAddress.id 
            ? { ...addr, ...addressData }
            : addr
        )
      );
    } else {
      // Add new address
      const newAddress = {
        id: Date.now().toString(),
        ...addressData
      };
      setAddresses(prev => [...prev, newAddress]);
    }
    
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    );
  };
  const updatePasswordHandler= async (data: any) => {
     try {
      const response = await changePasswordApiHandler(data,user.token);
      if (response.status === 200) {
        toast.success('Password updated successfully!', { position: 'top-right' });
        onLogout(); // Optionally log out user after password change
      return;
      }
      
     } catch (error) {
       const errMes= getAxiosErrorMessage(error);
       toast.error(`Password update failed: ${errMes}`, { position: 'top-right' });
     }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.firstName}!</h1>
            <p className="text-gray-600">Manage your profile and addresses</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          
          <TabsList className="grid w-full  md:grid-cols-3 grid-col gap-2 ">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Addresses
            </TabsTrigger>
             <TabsTrigger value="changePassword" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Change Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileForm
              initialData={user}
              onSubmit={handleProfileUpdate}
            />
          </TabsContent>

          <TabsContent value="addresses" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Your Addresses</h2>
                <Button onClick={() => setShowAddressForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </div>

              {showAddressForm ? (
                <AddressForm
                  initialData={editingAddress || undefined}
                  onSubmit={handleAddressSubmit}
                  onCancel={() => {
                    setShowAddressForm(false);
                    setEditingAddress(null);
                  }}
                  title={editingAddress ? "Edit Address" : "Add New Address"}
                />
              ) : (
                <AddressList
                  addresses={addresses}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                  onSetDefault={handleSetDefaultAddress}
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="changePassword" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Update Your Password Here</CardTitle>
                
              </CardHeader>
              <CardContent>
                
            <UpdatePassword onSubmit={updatePasswordHandler}/>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
