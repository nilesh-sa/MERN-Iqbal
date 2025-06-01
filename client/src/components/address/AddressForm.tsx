
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddressPropType } from '../dashboard/Dashboard';
import { Checkbox } from '../ui/checkbox';



interface AddressFormProps {
  initialData?: AddressPropType;
  onSubmit: (data: AddressPropType) => void;
  onCancel?: () => void;
  title?: string;
  isFormModified?:(isDirty: boolean) => void;
  editedAddressData?:(data:any) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  title = "Address Information",
  isFormModified,
  editedAddressData
}) => {
  const { register, handleSubmit, reset, formState: { errors,isDirty,dirtyFields } } = useForm<AddressPropType>({
    defaultValues: initialData
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        houseNumber: initialData.houseNumber || '',
        buildingName: initialData.buildingName || '',
        addressLine1: initialData.addressLine1 || '',
        addressLine2: initialData.addressLine2 || '',
        city: initialData.city || '',
        state: initialData.state || '',
        zipCode: initialData.zipCode || '',
        isDefault: initialData.isDefault || false
      });
    }
  }, [initialData, reset]);
  useEffect(()=>{
    isFormModified?.(isDirty);
  },[isDirty,dirtyFields]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Title</Label>
            <Input
              id="street"
              {...register('title', { required: 'Street address is required' })}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
           <div className='grid grid-cols-2 gap-4'>
          <div className="space-y-2">
            <Label htmlFor="street">House Number</Label>
            <Input
              id="street"
              {...register('houseNumber', { required: 'Street address is required' })}
            />
            {errors.houseNumber && <p className="text-sm text-destructive">{errors.houseNumber.message}</p>}
          </div>
           <div className="space-y-2">
            <Label htmlFor="street">Building Name</Label>
            <Input
              id="street"
              {...register('buildingName', { required: 'Street address is required' })}
            />
            {errors.buildingName && <p className="text-sm text-destructive">{errors.buildingName.message}</p>}
          </div>
           </div>
            <div className="space-y-2">
            <Label htmlFor="street">Address Line 1</Label>
            <Input
              id="street"
              {...register('addressLine1', { required: 'Street address is required' })}
            />
            {errors.addressLine1 && <p className="text-sm text-destructive">{errors.addressLine1.message}</p>}
          </div>
           <div className="space-y-2">
            <Label htmlFor="street">Address Line 2</Label>
            <Input
              id="street"
              {...register('addressLine2', { required: 'Street address is required' })}
            />
            {errors.addressLine2 && <p className="text-sm text-destructive">{errors.addressLine2.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register('city', { required: 'City is required' })}
              />
              {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                {...register('state', { required: 'State is required' })}
              />
              {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
            </div>
          </div>
          
         <div className="grid grid-cols-2 gap-4">
  {/* ZIP Code Input */}
  <div className="space-y-2">
    <Label htmlFor="zipCode">ZIP Code</Label>
    <Input
      id="zipCode"
      {...register('zipCode', { required: 'ZIP code is required' })}
    />
    {errors.zipCode && (
      <p className="text-sm text-destructive">{errors.zipCode.message}</p>
    )}
  </div>

  {/* Checkbox aligned vertically with input */}
  <div className="flex items-center pt-[1rem]"> {/* Aligns to bottom like input */}
    <Label htmlFor="isDefault" className="flex items-center space-x-2">
      <input type='checkbox' id="isDefault" {...register('isDefault')} 
      
      />
      <span>Set as Default Address</span>
    </Label>
  </div>
</div>

          
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Save Address
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
