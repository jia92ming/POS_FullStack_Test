// Linked here from "shop-now-page", customer id is passed in URL parameter

//  "use client"; // for dynamic loading and editing data in frontend pages (client side actions)
// this caused error during page rendering for some reason.. Have not figure out why yet..

import { createClient } from '@/utils/supabase/server';
import { CartSelection } from '../shared-types';
import { ConfirmCartAction, CancelCartAction } from '../shared-actions';
import { redirect } from "next/navigation";

// import { useEffect, useState, useRef } from 'react'; //can't use without "use client";

export default async function CartConfrim(props:any) {
    const supabase = await createClient();
    const get_param = await props["searchParams"];

    // fetch records from cart selection table, filter by customer_id selected:
    const { data:d2,error:e2 } = await supabase.from('cart_selection').select(
      '* , customer_id, table_items(id, item_name, item_price, qty_in_stock)'
    ).is('order_id',null).eq('customer_id',get_param["customer"]).order('id');

    const carts = d2 as CartSelection[];
    if (e2) {console.log ('error:', e2)};

    // check records exist, redirect to redirect_page if unable to get cart records
    if (carts.length == 0){
      console.log("REDIRECTED DUE TO NO CART RECORDS FOUND FOR THAT CUSTOMER");
      return redirect("/redirect_page");
    }
    
    // calculate total price in order cart:
    var total:number = 0.00;
    for (var x = 0 ; x < carts.length; x++){
      total += carts[x]["table_items"]["item_price"] * carts[x].chosen_qty
    }
    const amount = total.toFixed(2);
    
    const cus_id = carts[0]["customer_id"];
    
    return ( // "cus_id", "total amount" are passed as hidden inputs to the on-click actions.
      <><form action={ConfirmCartAction}>
        <h1 className="text-2xl font-bold mb-4"> ORDER CART </h1>
        <label>This is your current selection : (edit qty as required)</label>
        <input className="hidden" type="number" name={'cus_id'} defaultValue= {cus_id}></input>
        <input className="hidden" type="number" name={'total'} defaultValue= {amount}></input>
        <table border={20} cellPadding={8}>
          <thead>
            <tr>
              <th className="text-left">Item</th>
              <th className="text-center">Unit Price</th>
              <th className="text-center">Order Qty</th>
              <th className="text-center">Sub-Total</th>
            </tr>
          </thead>
          <tbody> 
            {carts.map((cart) => (
              <tr key={cart.id}>
                <td className="text-left">{cart.table_items["item_name"]}</td>
                <td className="text-center">${cart.table_items["item_price"]}</td>
                <td>
                  <input className="border rounded px-2 py-1 w-20 text-center" type="number"
                    name={cart.id.toString()} 
                    defaultValue={cart.chosen_qty} min={0} max={cart.table_items["qty_in_stock"]}>
                  </input>
                  
                </td>
                <td className="text-center">${cart.table_items["item_price"] * cart.chosen_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div> {"_".repeat(40)}
          <p> Total amount : ${amount}</p>
        </div>
        <div>
          <p> Do you confirm? {" --->  "}
            <button type="submit"> CONFIRM & ORDER !</button>
          </p>
        </div>
      </form>
      <form action={CancelCartAction}>
        <input className="hidden" type="number" name={'cus_id'} defaultValue= {cus_id}></input>
        <p> Or do you want to cancel this order? {" --->  "}
          <button type="submit"> CANCEL !</button>
        </p>
      </form></>
    )
}