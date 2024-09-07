export interface Alarm {
  IdAlarm: number;
  CreatedAt: number; //timestamp
  ack: string;
  Attemps: string;
  Duration: string;
  Notifications: string;
  PluginOutput: string;
  Status: string;
  //remove
  Hostname?: string;
  Plugin?: string;
  Notification?: string;
  Acknowledged?: string;
  Service?: string;
  Serial?: string;
}
