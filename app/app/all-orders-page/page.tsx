//  "use client"; // for dynamic loading and editing data in frontend pages (client side actions)

import { createClient } from '@/utils/supabase/server';
import { Orders, CartSelection,Customers } from '../shared-types';
import { ConfirmCartAction, CancelCartAction } from '../shared-actions';
import Link from 'next/link';

export default async function show_orders(){

  const supabase = await createClient();
 
  //tables:
  //  confirm_orders, cart_selection, table_customers

  // fetch records from Confirm Orders table to show in form:
  const { data:d1,error:e1 } = await supabase.from('confirm_orders')
    .select("*, table_customers(customer_name)").order('id');
  const orders = d1 as Orders[];
  if (e1) {console.log ('error:', e1)};

return(

<><form>
    <h1 className="text-2xl font-bold mb-4"> All Orders are listed here </h1>
        <table border={20} cellPadding={8}>
        <thead>
          <tr>
            <th className="text-center">ID</th>
            <th className="text-center">Order Date/Time</th>
            <th className="text-center">Time Zone</th>
            <th className="text-center">Customer</th>
            <th className="text-center">Order Cart</th>
            <th className="text-center">Receipt Amount</th>
            <th className="text-center">Status</th>
          </tr>
        </thead>
        <tbody> 
          {orders.map((ord) => (
            <tr key={ord.id}>
              <td className="text-center">{ord.id}</td>
              <td className="text-center">{new Date(ord.created_at).toUTCString()}</td>
              <td className="text-center">{new Date(ord.created_at).getTimezoneOffset()/-60}</td>
              <td className="text-center">{ord.table_customers["customer_name"]}</td>
              <td className="text-center">
                <Link href={"/see-cart-page?id=".concat(ord.id.toString())}> Click </Link>
              </td>
              <td className="text-center">${ord.receipt_amount.toFixed(2)}</td>
              <td>
                <select className="text-center" name={'status'} defaultValue= {ord.order_status}>
                    <option key={"status1"} value={"UNPAID"}> {"UNPAID"} </option>
                    <option key={"status2"} value={"PAID"}> {"PAID"} </option>
                    <option key={"status3"} value={"DELIVERED"}> {"DELIVERED"} </option>
                    <option key={"status4"} value={"CANCELED"}> {"CANCELED"} </option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </form>
    <div> {"_".repeat(40)}
          <p> <Link href="/"> GO BACK </Link></p>
    </div>
    </>
);
}