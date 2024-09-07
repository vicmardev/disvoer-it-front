import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imgEquipment'
})
export class ImgEquipmentPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case 'Server':
        return './assets/img/server.png';
      case 'Switch':
        return './assets/img/switch.png';
      case 'Balancer':
        return './assets/img/balancer.png';
      case 'Storage':
        return './assets/img/storage.png'; 
      default:
        break;
    } 
    return null;
  }

}
