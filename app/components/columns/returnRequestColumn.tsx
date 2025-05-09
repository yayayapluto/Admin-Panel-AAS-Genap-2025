import type { ColumnDef } from "@tanstack/react-table";
import {useNavigate} from "react-router";
import {Button} from "~/components/ui/button";
import {SquareArrowOutUpRight} from "lucide-react";
import type {Warehouse} from "~/types/warehouse";
import type {BorrowRequest} from "~/types/borrowRequest";
import type {ReturnRequest} from "~/types/returnRequest";


export const ReturnRequestColumn: ColumnDef<ReturnRequest>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "notes",
        header: "Notes",
    },
    {
        accessorKey: "borrow_request_id",
        header: "Borrow request id",
    },
    {
        accessorKey: "handler.username",
        header: "Handled by",
        cell: ({row}) => row.original.handler?.username ?? "-"
    },
    {
        accessorKey: "created_at",
        header: "Created at"
    },
    {
        accessorKey: "updated_at",
        header: "Updated at"
    },
    {
        header: "Action",
        cell: ({ row }) => {
            const returnRequest = row.original;
            const navigate = useNavigate()

            return (
                <Button variant={"outline"} onClick={() => {
                    navigate(`/return-requests/${returnRequest.id}`)
                }}>
                    <SquareArrowOutUpRight/>
                </Button>
            );
        }
    }
];