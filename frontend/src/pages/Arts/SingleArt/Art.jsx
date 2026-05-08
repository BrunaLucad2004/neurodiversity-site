// C:\Faculdade\P_7\PES\Sistema CEDOMCA\CEDOMCA_PES\frontend\src\pages\Arts\SingleArt\Art.jsx

import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { ArtData } from "./ArtData";

export const Art = () => {
    const { artId } = useParams();

    return (
        <Grid container
            spacing={5}
            sx={{
                padding: '1.5rem',
            }}
        >
            <Grid item xs={12}>
                <ArtData artId={artId} />
            </Grid>
        </Grid>
    );
}