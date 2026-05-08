//C:\Faculdade\P_7\PES\Sistema CEDOMCA\CEDOMCA_PES\frontend\src\pages\Arts\Comment\CommentItem.jsx
import DeleteIcon from '@mui/icons-material/Delete';
import { Divider, IconButton, Stack, Typography } from "@mui/material";
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/auth';
import { deletComment } from "../../../services/api";
import { hasPermission, CONTEXTS, SCOPES } from '../../../services/permissions'

export const CommentItem = (props) => {
    const { comment, onDelete } = props;
    const { role, id } = useContext(AuthContext);

    const toLocaleDateString = (date) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('pt-BR');

    }

    const handleDeleteComment = async (artworkId, commentId, event) => {
        event.preventDefault();
        try {
            await deletComment(artworkId, commentId);

            onDelete();
        } catch (err) {
            console.log(err)
        }
        onDelete;
    };

    return (
        <Stack direction='column'>
            <Stack
                direction='row'
                spacing={1}
                alignItems='center'
            >
                <Typography variant='h6'>{comment.author}</Typography>
                <Typography variant='body2'>em {toLocaleDateString(comment.createdAt)}</Typography>
                {(id && (hasPermission(role, CONTEXTS.comment, SCOPES.canDelete) || (hasPermission(role, CONTEXTS.comment, SCOPES.canDeleteOwn) && comment.userId === id))) ?
                    <IconButton onClick={(event) => handleDeleteComment(comment.artworkId, comment.id, event)}>
                        <DeleteIcon color="error" />
                    </IconButton>
                    :
                    <></>
                }
            </Stack>
            <Typography variant='body1'>{comment.content}</Typography>
            <Divider />
        </Stack>
    );
}