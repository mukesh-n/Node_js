import { Base } from "./base.model"
export class product extends Base{
  id:number = 0;
name:string | null = null;
date_of_manufacturing:Date | null = null;
address:string | null = null;
contact_number:number | null = null;
version:number | null = null;
created_on:Date | null = null;
modified_on:Date | null = null;
is_active:boolean = false;
}
export class productWrapper extends product{

}
