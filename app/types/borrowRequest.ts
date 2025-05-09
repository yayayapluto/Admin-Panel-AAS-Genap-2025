import type {Mandatory} from "~/types/mandatory";
import type {User} from "~/types/user";
import type {BorrowDetail} from "~/types/borrowDetail";
import type { ReturnRequest } from "./returnRequest";

export type BorrowRequest = Mandatory & {
    return_date_expected: string
    status: 'pending' | 'approved' | 'rejected'
    notes?: string
    user_id: number
    approved_by: number
    user?: User
    handler?: User
    borrow_details?: BorrowDetail[]
    return_request?: ReturnRequest
}