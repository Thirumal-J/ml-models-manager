import React from "react";
import { Card, Typography, Table, TableBody, TableContainer, TableRow, TableCell, TableHead, Paper } from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

const DynamicTable1 = ({ title, data, color='primary', sx}) => {
  const headers = Object.keys(data[0]);

  const theme = useTheme();

  return (
    // <Card
    //   sx={{
    //     py: 5,
    //     boxShadow: 0,
    //     paddingLeft: 3,
        
    //     // bgcolor: (theme) => theme.palette[color].lighter,
    //     ...sx,
    //   }}
    // >
      <Paper 
      sx={{
            py: 5,
            boxShadow: 0,
            paddingLeft: 3,
            paddingRight: 3,
      }}>
        <Typography variant="h4" color="primary">
          {title}
        </Typography>

        <hr />

        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header,index) => (
                <TableCell key={index} align="right">{header.toUpperCase()}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {headers.map((header,idx) => (
                  <TableCell key={idx} align="right">{row[header]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    // </Card>
  );
}

DynamicTable1.defaultProps = {
  title: "No Title",
  // color: PropTypes.string,
  // sx: PropTypes.object,
};

export default DynamicTable1;
