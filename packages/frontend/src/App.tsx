import { Add } from "@mui/icons-material";
import { Box, Paper } from "@mui/material";
import { Breadcrumbs2, Breadcrumbs2Type, Grid, IBreadcrumbs2Option, IGridColumn, fetchApi, last, useOffsetPaginator } from "react-declarative";

const columns: IGridColumn[] = [
    {
        field: 'id',
        label: 'Id',
    },
    {
        field: 'title',
        label: 'Title',
    },
    {
        field: 'brand',
        label: 'Brand',
    },
    {
        field: 'category',
        label: 'Category',
    },
    {
        field: 'details',
        label: 'Details',
        format: ({ details }) => (
            <Box sx={{ maxHeight: 75, overflow: 'hidden'}}>
                {details.trim()}
            </Box>
        ),
    },
    {
        field: 'tags',
        label: 'Tags',
    },
    {
        field: 'quantity',
        label: 'Quantity',
    },
    {
        field: 'price',
        label: 'Price',
    },
];

/*
"title": "Limcee Vitamin C 500 mg Orange Flavour Chewable, 15 Tablets",
            "brand": "ABBOTT",
            "category": "medicine",
            "details": "Limcee Vitamin C 500 mg Orange Flavour Chewable, 15 Tablets belongs to a class of medicines called nutritional supplements used to prevent and treat nutritional deficiencies and vitamin C deficiency. A nutritional deficiency occurs when the body does not absorb or get enough nutrients from food. Vitamins and minerals are necessary for body development and the prevention of diseases.",
            "tags": "Limcee Vitamin C 500 mg Orange Flavour Chewable, 15 Tablets",
            "image": "Limcee Vitamin C 500 mg Orange Flavour Chewable, 15 Tablets.jpeg",
            "quantity": 49,
            "price": 20

*/

const options: IBreadcrumbs2Option[] = [
    {
        type: Breadcrumbs2Type.Link,
        label: 'GPT4-AI'
    },
    {
        type: Breadcrumbs2Type.Link,
        label: 'Product list',
    },
    {
        type: Breadcrumbs2Type.Button,
        label: 'Add product',
        action: 'add-action',
        icon: Add,
    }
];

export const App = () => {

    const { data, hasMore, loading, onSkip } = useOffsetPaginator({
        handler: async (limit, offset) => {
            const url = new URL('/api/data', window.location.origin);
            url.searchParams.set('start', offset.toString());
            url.searchParams.set('limit', limit.toString());
            return await fetchApi(url);
        },
    });

    return (
        <>
            <Breadcrumbs2
                items={options}
            />  
            <Grid
                outlinePaper
                sx={{
                    height: 'calc(100vh - 16px - 65px)',
                    width: 'calc(100vw - 16px)'
                }}
                columns={columns}
                data={data}
                hasMore={hasMore}
                loading={loading}
                onSkip={onSkip}
            />
        </>

    );
}

export default App;
