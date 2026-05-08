import { Box, Divider, ListItem, ListItemText, Skeleton, Typography } from '@mui/material';
import { ResourceListItemActions } from './ResourceListItemActions';

export const ResourceListItem = (props) => {
  const { primary, secondary, onClickDelete, onClickUpdate, isLoading, isHidden } = props;

  return (
    <Box>
      <ListItem
        secondaryAction={
          <ResourceListItemActions
            onClickDelete={onClickDelete}
            onClickUpdate={onClickUpdate}
            isLoading={isLoading}
            isHidden={isHidden}
          />
        }
      >
        <Box
          sx={{
            maxWidth: '90%',
            width: '100%',
          }}
        >
          <ListItemText
            primary={<Typography variant="h6">{isLoading ? <Skeleton /> : primary}</Typography>}
            secondary={
              <Typography variant="subtitle1">{isLoading ? <Skeleton /> : secondary}</Typography>
            }
          />
        </Box>
      </ListItem>
      <Divider />
    </Box>
  );
};
