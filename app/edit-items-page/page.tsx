
import { createClient } from '@/utils/supabase/server';
import { Items, Customers } from '../shared-types';
import { EditItemAction} from '../shared-actions';
import Link from 'next/link';

export default async function editItems(){
    const supabase = await createClient();

    // fetch records from items table to show in form:
    const { data:d1,error:e1 } = await supabase.from('table_items').select().order('id');
    const items = d1 as Items[];
    if (e1) {console.log ('error:', e1)};

    return(
    <form action={EditItemAction}>
    <h1 className="text-2xl font-bold mb-4"> Manage your shop items here </h1>
    <div> Item List : Edit the required fields and click "SAVE CHANGES ! "
      <p><Link href="/edit-add-items-page"> OR {"--> "} ADD NEW ITEM ! </Link></p>
      <table border={20} cellPadding={8}>
        <thead>
          <tr>
            <th className="text-center">ID</th>
            <th className="text-left">Item</th>
            <th className="text-center">Unit Price ($)</th>
            <th className="text-center">Stock Left</th>
            <th className="text-center">Reserved</th>
            
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="text-left"> {item.id} </td>
              <td className="text-left">
                    <input className="border rounded px-2 py-1 w-auto text-left" type="string"
                    name={`item_name-${item.id}`} defaultValue={item.item_name}>
                    </input>
              </td>
              <td className="text-center">
                    <input className="border rounded px-2 py-1 w-20 text-center" type="number"
                        name={`item_price-${item.id}`} defaultValue={item.item_price.toFixed(2)} min={0.00}
                        step={0.50}>
                    </input>
              </td>
              <td className="text-center">
                    <input className="border rounded px-2 py-1 w-20 text-center" type="number"
                        name={`qty_in_stock-${item.id}`} defaultValue={item.qty_in_stock} 
                        min={0}>
                    </input>
              </td>
              <td className="text-center">
                    <input className="border rounded px-2 py-1 w-20 text-center" type="number"
                        name={`qty_on_hold-${item.id}`} defaultValue={item.qty_on_hold} 
                        min={0}
                        max={item.qty_in_stock}>
                    </input>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p> {"_".repeat(55)} </p>
    <div> {" --->  "}
      <button type="submit"> SAVE CHANGES !</button>
    </div>
    <div> Or go back and don't make changes ?
        <p> {" --->  "} <Link href="/"> CANCEL ! </Link></p>
    </div>
  </form>
      
);
}