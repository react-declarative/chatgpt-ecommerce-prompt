import { useEffect } from "react";

import { Box } from "@mui/material";
import { Breadcrumbs2, Breadcrumbs2Type, Grid, IBreadcrumbs2Option, IGridAction, IGridColumn, fetchApi, useAsyncAction, useChangeSubject, useOffsetPaginator, useSubject } from "react-declarative";

import FilterRow from "./FilterRow";

import useProductModal from "../hooks/useProductModal";
import useFitlerContext from "../context/FilterContext";

import { Add, Delete } from "@mui/icons-material";

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

const remove = async (id: number) => {
    const url = new URL(`/api/data/${id}`, window.location.origin);
    return await fetchApi(url, {
        method: 'DELETE'
    });
};

const options: IBreadcrumbs2Option[] = [
    {
        type: Breadcrumbs2Type.Component,
        element: FilterRow,
    },
    {
        type: Breadcrumbs2Type.Button,
        label: 'Add product',
        action: 'add-action',
        icon: Add,
    },
];

const actions: IGridAction[] = [
    {
        action: 'remove-action',
        label: 'Remove',
        icon: Delete,
    }
];

export const App = () => {

    const [filterData] = useFitlerContext();

    const filterChanged = useChangeSubject(filterData);

    const reloadSubject = useSubject<void>();

    const { data, hasMore, loading, onSkip } = useOffsetPaginator({
        handler: async (limit, offset) => {
            const url = new URL('/api/data', window.location.origin);
            url.searchParams.set('start', offset.toString());
            url.searchParams.set('limit', limit.toString());
            url.searchParams.set('_sort', 'id');
            url.searchParams.set('_order', 'desc');
            Object.entries(filterData).forEach(([key, value]) => {
                if (key === "id") {
                    value && url.searchParams.set(key, String(value));
                    return;
                }
                value && url.searchParams.set(`${key}_like`, String(value));
            });
            return await fetchApi(url);
        },
        reloadSubject,
    });

    useEffect(() => filterChanged.subscribe(() => {
        reloadSubject.next();
    }), []);

    const { pickData, render } = useProductModal();

    const handleAction = async (action: string) => {
        if (action === "add-action") {
            const isChanged = await pickData();
            if (isChanged) {
                await reloadSubject.next();
            }
        }
    };

    const handleRowAction = async (action: string, id: number) => {
        if (action === "remove-action") {
            await remove(id);
            await reloadSubject.next();
        }
    };

    const { execute: handleOpen } = useAsyncAction(async (id: number) => {
        const isChanged = await pickData(id);
        if (isChanged) {
            await reloadSubject.next();
        }
    });

    return (
        <>
            <Breadcrumbs2
                items={options}
                onAction={handleAction}
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
                onRowClick={async ({ id }) => handleOpen(id)}
                onRowAction={async (action, { id }) => await handleRowAction(action, id)}
                rowActions={actions}
            />
            {render()}
        </>

    );
}

export default App;
