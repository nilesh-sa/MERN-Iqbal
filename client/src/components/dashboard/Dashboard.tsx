import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AddressForm } from "@/components/address/AddressForm";
import { AddressList } from "@/components/address/AddressList";
import { User, MapPin, Plus, LogOut, Settings } from "lucide-react";
import { UserPropsType } from "@/pages/Index";
import { UpdatePassword } from "../auth/UpdatePassword";
import {
  addNewAddressApiHandler,
  changePasswordApiHandler,
  deleteAddressApiHandler,
  getAxiosErrorMessage,
  updateAddressApiHandler,
} from "@/services/api";
import { toast } from "sonner";
import { useGetAllMyAddressQuery } from "@/services/query";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { useDebounce } from "@/hooks/useDebounce";

export interface AddressPropType {
  id: string;
  title: string;
  houseNumber: string;
  buildingName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface DashboardProps {
  user: UserPropsType;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [addresses, setAddresses] = useState<AddressPropType[]>([]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressPropType | null>(
    null
  );
  const [searchquery, setSearchQuery] = useState("");
  const [userSearchInput, setUserSearchInput] = useState("");
  const debouncedSearchValue= useDebounce(userSearchInput, 500);
  const addressQuery = useGetAllMyAddressQuery(searchquery, user.token);
  const queryclient = useQueryClient();
  const [isFormModified, setIsFormModified] = useState(false);
  
  

  const handleProfileUpdate = (profileData: any) => {
    
    // Here you would typically update the user data in your backend
  };

 const handleAddNewAddress = async (addressData: any) => {
  try {
    const newAddressApiResponse = await addNewAddressApiHandler(
      addressData,
      user.token
    );
    if (newAddressApiResponse.status === 201) {
      toast.success("Address added successfully!", {
        position: "top-right",
      });
      queryclient.refetchQueries({
        queryKey: ["getAllMyAddress"],
      });
    }
    setShowAddressForm(false);
  } catch (error) {
    const errMes = getAxiosErrorMessage(error);
    toast.error(`Address submission failed: ${errMes}`, {
      position: "top-right",
    });
  }
};

const handleUpdateAddress = async (addressData: any,addressId:string) => {
  try {
    const updatedAddressApiRes = await updateAddressApiHandler(addressData, user.token,addressId);
    if (updatedAddressApiRes.status === 200) {
      toast.success("Address updated successfully!", {
        position: "top-right",
      });
      queryclient.refetchQueries({
        queryKey: ["getAllMyAddress"],
      });
    }
    setShowAddressForm(false);
    setEditingAddress(null);
  } catch (error) {
    const errMes = getAxiosErrorMessage(error);
    toast.error(`Address update failed: ${errMes}`, {
      position: "top-right",
    });
  }
};

const handleAddressSubmit = async (addressData: any) => {
  if (editingAddress && isFormModified) {
    await handleUpdateAddress(addressData, editingAddress.id);
  } else if (!editingAddress) {
    await handleAddNewAddress(addressData);
  } else {
    // If form is not modified but editing, just close the form
    setShowAddressForm(false);
    setEditingAddress(null);
  }
};

  const handleEditAddress = (address: AddressPropType) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async(id: string) => {
    try {
       const deleteAddressApiResponse = await deleteAddressApiHandler(id, user.token);
      if (deleteAddressApiResponse.status === 200) {
        toast.success("Address deleted successfully!", {
          position: "top-right",
        });
        queryclient.refetchQueries({
          queryKey: ["getAllMyAddress"],
        });
      }
    } catch (error) {
      const errMes = getAxiosErrorMessage(error);
      toast.error(`Address deletion failed: ${errMes}`, {
        position: "top-right",
      });
      
    }
  };
 
  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };
  const updatePasswordHandler = async (data: any) => {
    try {
      const response = await changePasswordApiHandler(data, user.token);
      if (response.status === 200) {
        toast.success("Password updated successfully!", {
          position: "top-right",
        });
        onLogout(); // Optionally log out user after password change
        return;
      }
    } catch (error) {
      const errMes = getAxiosErrorMessage(error);
      toast.error(`Password update failed: ${errMes}`, {
        position: "top-right",
      });
    }
  };
  useEffect(() => {
    if (addressQuery.isSuccess && addressQuery.data) {
      setAddresses(addressQuery.data?.data?.addresses || []);
    }
  }, [addressQuery.data]);
 
   useEffect(()=>{
    setSearchQuery(debouncedSearchValue);
   },[debouncedSearchValue])
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
            <TabsTrigger
              value="changePassword"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Change Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileForm initialData={user} onSubmit={handleProfileUpdate} />
          </TabsContent>

          <TabsContent value="addresses" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Your Addresses</h2>
                <Input 
                  type="text"
                  placeholder=" search by title ,city or state "
                  value={userSearchInput}
                  onChange={(e) => setUserSearchInput(e.target.value.trim())}
                  className="w-1/3 "
                
                />
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
                  isFormModified={(isDirty) => setIsFormModified(isDirty)}
            
                  
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
                <UpdatePassword onSubmit={updatePasswordHandler} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
