
import { createClient } from '@/utils/supabase/server';
import { Items, Customers } from '../shared-types';
import { InsertCartAction} from '../shared-actions';

export default async function ShopNow() {
  const supabase = await createClient();

  // fetch records from items table to show in form:
  const { data:d1,error:e1 } = await supabase.from('table_items').select().order('id');
  const items = d1 as Items[];
  if (e1) {console.log ('error:', e1)};

  // fetch records from customers table for customer id to show in form:
  const { data:d2,error:e2 } = await supabase.from('table_customers').select('id,customer_name').order('id');
  const customers = d2 as Customers[];
  if (e2) {console.log ('error:', e2)};
  
  // Server Action: Insert records into cart selection after button click, re-direct to Cart Select Page.

  // console.log ('data:', JSON.stringify(data, null, 2)) //for troubleshooting data fetched


    // Return Interface: First column show if this item is newly added or updated within 24hr(1 hour = 3.6e+6 milisec)
  //            Last column allow user to input desired amount, Insert detail into cart table when clicked button.
  return (
    <form action={InsertCartAction}>
      <h1 className="text-2xl font-bold mb-4"> FRUITS FOR SALE ! </h1>
      <h2> Choose Customer :  
          <select name='customer_sel'>
          {customers.map((cus) => (   
            <option key={cus.id} value={cus.id}> {cus.customer_name} </option>
          ))}
          </select>
      </h2>
      <div> Ordering List :  
        <table border={20} cellPadding={8}>
          <thead>
            <tr>
              <th className="text-center"> </th>
              <th className="text-left">Item</th>
              <th className="text-center">Unit Price</th>
              <th className="text-center">Stock Left</th>
              <th className="text-center">Reserved</th>
              <th className="text-center">Order Qty</th>
              
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="text-center">{new Date().valueOf() - new Date(item.created_at).valueOf() < 24*3.6e+6 ||
                    new Date().valueOf() - new Date(item.updated_at).valueOf() < 24*3.6e+6? "*NEW*":""}</td>
                <td className="text-left">{item.item_name}</td>
                <td className="text-center">${item.item_price.toFixed(2)}</td>
                <td className="text-center">{item.qty_in_stock}</td>
                <td className="text-center">{item.qty_on_hold}</td>
                <td>
                  <input className="border rounded px-2 py-1 w-20 text-center" type="number" 
                         name={`Orderqty_id-${item.id}`} defaultValue={0} min={0} 
                         max={item.qty_in_stock - item.qty_on_hold}>

                  </input>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p> {"_".repeat(55)} </p>
      <div> {" --->  "}
        <button type="submit"> ADD TO CART !</button>
      </div>
    </form>
  )
}

