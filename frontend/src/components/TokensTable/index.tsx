import "./TokensTable.scss";
import { useState } from 'react'
import { TokenData } from '../../models/query';
import { Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import { Address } from "../../models/address";
import TokensTableHeader, { Order, HeaderData, HeadCell } from "./../TokensTableHeader";
import Loader from "../Loader";

type Props = {
    tokens: Array<TokenData>,
    loading: boolean,
    onRowClick: (id: Address) => void;
}
const headCells: Array<HeadCell> = [
    {
        id: 'logo',
        disablePadding: true,
        label: '',
    },
    {
        id: 'symbol',
        disablePadding: false,
        label: 'Symbol',
    },
    {
        id: 'name',
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'total_supply',
        numeric: true,
        disablePadding: false,
        label: 'Total supply',
    },
    {
        id: 'description',
        disablePadding: false,
        label: 'Description',
    },
];

function TokensTable(props: Props) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof HeaderData>("symbol");

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator<Key extends keyof any>(
        order: Order,
        orderBy: Key,
    ): (
            a: { [key in Key]: number | string },
            b: { [key in Key]: number | string },
        ) => number {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }


    const handleRequestSort = (
        _event: React.MouseEvent<unknown>,
        property: keyof HeaderData,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
        const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    return (
        <TableContainer className="TokensTable"
            component={Paper}>

            {props.loading && <Loader />}
            <Table style={{ marginBottom: "auto" }}>
                <TokensTableHeader
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    headCells={headCells} />
                <TableBody>
                    {stableSort((props as any).tokens, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((token, index) => (
                            <TableRow className="TokenRow"
                                key={index}
                                onClick={() => props.onRowClick(token.address as any)}>
                                <TableCell style={{ "width": "50px" }}>
                                    {(token.logo as any)?.url &&
                                        <img src={((token.logo as any)?.url)}
                                            alt="logo"
                                            style={{ maxWidth: "48px", maxHeight: "48px" }} />
                                    }

                                </TableCell>
                                <TableCell style={{ "width": "100px" }}>{token.symbol}</TableCell>
                                <TableCell style={{ "width": "100px" }}>{token.name}</TableCell>
                                <TableCell>{token.total_supply &&
                                    <span>{(Number(token.total_supply) / (10 ** Number(token.decimals)))}</span>
                                }</TableCell>
                                <TableCell className="DescriptionTableCell">
                                    <div>{token.description}</div>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <TablePagination className="TokenPagination"
                component="div"
                rowsPerPageOptions={[5, 10, 15, 25]}
                count={props.tokens.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage} />
        </TableContainer>
    )
}
export default TokensTable;
