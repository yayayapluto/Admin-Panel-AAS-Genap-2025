import { useNavigate, useParams } from "react-router";
import useApi from "~/hooks/use-api";
import { useCookies } from "~/hooks/use-cookies";
import React, { useEffect, useState } from "react";
import { Separator } from "~/components/ui/separator";
import { DataTable } from "~/components/ui/data-table";
import { ItemColumn } from "~/components/columns/itemColumn";
import { Spinner } from "~/components/ui/spinner";
import { Button } from "~/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "~/components/ui/breadcrumb";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { cn } from "~/lib/utils";
import type { Warehouse } from "~/types/warehouse";
import { itemUnitColumn } from "~/components/columns/itemUnitColumn";
import { Badge } from "~/components/ui/badge";
import type { Item } from "~/types/item";
import { ArrowUpRight, ArrowUpRightFromCircle } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";


export default function ItemDetail() {
    const params = useParams()
    const navigate = useNavigate()

    const id = params.id
    const [token] = useCookies("auth_token")

    const [item, setItem] = useState<Item | undefined>()
    const [refetch, setRefetch] = useState(true)

    const baseUrl = import.meta.env.VITE_BASE_URL
    const url = `${baseUrl}/api/admin/items/${params.id}`
    const { isLoading, error, result } = useApi<Item>({
        url: url,
        headers: {
            Authorization: `Bearer ${token}`
        },
        trigger: true
    })

    useEffect(() => setRefetch(true), [])

    useEffect(() => {
        if (refetch) setRefetch(false)
    }, [refetch])

    useEffect(() => {
        if (!isLoading && error === null && result !== null) {
            setItem(result)
        }
    }, [isLoading, error, result])

    const [isDeleting, setIsDeleting] = useState(false)
    const { isLoading: isDeleteLoading } = useApi<Warehouse>({
        url: url,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        },
        trigger: isDeleting
    })
    useEffect(() => {
        if (isDeleting) {
            setIsDeleting(false)
            if (!isDeleteLoading) navigate("/items")
        }
    }, [isDeleting])

    return (
        <div className="container mx-auto space-y-4 py-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/items">Items</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{isLoading ? <Spinner /> : item?.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="w-full flex flex-col gap-4 py-4">
                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-4"}>
                    {!isLoading && (
                        <div className={"border-1 rounded-sm p-4"} >
                            <div className="space-y-4">
                                <h4 className="text-lg">
                                    {item?.name}
                                </h4>
                                <Separator className={"my-4"} />
                                <div className="text-sm text-muted-foreground space-y-2">
                                    <div className="border-1 rounded-sm size-36 p-2">
                                        <img src={item?.image_url} alt={item?.name} className="size-full object-contain" />
                                    </div>
                                    <p>
                                        <span className="text-black">
                                            Type:
                                        </span> {item?.type}
                                    </p>
                                    <p>
                                        <span className="text-black">
                                            Description:
                                        </span> {item?.description}
                                    </p>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="flex items-center space-x-4">
                                <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Created at ${item?.created_at}`}</p>
                                <Separator orientation="vertical" />
                                <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Last Update at ${item?.updated_at}`}</p>
                            </div>
                            <Separator className="my-4" />
                            <div className="flex flex-col gap-2">
                                <Button variant={"default"} onClick={() => navigate(`/items/${id}/edit`)}>
                                    Edit this item
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger>
                                        <Button variant={"outline"} className={cn("w-full")}>
                                            Delete this item
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure want to delete this item?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. You will need to create this item again
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => setIsDeleting(true)} className={cn("")}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                            </div>
                        </div>
                    )}
                    {!isLoading && (
                        <div className={"border-1 rounded-sm p-4"} >
                            <div className="flex flex-row items-center gap-2">
                                <h4 className={"text-lg"}>Assigned category</h4>
                                <Button variant={"outline"} className="size-6" onClick={() => navigate(`/categories/${item?.category?.slug}`)}>
                                    <ArrowUpRight />
                                </Button>
                            </div>
                            <Separator className={"my-4"} />
                            {item?.category ? (
                                <>
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-medium leading-none flex flex-row space-x-2 justify-start items-center">
                                            <p>{item?.category?.name}</p>
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            <span className="text-black">
                                                Description:
                                            </span> {item?.category?.description}
                                        </p>
                                    </div>
                                </>
                            ) : (<p className={"text-muted-foreground"}>Deleted category</p>)}
                        </div>
                    )}
                </div>
                {!isLoading && (
                    <div className={"border-1 rounded-sm p-4"} >
                        <h4 className={"text-lg flex items-center"}>
                            <span>List item units in this item</span>
                            <Badge className={cn("px-4 ml-2")}>{item?.item_units?.length ?? 0}</Badge>
                        </h4>
                        <Separator className={"my-4"} />
                        {item?.item_units && <DataTable columns={itemUnitColumn} data={item?.item_units} />}
                    </div>
                )}
            </div>
        </div>
    )
}