
import { RedirectBtnAction} from '../shared-actions';

export default async function redirect(p0: string){

return(<form action={RedirectBtnAction}>
    <h1 className="text-2xl font-bold mb-4"> No Items : Please Select Your Orders First! </h1>
    <button type="submit"> GO MAKE ORDERS !</button>

</form>);
}