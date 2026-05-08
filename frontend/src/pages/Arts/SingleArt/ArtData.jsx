// C:\Faculdade\P_7\PES\Sistema CEDOMCA\CEDOMCA_PES\frontend\src\pages\Arts\SingleArt\ArtData.jsx

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, capitalize, Grid, IconButton, Skeleton, Stack, Typography, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getArtId } from "../../../services/api";
import { AttributeItem } from "./AttributeItem";

export const ArtData = (props) => {
    const { artId } = props;

    const [art, setArt] = useState({});
    const [isFetchingData, setIsFetchingData] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        getArtId(artId).then((response) => {
            setArt(response.data);
            setIsFetchingData(false);
        });
    }, []);

    const buildSkeletonList = () => (
        <Stack direction='column' spacing={2} sx={{ width: '100%', mt: 2 }}>
            <Skeleton variant='rectangular' height={40} />
            <Skeleton variant='rectangular' height={40} />
            <Skeleton variant='rectangular' height={40} />
        </Stack>
    );

    return (
        // O Container centraliza todo o conteúdo e usa o maxWidth="md" (medium) para não esticar demais nas laterais
        <Container maxWidth="md" sx={{ mt: 2, mb: 5 }}>
            
            {/* Header: Botão de voltar e Título centralizado */}
            <Grid container alignItems="center" mb={5}>
                <Grid item xs={1}>
                    <IconButton onClick={() => navigate('/arts/search')} size="large">
                        <ArrowBackIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={10}>
                    <Typography
                        variant='h3'
                        sx={{ textAlign: 'center' }}
                    >
                        {isFetchingData ? <Skeleton width="60%" sx={{ mx: 'auto' }} /> : capitalize(art.title)}
                    </Typography>
                </Grid>
                <Grid item xs={1} /> {/* Coluna vazia para balancear o botão... */}            </Grid>
            
            <Box sx={{ px: { xs: 2, sm: 4 } }}>
                <Typography 
                    variant='h4'
                    marginBottom={2}
                >
                    Dados gerais
                </Typography>
                <Grid container spacing={2}>
                    {
                        isFetchingData 
                        ? 
                            buildSkeletonList() 
                        : 
                            <>
                                <AttributeItem 
                                    isFetchingData
                                    name='Código' 
                                    value={art.code} 
                                />
                                <AttributeItem 
                                    isFetchingData
                                    name='Ficha Catalográfica' 
                                    value={art.font} 
                                />
                            </>
                    }
                </Grid>

                <Typography 
                    variant='h4'
                    marginTop={5}
                    marginBottom={2}
                >
                    Dados característicos
                </Typography>
                <Grid container spacing={2}>
                    {
                        isFetchingData
                        ? 
                            buildSkeletonList()
                        :
                            art.attributes.map((attribute, index) => (
                                <AttributeItem 
                                    key={index}
                                    isFetchingData
                                    name={attribute.name} 
                                    value={attribute.value} 
                                />
                            ))
                    }
                </Grid>
            </Box>
        </Container>
    );
}