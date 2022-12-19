import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import axios from 'axios';

export default function GroceryList() {
    const [checked, setChecked] = useState([]);
    const [products, setProducts] = useState([]);
    const [title, setTitle] = useState('')

    useEffect(()=>{
        (async()=>{
            const data = await getProduct()
            setProducts(data)
        })()},[])
    
    //get objects list from db
    const getProduct = async () => {
        const gotProd = await axios.get('/api')
        .then((response) => {
            return response.data
        })
        .catch(() => {
            alert('Error')
        });
        return gotProd
    }

    //get array check=true objects from db
    const newCheckedList = async () => {
        const productList = await getProduct()
        const checkArray = []
        productList.map((prodObj) => {
            if (prodObj.check === true) {
                checkArray.push(prodObj._id)
            }
        })
        return checkArray
    }

    // checkbox click function
    const handleToggle = (labelId) => async () => {
        const currentIndex = checked.indexOf(labelId);
        const productList = await getProduct();
        // const firstList = await newCheckedList()
        const newChecked = [...checked]

        if (currentIndex === -1) {
            newChecked.push(labelId);
        } 
        else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        
        if (newChecked.includes(labelId)){

            await axios.put('/api/update', {_id: labelId, check: true})
            .then(() => {
                setProducts(productList)
            })
            .catch(() => {
                console.log('Erorr, data has not been updated')
            });
        }
        else {
            await axios.put('/api/update', {_id: labelId, check: false})
            .then(() => {
                setProducts(productList)
            })
            .catch(() => {
                console.log('Erorr, data has not been updated')
            });
        }
    };

    // input product function
    const handleAdd = async (e) => {
        e.preventDefault()
        let productList = await getProduct();

        if (title) {
            const playload ={
                title: title
            };
            axios({
                url: '/api/save',
                method: 'POST',
                data: playload
            })
            .then(() => {
                console.log('Data has been sent')
                setTitle('')

                setProducts(productList)
            })
            .catch(() => {
                console.log('Erorr, data has not been sent')
            });
        }
        else{
            setProducts(productList)
        }
    };

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '30ch'},
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <TextField id="outlined-basic" label="Outlined" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button>Delete</Button>
                    <Button onClick={handleAdd}>Add</Button>
                </ButtonGroup>
            </div>
            
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {products.map((prodObj) => {
                const labelId = prodObj._id;
        
                return (
                <ListItem
                    key={labelId}
                    disablePadding
                >
                    <ListItemButton role={undefined} onClick={handleToggle(labelId)} dense>
                    <ListItemIcon>
                        <Checkbox
                        defaultChecked={prodObj.check}
                        edge="start"
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                        />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${labelId} ${prodObj.title}`} />
                    </ListItemButton>
                </ListItem>
                );
                })}
            </List>
        </Box>
    );
}