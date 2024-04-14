import { Close } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { FieldType, TypedField, fetchApi, iterateDocuments, useActionModal, useActualRef, useSubject } from "react-declarative";

interface IData {
    id: number;
    [key: string]: unknown;
}

const createId = async () => {
    let lastId = -1;
    for await (const rows of iterateDocuments<IData>({
        createRequest: async ({ limit, offset }) => {
            const url = new URL('/api/data', window.location.origin);
            url.searchParams.set('start', offset.toString());
            url.searchParams.set('limit', limit.toString());
            return await fetchApi<IData[]>(url);
        },
    })) {
        lastId = rows.reduce((acm, { id }) => Math.max(id, acm), lastId);
    }
    return lastId + 1;
};

const read = async (id: number) => {
    const url = new URL(`/api/data/${id}`, window.location.origin);
    return await fetchApi<IData>(url);
};

const create = async (id: number, data: Omit<IData, 'id'>) => {
    const url = new URL(`/api/data`, window.location.origin);
    return await fetchApi<IData>(url, {
        method: 'POST',
        body: JSON.stringify({
            id,
            ...data
        }),
    });
};

const update = async (id: number, data: Omit<IData, 'id'>) => {
    const url = new URL(`/api/data/${id}`, window.location.origin);
    return await fetchApi<IData>(url, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
};


const fields: TypedField[] = [
    {
        type: FieldType.Text,
        name: 'title',
        title: 'Title',
    },
    {
        type: FieldType.Text,
        name: 'brand',
        title: 'Brand',
    },
    {
        type: FieldType.Text,
        name: 'category',
        title: 'Category',
    },
    {
        type: FieldType.Text,
        name: 'details',
        title: 'Details',
    },
    {
        type: FieldType.Text,
        name: 'tags',
        title: 'Tags',
    },
    {
        type: FieldType.Text,
        name: 'quantity',
        title: 'Quantity',
    },
    {
        type: FieldType.Text,
        name: 'price',
        title: 'Price',
    },
];

export const useProductModal = () => {

    const [data, setData] = useActualRef<IData | null>(null);

    const resultSubject = useSubject<boolean>();

    const { pickData, render } = useActionModal({
        title: 'Product card',
        AfterTitle: ({ onClose }) => (
            <IconButton size="small" onClick={onClose}>
                <Close />
            </IconButton>
        ),
        onSubmit: async (data) => {
            if (data) {
                const { id, _create, ...other } = data;
                if (_create) {
                    await create(id, other);
                } else {
                    await update(id, other);
                }
            }
            await resultSubject.next(!!data);
            return true;
        },
        fields,
        handler: () => data.current,
    });

    return {
        pickData: async (id?: number) => {
            if (id) {
                setData(await read(id));
            } else {
                setData({
                    id: await createId(),
                    _create: true,
                });
            }
            pickData();
            return await resultSubject.toPromise();
        },
        render,
    };
};

export default useProductModal;
