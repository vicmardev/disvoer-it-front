import { Alarm } from './alarm';

export interface Service {
  IdService: number;
  Name: string;
  CurrentAlarm?: Alarm;
  AlarmList?: Alarm[];
}
