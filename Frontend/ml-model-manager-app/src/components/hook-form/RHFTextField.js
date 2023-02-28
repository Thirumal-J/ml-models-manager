// import PropTypes from 'prop-types';
// // form
// import { useFormContext, Controller } from 'react-hook-form';
// // @mui
// import { TextField } from '@mui/material';

// // ----------------------------------------------------------------------

// RHFTextField.propTypes = {
//   name: PropTypes.string,
// };

// export default function RHFTextField({ name, ...other }) {
//   const { control } = useFormContext();
//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState: { error } }) => (
//         <TextField
//           {...field}
//           fullWidth
//           name={name}
//           // label={label}
//           // onChange={onChange}
//           value={field.value}
//           // value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
//           error={!!error}
//           helperText={error?.message}
//           {...other}
//         />
//       )}
//     />
//   );
// }


import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

RHFTextField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

export default function RHFTextField({ name, label, onChange, ...other }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, ...field }, fieldState: { error } }) => (
        <TextField
          {...field}
          {...other}
          fullWidth
          name={name}
          label={label}
          // value={typeof value === 'number' && value === 0 ? '' : value}
          error={!!error}
          helperText={error?.message}
          onChange={(e) => {
            field.onChange(e);
            if (onChange) {
              onChange(e);
            }
          }}
        />
      )}
    />
  );
}

