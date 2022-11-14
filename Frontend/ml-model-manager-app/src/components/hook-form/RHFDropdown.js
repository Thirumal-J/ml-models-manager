import PropTypes from 'prop-types';
// material
import { MenuItem, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import React from 'react';

// ----------------------------------------------------------------------

RHFDropdown.propTypes = {
  options: PropTypes.array,
};

export default function RHFDropdown({ name, options, ...other }) {
  const { control } = useFormContext();
  
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select size="small"
          helperText={error?.message}
          value={field.value}
          error={!!error}
          {...other}>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
