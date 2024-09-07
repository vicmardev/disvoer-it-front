// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,

	//apiUrl: 'http://localhost:7000',
	//discoveryApi: 'http://localhost:5002',
	apiUrl: 'http://localhost:7000',
	discoveryApi: 'http://172.16.3.66:7002',
	ticketImgUrl: 'http://169.59.166.94:71',
	updateContractsUrl: 'http://169.59.166.94:74',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI. mysqldump -u alpha -pAlph4n3t% -h 169.63.177.159 -P4001 -d DiscoverIT  > dumpfilename.sql
