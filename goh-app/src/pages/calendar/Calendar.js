import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import * as React from 'react';

import { useAuthContext } from '../../hooks/useAuthContext';
import { useDocument } from '../../hooks/useDocument';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { firedb } from '../../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import Grid from '@mui/material/Grid';

dayjs.extend(isBetweenPlugin);

const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) =>
        prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay',
})(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
    ...(dayIsBetween && {
        borderRadius: 0,
        backgroundColor: 'red',
        color: theme.palette.common.white,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.primary.dark,
        },
    }),
    ...(isFirstDay && {
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
    }),
    ...(isLastDay && {
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
    }),
}));

export default function Calendar() {
    const [value, setValue] = React.useState(dayjs(new Date()));
    const { user } = useAuthContext();
    const { documents: userDetail } = useDocument('users', user.uid);
    const [error, setError] = useState(null);
    const [currentMonthTasks, setCurrentMonthTasks] = useState([]);
    const [dueDateList, setDueDateList] = useState([]);

    useEffect(() => {
        if (userDetail) {
            let taskList = [];
            let dateList = [];
            if (userDetail.ownedProjects.length > 0 ) {
                userDetail.ownedProjects.forEach((project) => {
                    const monthStart = new Date(dayjs().startOf('month').format('MM/DD/YYYY'));
                    const monthEnd = new Date(dayjs().endOf('month').format('MM/DD/YYYY'));
                    const taskRef =  query(collection(firedb,"projects/"+ project + "/tasks"), where("currUserId", "==", user.uid),
                                    where("dueDateTime",">=", monthStart),where("dueDateTime","<=", monthEnd));
                    const unsub = onSnapshot(taskRef,(snapshot) => {
                        snapshot.docs.forEach(tk => {
                            const data = tk.data();
                            if(!(taskList.some((item) => item.taskId == data.taskId))){
                                taskList.push(data);
                            }
                            if(!(dateList).some((item) => item === data.dueDate)){
                                dateList.push(data.dueDate);
                            }
                            setDueDateList(dateList);
                            setCurrentMonthTasks(taskList);
                        })
                    }, (error) => {
                        console.log(error.message)
                    })
                    return () => unsub()
                })
            }
        }
    }, [userDetail])

    const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
        const curDate = dayjs(date).format("MM/DD/YYYY");
        if (!value) {
            return <PickersDay {...pickersDayProps}/>;
        }

        const start = value.startOf('week');
        const end = value.endOf('week');
        const dayIsBetween = dueDateList.some((item) => item === curDate)
        // const isFirstDay = date.isSame(start, 'day');
        // const isLastDay = date.isSame(end, 'day');

        return (
            <CustomPickersDay
                {...pickersDayProps}
                disableMargin
                dayIsBetween={dayIsBetween}
            />
        );
    };

    if (!userDetail) {
        return <div> Loading ... </div>
    }

    return (
        <Box sx={{width:'85%', margin: 'auto', paddingTop:'20px'}}>
            <Grid container spacing={2}>
            <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDatePicker
                        displayStaticWrapperAs="desktop"
                        label="Week picker"
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue);
                        }}
                        renderDay={renderWeekPickerDay}
                        renderInput={(params) => <TextField {...params} />}
                        inputFormat="'Week of' MMM d"
                    />
                </LocalizationProvider>
            </Grid>
            <Grid item xs={8}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="task list">
                        <TableHead>
                            <TableRow>
                                <TableCell>Task Name</TableCell>
                                <TableCell>Task Description</TableCell>
                                <TableCell align="right">Due Date</TableCell>
                                <TableCell align="right">Task Page</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentMonthTasks.map((row) => (
                                <TableRow
                                    key={row.taskId}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.taskName}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.taskDescr}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.dueDate}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button component={Link} 
                                                to={`/project/taskinfo/${row.projId}/${row.taskId}`}
                                        >GO</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            </Grid>


        </Box>
    );
}



