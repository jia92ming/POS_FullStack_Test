// Following are the data table columns created in the Supabase db, export as types.
// The propety name needs to be the same as the column names declared in the database.
// joined-relationships are catered for under each type

//Table: "table_owners"
export type Owners = {
    id: number;
    created_at: string;
    owner_name: string;
    owner_password: string
};

//Table: "table_customers"
export type Customers = {
    id: number;
    created_at: string;
    customer_name: string;
    customer_password: string
};

//Table:"table_items":
export type Items = {
    id: number;
    created_at: string;
    item_name: string;
    qty_in_stock: number;
    qty_on_hold: number;
    item_price: number;
    updated_at: string;
};

//Table: "confirm_orders":
export type Orders = {
    id: number;
    created_at: string;
    customer_id: number;
    order_status: string; // ENUM = PAID, UNPAID, DELIVERED, CANCELED
    receipt_amount: number;
    table_customers: Customers; //to link to customer's info.
};

//Table: "cart_selection" - linked to "confirm_orders" and customers:
export type CartSelection = {
    id: number;
    created_at: string;
    item_id: string;
    chosen_qty: number;
    order_id: number;
    customer_id: number;
    table_items: Items; // to link to item's info.
    confirm_orders: Orders; // to link to order table info.
};