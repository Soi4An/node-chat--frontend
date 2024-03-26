import {
  Box,
  Chip,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getUsersNames } from '../api/axios';
import { useAppContext } from './AppProvider';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, members: readonly string[]) {
  return {
    fontWeight: members.indexOf(name) === -1 ? '400px' : '600px',
  };
}

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

type Props = {
  userName: string;
  members: string[];
  setMembers: (ms: string[]) => void;
};

function SelectMembers({ userName, members, setMembers }: Props) {
  const [users, setUsers] = useState<string[]>(names);
  const { setGlobalError } = useAppContext();

  const handleChangeSelect = (event: SelectChangeEvent<string[]>) => {
    const names = event.target.value;

    setMembers(typeof names === 'string' ? names.split(',') : names);
  };

  const handlerDeletMember = (name: string) => {
    setMembers(members.filter((n) => n !== name));
  };

  useEffect(() => {
    getUsersNames()
      .then((res) => setUsers(res.data.filter((name) => name !== userName)))
      .catch(() => setGlobalError('Could not get all users'));
  }, []);

  return (
    <>
      <InputLabel id="demo-multiple-chip-label">Members</InputLabel>

      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        value={members}
        onChange={handleChangeSelect}
        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={value}
                onDelete={() => handlerDeletMember(value)}
                onMouseDown={(e) => e.stopPropagation()}
              />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
        sx={{ width: '100%' }}
      >
        {users.map((name) => (
          <MenuItem key={name} value={name} style={getStyles(name, members)}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}

export default SelectMembers;
