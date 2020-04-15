import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summary'
})
export class SummaryPipe implements PipeTransform {
  transform(value: string, args?: any) {
    if(!value)
      return null;

    else
      if(value.length > 120)
        return value.substring(0, 120).trim() + '...';

      return value;
  }
}
