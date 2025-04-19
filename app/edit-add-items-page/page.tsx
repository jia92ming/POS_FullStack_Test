
import { AddItemAction} from '../shared-actions';
import Link from 'next/link';

export default async function addItems(){
  var new_id = 0; // use this if using client component to dynamically add more rows

    return(
    <form action={AddItemAction}>
    <h1 className="text-2xl font-bold mb-4"> Manage your shop items here </h1>
    <div> Add New Item : Input ALL the fields and click "SAVE CHANGES !"
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
            <tr key={new_id}>
              <td className="text-left"> {"new"} </td>
              <td className="text-left">
                    <input className="border rounded px-2 py-1 w-auto text-left" type="string"
                        name={`name-new`}>
                    </input>
              </td>
              <td className="text-center">
                    <input className="border rounded px-2 py-1 w-20 text-center" type="number"
                        name={`price-new`} min={0.00}
                        step={0.50}>
                    </input>
              </td>
              <td className="text-center">
                    <input className="border rounded px-2 py-1 w-20 text-center" type="number"
                        name={`qty_in_stock-new`} min={0}>
                    </input>
              </td>
              <td className="text-center">
                    <input className="border rounded px-2 py-1 w-20 text-center" type="number"
                        name={`qty_on_hold-new`} min={0}>
                    </input>
              </td>
            </tr>
        </tbody>
      </table>
    </div>
    <p> {"_".repeat(55)} </p>
    <div> {" --->  "}
      <button type="submit"> SAVE CHANGES !</button>
    </div>
    <div> Or go back and don't make changes ?
        <p> {" --->  "} <Link href="/edit-items-page"> CANCEL ! </Link></p>
    </div>
  </form>
      
);
}