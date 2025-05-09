"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CartSelection, Items } from './shared-types';

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const ShopNowButtonAction = async () => {
  return redirect("/shop-now-page");
}

export const OrderlistButtonAction = async () => {
  return redirect("/all-orders-page");
}

export const EditShopButtonAction = async () => {
  return redirect("/edit-items-page");
}

export const SaleTrendButtonAction = async () => {
  return redirect("/sale-trend-page");
}

export async function InsertCartAction (formData:FormData){
  const supabase = await createClient();
  
  var updates = null;
  updates = formData.values().toArray(); //fetch input box values which is sorted according to item.id
  if (updates[0]=='') {updates.shift()}; //remove first element if form data returns '' in front (sometimes) 
  // console.log(updates)
  const selected_user = updates[0];

  for (var x = 1 ; x < updates.length ; x++){ //actual data starts from updates[1], updates[0] = user_id
    
    // check for item with chosen qty >= 1 and skip if chosen qty = 0:
    if (updates[x].valueOf() != 0) {
      // insert to cart table:
      const { error:e1 } = await supabase.from('cart_selection').insert(
        {item_id: x, chosen_qty:updates[x], customer_id:selected_user});
      if (e1) {console.log ('error:', e1)};
      
      // fetch and add the qty_onhold in the item table:
      const { data } = await supabase.from('table_items').select("qty_on_hold");
      const items = data as Items[];
      var new_qty = 0;
      new_qty = Number(updates[x]) + Number(items[x-1]["qty_on_hold"]); //array, id need to -1
      const { error:e2 } = await supabase.from('table_items').update({qty_on_hold: new_qty}).eq('id', x);
      if (e2) {console.log ('error:', e2)};

    }

  };
  return redirect("/cart-confirm-page?customer=".concat(selected_user.toString()));
}

export async function ConfirmCartAction (formData:FormData){
  const supabase = await createClient();
  var updates = null;
  var fields = null;
  updates = formData.values().toArray(); //fetch input box values which is sorted according to id
  fields = formData.keys().toArray(); //fields gives the 'name' of input box, = to cart.id

  //remove first element if form data returns '' in front (sometimes)
  if (updates[0]=='') {updates.shift(); fields.shift();};

  const selected_user = updates[0];
  const total_amount = updates[1];

  //actual data starts from updates[2],[0] = user_id, [1] = total amount
  for (var x = 2 ; x < updates.length ; x++){

    // update the chosen qty in cart selection table:
    const { error:e1 } = await supabase.from('cart_selection')
      .update({chosen_qty: updates[x]})
      .eq('id', fields[x]);
    if (e1) {console.log ('error:', e1)};   

    // check for item with chosen qty >= 1 (continue) and if chosen qty = 0 (delete cart record):
    if (updates[x].valueOf() != 0) {

      // insert to Confirmed Orders table and fetch the last order_id:
      const { error:e3 } = await supabase.from('confirm_orders')
        .insert({customer_id: selected_user,receipt_amount: total_amount});
      const { data:d3 } = await supabase.from('confirm_orders').select('id');
      if (e3) {console.log ('error:', e3)};
   
      // Update order_id in cart_selection table:
      const { error:e7 } = await supabase.from('cart_selection')
        .update({order_id: Number(d3?.length)})
        .eq('id', fields[x]);
      if (e7) {console.log ('error:', e7)};

      // fetch current item qty_in_stock and qty-on_hold:
      const { data:d4, error:e4 } = await supabase.from('cart_selection')
        .select('*, table_items(id, qty_in_stock, qty_on_hold)') // Always rmb to put ID in join query of One to Many!
        .eq('id', fields[x]);
      const carts = d4 as CartSelection[];
      if (e4) {console.log ('error:', e4)};
      
      
      // minus and update qty_in_stock in the item table:
      var new_instock_qty = 0;
      new_instock_qty = Number(carts[x-2]["table_items"]["qty_in_stock"]);
      new_instock_qty = new_instock_qty - Number(updates[x]);

      const { error:e5 } = await supabase.from('table_items')
        .update({qty_in_stock: new_instock_qty})
        .eq('id', carts[x-2]["item_id"]);
      if (e5) {console.log ('error:', e5)};

      // Remove qty_on_hold in the item table after order confirmed:
      var new_onhold_qty = 0;
      new_onhold_qty = Number(carts[x-2]["table_items"]["qty_on_hold"]);
      new_onhold_qty = new_onhold_qty - Number(updates[x]);

      const { error:e2 } = await supabase.from('table_items')
        .update({qty_on_hold: new_onhold_qty})
        .eq('id', carts[x-2]["item_id"]);
      if (e2) {console.log ('error:', e2)};

    } 
    else // chosen_qty = 0 -> delete from cart
    {const { error:e6 } = await supabase.from('cart_selection')
     .delete().eq('id', fields[x]);
     if (e6) {console.log ('error:', e6)};
    }
  }
  console.log("ORDER SENT SUCCESSFUL !");

  return redirect("/shop-now-page");
}

