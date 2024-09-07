import { Service } from './service';

export interface Host {
  idHost: number;
  Hostname: string;
  statusCode: string;
  SerialNumber: string;
  Services: Service[];
  HostsImageUrl: string;
}
