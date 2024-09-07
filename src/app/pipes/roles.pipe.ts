import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roles'
})
export class RolesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case 'User':
          return true;
        break;
       case 'Admin':
        return false;
        break;
      default:
        break;
    }    
    return null;
  }

}
