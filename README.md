# POS_FullStack_Test (For Test)

[[ Deployment ]]
URL:https://pos-full-stack-test-40g0qf0s3-jia92mings-projects.vercel.app/

This app uses Supabase with Next.js in TypeScript. A starter template is used from url (https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

[[ USER STORIES & REQUIREMENTS]]
The User stories -> Requirements are as follow:

Customers
-------------------
1. As a customer, I want to see a list of fruits that are available to buy (complete with stock and pricing information), so that I can decide which fruits I want to buy.
--> Have a page that shows table of item details.
   
2. As a customer, I want to keep track of the fruits and quantity that I have shortlisted (including the total amount I need to pay), so that I can adjust my purchasing decisions as I shop.
--> View selection when browsing item list.
--> Interface to add/remove items from selection.
--> Show and Update total price for selections.

3. As a customer, I want to submit my order of the fruits I selected, so that I can complete my purchase when I am done shopping. Assume that payment is done separate from this POS application.
--> Interface to direct user to "Check Out" page for further processing.

Owner
----------
4. As an owner, I want to see the orders that my customers have submitted, so that I can fulfill their orders.
--> Have a page that shows table of orders.
--> Orders to reflect status "Delivered/Paid/Unpaid" for owner to action.

6. As an owner, I want to be able to add new fruits and amend my stock levels, so that I can keep my online store up to date.
--> Have a page with interface to INSERT, UPDATE and DELETE item record entries.

[[ FRONTEND DESIGN ]]
The following are the notes for page interface design:
- Client Side components like 'useState()', 'useRef()', etc gave errors when rendering pages.
- This project only used Sever side components to achieve the purpose of the app.
- The Home page will have options for user to select.

The following are folder structure for the project that were created:

my-app
|__ app
.    |___ all-orders-page  ----- page.tsx <- for owners to see all records
.    |___ cart-confirm-page  --- page.tsx <- 2nd step of Order confirmation (redirected from 'shop-now-page')
.    |___ edit-add-items-page -- page.tsx
.    |___ edit-items-page  ----- page.tsx
.    |___ redirect_page  ------- page.tsx
.    |___ sale-trend-page  ----- page.tsx
.    |___ see-cart-page  ------- page.tsx
.    |___ shop-now-page  ------- page.tsx
.    |___ page.tsx	<-------------------- Home Page
.    |___ shared-actions.ts
.    |___ shared-types.ts

[[ BACKEND DESIGN ]]
The following are the Database table design and Relations:

<img alt="Database Schema" src="https://github.com/jia92ming/POS_FullStack_Test/blob/main/supabase-schema-pos-test.png">

[[ ISSUES ]]
- Currently Quantity left updating after Cart Confirmation did not update correctly after deployment. It will produce an app error.
- On-Hold quantity also updated incorrectly.
- Item Edit page did not fully update all fields. This will produce app error.

[[ IMPROVEMENTS TO BE MADE ]]
Following are things that can be better in this app project:
- For Loops are used in fetching of Update can be better to resolve complexity
- User authentications
- Client components for better interactivity
- overall, very buggy and laggy
