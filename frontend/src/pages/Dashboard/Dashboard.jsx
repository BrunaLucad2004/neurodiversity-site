import {  Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Skeleton, Typography } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { getDashboardInfo } from "../../services/api";

export default function Dashboard({ open, onClose: handleClose }) {
    const [dashboardInfo, setDashboardInfo] = useState({});
    const [isFetchingData, setIsFetchingData] = useState(true);

    useEffect(() => {
        getDashboardInfo().then((response) => {
            setDashboardInfo(response.data);
            setIsFetchingData(false);
        });
    }, []);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                <Typography variant="h4">Relatório do sistema</Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            {
                                isFetchingData 
                                ? 
                                    <Skeleton />
                                :
                                `Total de usuários cadastrados: ${dashboardInfo.users.count}`
                            }
                        </Typography>
                    </Grid>
                    {
                        isFetchingData 
                        ? 
                            <Skeleton />
                        :
                        dashboardInfo.artworks.map((artwork) => (
                            <Grid key={artwork.font} item xs={12}>
                                <Typography variant="h5">
                                    {`Total de obras de ${artwork.font}: ${artwork.count}`}
                                </Typography>
                            </Grid>
                        ))
                    }
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">OK</Button>
            </DialogActions>
        </Dialog>
    );
}