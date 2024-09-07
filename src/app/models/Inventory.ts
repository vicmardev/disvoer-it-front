import {IDataCenter} from './IDataCenter';

export interface Inventory {
	Alias: string;
	IdContract: number;
	IdClient: number;
	Contract: string;
	StartContract: Date;
	EndContract: Date;
	Status: String;
	Year: number;
	createdAt: Date;
	updatedAt: Date;

	Client: {
		Name: string;
	};
	DataCenters: IDataCenter[];
}
