'use client';
import React, { useEffect, useRef } from 'react';
import useLoadGoogleMaps from '../hooks/useLoadGoogleMaps';

export interface AddressDetails {
  address: string;
  city: string;
  province: string;
  zip: string;
}

interface AddressAutocompleteProps {
  onSelect: (addressDetails: AddressDetails) => void;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({ onSelect }) => {
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const googleMapsLoaded = useLoadGoogleMaps('AIzaSyDRP0HO61LShzlU9MJ1yhnkmHUTK70uEDs');

  useEffect(() => {
    if (!googleMapsLoaded || !autocompleteRef.current) return;

    const autocomplete = new (window as any).google.maps.places.Autocomplete(autocompleteRef.current);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const addressDetails: AddressDetails = {
        address: place?.formatted_address || '',
        city: '',
        province: '',
        zip: ''
      };

      if (place?.address_components) {
        place.address_components.forEach((component: any) => {
          const types = component.types;
          if (types.includes('locality')) {
            addressDetails.city = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            addressDetails.province = component.long_name;
          }
          if (types.includes('postal_code')) {
            addressDetails.zip = component.long_name;
          }
        });
      }

      onSelect(addressDetails);
    });

    return () => {
      (window as any).google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [googleMapsLoaded, onSelect]);

  return (
    <input
      ref={autocompleteRef}
      type="text"
      className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter your address"
    />
  );
};

export default AddressAutocomplete;
