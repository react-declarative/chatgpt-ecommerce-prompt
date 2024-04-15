import { FieldType, OneButton, TypedField } from "react-declarative";

import { Breadcrumbs, IconButton, Link, Stack } from "@mui/material";

import useFitlerContext from "../context/FilterContext";

import { Clear, FilterAltOutlined } from "@mui/icons-material";

const fields: TypedField[] = [
    {
        type: FieldType.Box,
        sx: {
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: 'auto 1fr auto',
        },
        fields: [
            {
                type: FieldType.Typography,
                fieldRightMargin: "0",
                fieldBottomMargin: "0",
                placeholder: 'Filters',
            },
            {
                type: FieldType.Div,
            },
            {
                type: FieldType.Component,
                element: ({ onChange, _fieldData }) => (
                    <IconButton onClick={() => onChange(Object.fromEntries(Object.keys(_fieldData).map((key) => [key, ""])))}>
                        <Clear />
                    </IconButton>
                ),
            }
        ]
    },
    {
        type: FieldType.Text,
        fieldRightMargin: "0",
        fieldBottomMargin: "0",
        name: 'id',
    },
    {
        type: FieldType.Text,
        fieldRightMargin: "0",
        fieldBottomMargin: "0",
        name: 'title',
    },
    {
        type: FieldType.Text,
        fieldRightMargin: "0",
        fieldBottomMargin: "0",
        name: 'details',
    }
];

export const FilterRow = () => {
    const [filterData, setFilterData] = useFitlerContext();
    return (
        <Stack direction="row" alignItems="center" gap={2}>
            <Breadcrumbs>
                <Link underline="hover" color="inherit" href="#">
                    AI
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    href="#"
                >
                    Product list
                </Link>
            </Breadcrumbs>
            <OneButton 
                handler={() => filterData} 
                fields={fields}
                onChange={(data, initial) => {
                    if (!initial) {
                        setFilterData(data)
                    }
                }}
                startIcon={
                    <FilterAltOutlined />
                }
            >
                Filters
            </OneButton>
        </Stack>
    );
}

export default FilterRow;
