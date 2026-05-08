import { Button, capitalize, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";

export default function AttributeSelectAndValue({
    position,
    selectedAttributeIndex,
    attributesAndValues,
    setAttributesAndValues,
    orderOfSelectedAttributes,
    setOrderOfSelectedAttributes
}) {
    const copyOfAttributesAndValues = [...attributesAndValues];
    const copyOfOrderOfSelectedAttributes = [...orderOfSelectedAttributes];

    const handleAttributeValueChange = (index, event) => {
        copyOfAttributesAndValues[index].value = event.target.value;
        setAttributesAndValues(copyOfAttributesAndValues);
    }

    const handleSelectAttributeChange = (event) => {
        const selectedIndex = event.target.value;
        const currentIndex = selectedAttributeIndex;

        copyOfAttributesAndValues[selectedIndex].isSelected = true;
        copyOfAttributesAndValues[currentIndex].isSelected = false;
        copyOfAttributesAndValues[currentIndex].value = '';
        copyOfOrderOfSelectedAttributes[position] = selectedIndex;

        setAttributesAndValues(copyOfAttributesAndValues);
        setOrderOfSelectedAttributes(copyOfOrderOfSelectedAttributes);
    }

    const handleRemoveFilter = () => {
        copyOfAttributesAndValues[selectedAttributeIndex].value = '';
        copyOfAttributesAndValues[selectedAttributeIndex].isSelected = false;
        copyOfOrderOfSelectedAttributes.splice(position, 1);

        setAttributesAndValues(copyOfAttributesAndValues);
        setOrderOfSelectedAttributes(copyOfOrderOfSelectedAttributes);
    }

    return (
        <Stack
            direction='column'
            spacing={1}
            sx={{
                borderStyle: 'dashed',
                borderColor: 'primary.main',
                borderWidth: 0.5,
                marginBottom: 2,
                padding: 1
            }}
        >
            <FormControl>
                <InputLabel shrink={true}>Nome</InputLabel>
                <Select
                    notched={true}
                    label='Nome'
                    value={selectedAttributeIndex}
                    onChange={(event) => handleSelectAttributeChange(event)}
                >
                    <MenuItem value={selectedAttributeIndex}>
                        {capitalize(attributesAndValues[selectedAttributeIndex].name)}
                    </MenuItem>
                    {
                        attributesAndValues.map((attributeAndValue, notSelectedAttributeIndex) => (
                            !attributeAndValue.isSelected && 
                            <MenuItem
                                key={notSelectedAttributeIndex}
                                value={notSelectedAttributeIndex}
                            >
                                {capitalize(attributesAndValues[notSelectedAttributeIndex].name)}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <TextField
                label='Valor'
                variant='outlined'
                value={attributesAndValues[selectedAttributeIndex].value}
                onChange={(event) => handleAttributeValueChange(selectedAttributeIndex, event)}
            />
            <Button name={`btn-${selectedAttributeIndex}`} color='error' variant='contained' onClick={(event) => handleRemoveFilter(event.target.name)}>Remover filtro</Button>
        </Stack>
    )
}