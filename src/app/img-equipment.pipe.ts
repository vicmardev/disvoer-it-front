import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imgEquipment'
})
export class ImgEquipmentPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
