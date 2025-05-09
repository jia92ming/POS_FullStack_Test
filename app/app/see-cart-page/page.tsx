// Linked here from "all-orders-page", order id is passed in URL parameter

import { createClient } from '@/utils/supabase/server';
import { CartSelection } from '../shared-types';
import { OnErrorPage } from '../shared-actions';
import Link from 'next/link';

export default async function CartConfrim(props:any) {
    const supabase = await createClient();
    const get_param = await props["searchParams"];

    // fetch records from cart selection table filtered by order_id selected:
    const { data:d2,error:e2 } = await supabase.from('cart_selection')
      .select('* , table_items(id, item_name, item_price, qty_in_stock)')
      .eq('order_id',get_param["id"])
      .order('id');

    const carts = d2 as CartSelection[];
    if (e2) {console.log ('error:', e2)};

    return (
      <form onError={OnErrorPage}>
        <h1 className="text-2xl font-bold mb-4"> {"Order Cart For  : ID ".concat(get_param["id"].toString())} </h1>
        <label>Following are the items select by the customer: </label>
        <table border={20} cellPadding={8}>
          <thead>
            <tr>
              <th className="text-left">Item</th>
              <th className="text-center">Order Qty</th>
            </tr>
          </thead>
          <tbody> 
            {carts.map((cart) => (
              <tr key={cart.id}>
                <td className="text-left">{cart.table_items["item_name"]}</td>
                <td className="text-center">{cart.chosen_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div> {"_".repeat(40)}
          <p> <Link href="/all-orders-page"> GO BACK </Link></p>
        </div>
      </form>
    )
}