export async function CancelCartAction (formData:FormData){
  const supabase = await createClient();
  var updates = formData.values().toArray(); //fetch input box values which is sorted according to id

  //remove first element if form data returns '' in front (sometimes)
  if (updates[0]=='') {updates.shift()};
  const selected_user = updates[0];
  var fields = formData.keys().toArray(); //fields gives the 'name' of input box, tag to cart.id

  //actual data starts from updates[2],[0] = user_id, [1] = total amount
  for (var x = 2 ; x < updates.length ; x++){
      // fetch current item qty-on_hold:
      const { data:d4, error:e4 } = await supabase.from('cart_selection')
        .select('item_id, table_items(id, qty_on_hold)')
        .eq('id', fields[x]);
      if (e4) {console.log ('error:', e4)};

      const carts = d4 as unknown as CartSelection[]; // works the same if d4 is used
      
      // Remove qty_on_hold in the item table after order confirmed
      var new_qty = 0;
      new_qty = Number(carts[x-2]["table_items"]["qty_on_hold"]); //current qty
      new_qty = new_qty - Number(updates[x]);
      
      const { error:e2 } = await supabase.from('table_items')
        .update({qty_on_hold: new_qty})
        .eq('id', carts[x-2]["item_id"]);
      if (e2) {console.log ('error:', e2)};
  }

  // delete all relevant rec from cart (Order_id = null in current selected customer id)
  const { error:e6 } = await supabase.from('cart_selection')
    .delete().is('order_id', null).eq('customer_id',selected_user);
  if (e6) {console.log ('error:', e6)};
  
  console.log("CANCELLED !");
  return redirect("/shop-now-page");
}

export async function EditItemAction (formData:FormData){
  const supabase = await createClient();

  var x = formData.entries().toArray().length;
  var i = 0;
  const key = formData.keys().toArray();
  const value = formData.values().toArray();
  var col_name = "";

  //remove first element if form data returns '' in front (sometimes)
  if (value[0]=='') { i = 1; }
  
  // iterater form data and Update all fields to item table:
  for (i ; i<x; i++){
  
    // The field names of the input boxes are using the column names of the table split by "-"".
    col_name = key[i].split('-')[0].toString();
    var item_id = key[i].split('-')[1];
    // console.log(col_name,value[i],item_id)
    
    const { error:e1 } = await supabase.from('table_items')
      .update({[col_name] : value[i]})
      .eq('id',item_id);
    if (e1) {console.log ('error:', e1)};
  }
  console.log("UPDATED !!");
  return redirect("/edit-items-page");
}


export async function AddItemAction (formData:FormData){
  const supabase = await createClient();
  const name_new = formData.get('name-new');
  const price_new = formData.get('price-new');
  const qty_in_stock_new = formData.get('qty_in_stock-new');
  const qty_on_hold_new= formData.get('qty_on_hold-new');

  // check for no inputs:
  if (formData.values().toArray().length ==0) {
    console.log ("NO INPUTS !")
  }
  else{
  // insert form data into table_items, id auto incement:
    const { data:d1, error:e1 } = await supabase.from('table_items').insert({
      item_name:name_new,
      item_price:price_new,
      qty_in_stock:qty_in_stock_new,
      qty_on_hold:qty_on_hold_new
    });
    if (e1) {console.log ('error:', e1)}
    else{console.log("ADDED NEW ITEM SUCCESSFUL")};

    return redirect("/edit-items-page");
  }
}

export const OnErrorPage = async () => {
 return redirect("/redirect-page")
}

export const RedirectBtnAction = async () => {
  return redirect("/shop-now-page")
 }