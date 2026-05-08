//C:\Faculdade\P_7\PES\Sistema CEDOMCA\CEDOMCA_PES\frontend\src\pages\Arts\Comment\Comments.jsx
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { Stack, TextField, Typography, Skeleton, Snackbar, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { getArtId, postComment } from "../../../services/api";
import { CommentItem } from "./CommentItem";

export const Comments = (props) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const { artId } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [openSnackDelete, setOpenSnackDelete] = useState(false);

    useEffect(() => {
        fetchComments().then(() => {
            setIsFirstLoad(false);
        })
    }, []);

    const fetchComments = async () => {
        try {
            const { data } = await getArtId(artId);
            const arts = data;
            setComments(arts.comments);
        } catch (err) {
            console.log(err)
        }
    }

    const handleSubmitComment = async () => {
        setIsLoading(true);
        let data = {
            comment: comment
        }
        try {
            await postComment(artId, data);
            setComment("");
            fetchComments();
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    }

    const handleCloseSnackDelete = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackDelete(false);
    };

    const handleOnDeleteComment = () => {
        fetchComments();
        setOpenSnackDelete(true);
    }

    return (
        <Stack
            direction='column'
            spacing={2}
        >
            <Typography variant='h5' fontWeight='bold' textAlign='center'>Comentários</Typography>
            <Stack
                direction='column'
                height='500px'
                maxHeight='500px'
                overflow='auto'
                spacing={2}
            >
                {isFirstLoad ?
                    <>
                        <Skeleton variant='rectangular' height='10%' />
                        <Skeleton variant='rectangular' height='10%' />
                        <Skeleton variant='rectangular' height='10%' />
                        <Skeleton variant='rectangular' height='10%' />
                        <Skeleton variant='rectangular' height='10%' />
                        <Skeleton variant='rectangular' height='10%' />
                        <Skeleton variant='rectangular' height='10%' />
                    </>
                    :
                    comments.map((comment) => (
                        <CommentItem key={comment.userId} comment={{
                            id: comment.id,
                            author: comment.fullName,
                            createdAt: comment.createdAt,
                            content: comment.comment,
                            userId: comment.userId,
                            artworkId: artId
                        }} onDelete={handleOnDeleteComment} />
                    ))
                }
            </Stack>
            <Stack>
                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={openSnackDelete} autoHideDuration={6000} onClose={handleCloseSnackDelete}>
                    <Alert onClose={handleCloseSnackDelete} severity="success" sx={{ width: '100%' }}>
                        Comentário apagado com sucesso!
                    </Alert>
                </Snackbar>
            </Stack>
            <Stack
                direction='row'
                spacing={1}
            >

                <TextField
                    label="Escreva seu comentário"
                    variant="outlined"
                    multiline
                    rows={3}
                    sx={{
                        width: '90%'
                    }}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                />
                <LoadingButton
                    loading={isLoading ? true : false}
                    loadingPosition="start"
                    startIcon={<SendIcon />}
                    variant="text"
                    onClick={handleSubmitComment}
                />
            </Stack>

        </Stack>
    )
}