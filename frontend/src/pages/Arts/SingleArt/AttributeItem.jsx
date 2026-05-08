//C:\Faculdade\P_7\PES\Sistema CEDOMCA\CEDOMCA_PES\frontend\src\pages\Arts\SingleArt\AttributeItem.jsx
import { capitalize, Grid, Stack, Typography } from "@mui/material";

export const AttributeItem = (props) => {
    const { name, value } = props;

    return (
        <Grid item xs={6}>
            <Stack direction='column'>
                <Typography 
                    variant='h6'
                    fontWeight='bold'
                >
                    {capitalize(name)}
                </Typography>
                <Typography 
                    variant='subtitle1'
                >
                    {typeof value === 'string' && capitalize(value)}
                </Typography>
            </Stack>
        </Grid>
    );
}